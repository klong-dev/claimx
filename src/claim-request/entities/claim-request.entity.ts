import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Claim } from 'src/claim/entities/claim.entity';
import { ClaimRequestStatus } from 'src/enums/claimRequest.enum';

@Entity()
export class ClaimRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.claims)
    @JoinColumn({ name: 'claimerId' })
    claimer: User;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column({ type: 'float', default: 1.0 })
    hours: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'approverId' })
    approver: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'financeId' })
    finance: User;

    @OneToMany(() => Claim, (claim) => claim.request)
    claims: Claim[];

    @Column()
    @Column({
        type: 'enum',
        enum: ClaimRequestStatus,
        default: ClaimRequestStatus.PENDING
    })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}