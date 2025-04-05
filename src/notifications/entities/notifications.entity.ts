import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.notifications)
    user: User;

    @Column({ default: "Notification" })
    title: string;

    @Column()
    recipientEmail: string;

    @Column()
    message: string;

    @Column({ enum: ['unread', 'read'], default: 'unread' })
    status: 'unread' | 'read';

    @CreateDateColumn()
    createdAt: Date;
}