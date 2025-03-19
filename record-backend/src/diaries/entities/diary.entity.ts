import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text') // 일기 내용을 저장할 텍스트 컬럼 추가
  content: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  mood: string;

  @ManyToOne(() => User, user => user.diaries)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
