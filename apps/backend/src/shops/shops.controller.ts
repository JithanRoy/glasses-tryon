import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Shop } from '@glasses-tryon/shared';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  async findAll(): Promise<Shop[]> {
    return this.shopsService.findAll();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<Shop> {
    return this.shopsService.findOneBySlug(slug);
  }

  @Post()
  async create(@Body() shopData: Partial<Shop>): Promise<Shop> {
    return this.shopsService.create(shopData);
  }
}
