import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: number;

    @Column()
    status: number;
}

// role: 0 - claimer, 1 - approver, 2 - finance, 3 - admin
// status: 0 - inactive, 1 - active, 2 - suspended, 3 - deleted
