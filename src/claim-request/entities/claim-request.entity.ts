import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Claim } from 'src/claim/entities/claim.entity';

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

    @Column()
    hours: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'approverId' })
    approver: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'financeId' })
    finance: User;

    @OneToMany(() => Claim, (claim) => claim.request)
    claims: Claim[];

    @Column({ default: 0 })
    status: number; // 0 - draft, 1 - pending approve, 2 - approved, 3 - paid

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}