import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser } from 'src/users/common/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('bearer')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@CurrentUser() user: UserEntity) {
    return this.orderService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.orderService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.orderService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.orderService.remove(id, user);
  }
}
