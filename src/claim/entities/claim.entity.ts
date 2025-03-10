import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ClaimRequest } from 'src/claim-request/entities/claim-request.entity';

@Entity()
export class Claim {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'time' })
    from: string; // HH:mm:ss

    @Column({ type: 'time' })
    to: string; // HH:mm:ss

    @Column()
    hours: number;

    @Column({ type: 'text', nullable: true })
    remark: string;

    @ManyToOne(() => ClaimRequest, (request) => request.claims)
    @JoinColumn({ name: 'requestId' })
    request: ClaimRequest;

    @Column({ default: 1 })
    status: number; // 0 - inactive, 1 - active, 2 - suspended, 3 - deleted

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}