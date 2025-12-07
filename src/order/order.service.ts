import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, DeepPartial, In } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { Item } from './entities/item.entity';
import { Role } from 'src/users/common/user-roles.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user?: UserEntity) {
    // associate the order with the authenticated user if provided

    const { items, totalAmount } = await this.getItemsFromSimpleArray(
      createOrderDto.items,
    );

    const payload: Partial<Order> = {
      status: createOrderDto.status,
      items,
      totalAmount,
    };

    if (user) {
      payload.user = user;
    }

    const order = this.orderRepository.create(payload as DeepPartial<Order>);
    return this.orderRepository.save(order);
  }

  async findAll(user: UserEntity) {
    if (user.role.includes(Role.ADMIN)) {
      const orders = await this.orderRepository.find();

      return plainToInstance(Order, orders, {
        excludeExtraneousValues: true,
      });
    } else {
      const orders = await this.orderRepository.find({
        where: {
          user: {
            id: user?.id,
          },
        },
      });

      return plainToInstance(Order, orders, {
        excludeExtraneousValues: true,
      });
    }
  }

  async findOne(id: string, user: UserEntity) {
    if (user.role.includes(Role.ADMIN)) {
      const order = await this.orderRepository.findOne({ where: { id } });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return plainToInstance(Order, order, {
        excludeExtraneousValues: true,
      });
    } else {
      const order = await this.orderRepository.findOne({
        where: {
          id,
          user: {
            id: user?.id,
          },
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return plainToInstance(Order, order, {
        excludeExtraneousValues: true,
      });
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: UserEntity) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!user.role.includes(Role.ADMIN) && order.user.id !== user.id) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateOrderDto.status ?? order.status;

    if (updateOrderDto.items) {
      const { items, totalAmount } = await this.getItemsFromSimpleArray(
        updateOrderDto.items,
      );

      order.items = items;

      order.totalAmount = totalAmount;
    }

    const savedOrder = await this.orderRepository.save(order);

    return plainToInstance(Order, savedOrder, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string, user: UserEntity) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!user.role.includes(Role.ADMIN) && order.user.id !== user.id) {
      throw new NotFoundException('Order not found');
    }

    return this.orderRepository.delete(id);
  }

  async getItemsFromSimpleArray(
    items: string[],
  ): Promise<{ items: Item[]; totalAmount: number }> {
    if (items.length === 0) {
      return { items: [], totalAmount: 0 };
    }

    const foundItems = await this.itemRepository.findBy({
      id: In(items),
    });

    const totalAmount = foundItems.reduce(
      (sum, item) => sum + Number(item.price),
      0,
    );

    return { items: foundItems, totalAmount };
  }
}
