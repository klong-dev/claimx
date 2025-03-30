import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserProject } from 'src/user-project/entities/user-project.entity';
import { ClaimRequest } from 'src/claim-request/entities/claim-request.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ unique: true, nullable: true })
    phone: string;

    @Column({ nullable: true })
    bankInfo: string;

    @Column({ default: 0 })
    role: number; // 0 - claimer, 1 - approver, 2 - finance, 3 - admin

    @Column({ default: 1 })
    status: number; // 0 - inactive, 1 - active, 2 - suspended, 3 - deleted

    @OneToMany(() => UserProject, (userProject) => userProject.user)
    projects: UserProject[];

    @OneToMany(() => ClaimRequest, (claimRequest) => claimRequest.claimer)
    claims: ClaimRequest[];

    @OneToMany(() => Notification, (notify) => notify.user)
    notifications: Notification[];

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Comment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}