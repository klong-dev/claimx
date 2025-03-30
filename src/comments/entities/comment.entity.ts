import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ClaimRequest } from 'src/claim-request/entities/claim-request.entity';


@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => ClaimRequest, (claimRequest) => claimRequest.comments)
    @JoinColumn({ name: 'claimRequestId' })
    claimRequest: ClaimRequest;

    @ManyToOne(() => User, (author) => author.comments)
    @JoinColumn()
    author: User;

    @ManyToOne(() => User, (replier) => replier.comments)
    @JoinColumn()
    replier: User;

    @ManyToOne(() => Comment, (comment) => comment.replies)
    @JoinColumn({ name: 'repCommentId' })
    repComment: Comment;

    @OneToMany(() => Comment, (comment) => comment.repComment)
    replies: Comment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
