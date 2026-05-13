import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Glasses } from '@glasses-tryon/shared';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('shopId') shopId: string): Promise<Glasses[]> {
    return this.productsService.findAllByShop(shopId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Glasses> {
    return this.productsService.findOne(id);
  }

  @Post()
  async create(@Body() productData: Partial<Glasses>): Promise<Glasses> {
    return this.productsService.create(productData);
  }
}
