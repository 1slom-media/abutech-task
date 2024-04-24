import { CourseEntity } from '../course/course.entity';
import { UsersEntity } from '../users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('user-course')
export class UserCourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (user) => user.courses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UsersEntity;

  @ManyToOne(() => CourseEntity, (course) => course.usersCourse, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  course: CourseEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
