import { UserCourseEntity } from 'src/user-course/user-course.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('course')
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;

  @OneToMany(() => UserCourseEntity, (usersCourse) => usersCourse.course, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  usersCourse: UserCourseEntity[];
}
