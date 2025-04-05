import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { Notification } from './entities/notifications.entity';
import { User } from '../users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notifications.dto';
import { join } from 'path';
import { get } from 'http';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepo: Repository<Notification>,

        private readonly mailerService: MailerService,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async markAsRead(userId, notificationId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        const notification = await this.notificationRepo.findOne({ where: { id: notificationId } });
        if (!notification) {
            throw new HttpException('Notification not found', 404);
        }
        notification.status = 'read';
        await this.notificationRepo.save(notification);
        return new HttpException('Notification marked as read', 200);
    }

    async markAllAsRead(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        const notifications = await this.notificationRepo.find({ where: { user } });
        if (notifications.length === 0) {
            throw new HttpException('No notifications found', 404);
        }
        for (const notification of notifications) {
            if (notification.status === 'read') continue; // Skip if already read
            notification.status = 'read';
            await this.notificationRepo.save(notification);
        }
        return new HttpException('All notifications marked as read', 200);
    }

    async createNotification(userId, createNotificationDto: CreateNotificationDto) {
        const { title, email, message } = createNotificationDto;
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        // Lưu vào database
        const notification = this.notificationRepo.create({ title, recipientEmail: email, message, user });
        await this.notificationRepo.save(notification);

        // Gửi email
        await this.mailerService.sendMail({
            to: createNotificationDto.email,
            subject: createNotificationDto.title,
            html: this.getMailTemplate(title, email, message, new Date().getFullYear()),
        });

        return new HttpException('Notification sent successfully', 200);
    }

    async getNotifications(userId): Promise<Notification[]> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        return await this.notificationRepo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
    }

    getMailTemplate(title: string, email: string, message: string, year: number): string {
        return `
        <!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background-color: #0066cc;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }

        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }

        .banner {
            width: 100%;
            height: auto;
        }

        .email-body {
            padding: 30px;
        }

        .email-body h2 {
            color: #333333;
        }

        .email-body p {
            font-size: 16px;
            color: #555555;
            line-height: 1.5;
        }

        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
            padding: 20px;
        }

    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1>ClaimX - ${title}</h1>
        </div>

        <img src="https://i.imgur.com/u0YcDA0.gif" alt="Notification Banner" class="banner" />

        <div class="email-body">
            <p>Xin chào ${email},</p>
            <h2>${message}</h2>
            <p>Trân trọng,<br />Đội ngũ ClaimX</p>
        </div>

        <div class="email-footer">
            &copy; ${year} ClaimX. All rights reserved.<br />
            Liên hệ: support@claimx.vn
        </div>
    </div>
</body>

</html>

        `
    }
}
