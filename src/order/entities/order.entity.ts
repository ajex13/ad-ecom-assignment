import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Item } from './item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  totalAmount: number;

  @Column()
  status: string;

  @OneToMany(() => Item, (item) => item.order, { cascade: true })
  items: Item[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Timestamp;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Timestamp;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;
}
