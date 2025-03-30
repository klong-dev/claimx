import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.notifications, { eager: true })
    user: User;

    @Column()
    recipientEmail: string;

    @Column()
    message: string;

    @CreateDateColumn()
    createdAt: Date;
}