import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Entity()
export class UserProject {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.projects)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Project, (project) => project.userProjects)
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column()
    role: string; // VD: Developer, Tester, Manager

    @Column({ default: 1 })
    status: number; // 0 - inactive, 1 - active, 2 - suspended, 3 - deleted
}