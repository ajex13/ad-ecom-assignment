import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}
  create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  async findAll() {
    const orders = await this.orderRepository.find();

    return plainToInstance(Order, orders, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({
      id: id,
      ...updateOrderDto,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const savedOrder = await this.orderRepository.save(order);

    return plainToInstance(Order, savedOrder, {
      excludeExtraneousValues: true,
    });
  }

  remove(id: string) {
    return this.orderRepository.delete(id);
  }
}
