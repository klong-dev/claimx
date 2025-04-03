import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Req() req, @Body() body: { email: string; message: string }) {
        const userId = req.user.id;
        return this.notificationsService.createNotification(userId, body.email, body.message);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Req() req) {
        const userId = req.user.id;
        return this.notificationsService.getNotifications(userId);
    }

    @Post('mark-as-read')
    @UseGuards(JwtAuthGuard)
    async markAsRead(@Req() req, @Body() body: { notificationId: number }) {
        const userId = req.user.id;
        return this.notificationsService.markAsRead(userId, body.notificationId);
    }

    @Post('mark-all-as-read')
    @UseGuards(JwtAuthGuard)
    async markAllAsRead(@Req() req) {
        const userId = req.user.id;
        return this.notificationsService.markAllAsRead(userId);
    }
}
