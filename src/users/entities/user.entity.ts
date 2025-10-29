import { Exclude, Expose } from 'class-transformer';
import { Order } from 'src/order/entities/order.entity';
import { Roles } from 'src/users/common/user-roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.CUSTOMER] })
  @Expose()
  role: Roles[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Expose({ groups: ['admin'] })
  createdAt: Timestamp;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Expose({ groups: ['admin'] })
  updateAt: Timestamp;

  @OneToMany(() => Order, (order) => order.user)
  @Expose()
  orders: Order[];
}
