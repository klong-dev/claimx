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
