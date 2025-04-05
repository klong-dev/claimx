import { Controller, Post, Body, Get, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notifications.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Req() req, @Body(new ValidationPipe()) createNotificationDto: CreateNotificationDto) {
        const userId = req.user.id;
        return this.notificationsService.createNotification(userId, createNotificationDto);
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
