import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserProject } from 'src/user-project/entities/user-project.entity';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date;

    @Column({ default: 0 })
    status: number; // 0 - inactive, 1 - active, 2 - suspended, 3 - deleted

    @OneToMany(() => UserProject, (userProject) => userProject.project)
    userProjects: UserProject[];
}