import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { Notification } from './entities/notifications.entity';
import { User } from '../users/entities/user.entity';

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
        for (const notification of notifications) {
            notification.status = 'read';
            await this.notificationRepo.save(notification);
        }
        return new HttpException('All notifications marked as read', 200);
    }

    async createNotification(userId, email: string, message: string) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        // Lưu vào database
        const notification = this.notificationRepo.create({ recipientEmail: email, message, user });
        await this.notificationRepo.save(notification);

        // Gửi email
        await this.mailerService.sendMail({
            to: email,
            subject: 'Thông báo từ ClaimX',
            text: message,
            html: `<p>${message}</p>`,
        });

        return new HttpException('Notification sent successfully', 200);
    }

    async getNotifications(userId): Promise<Notification[]> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        return await this.notificationRepo.find();
    }
}
