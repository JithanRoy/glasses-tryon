import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { Shop } from '@glasses-tryon/shared';

@ApiTags('Shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @ApiOperation({ summary: 'Get all shops' })
  @Get()
  async findAll(): Promise<Shop[]> {
    return this.shopsService.findAll();
  }

  @ApiOperation({ summary: 'Get one shop by slug' })
  @ApiParam({
    name: 'slug',
    example: 'vision-center',
    description: 'Shop slug used for QR/shop routing',
  })
  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<Shop> {
    return this.shopsService.findOneBySlug(slug);
  }

  @ApiOperation({ summary: 'Create a new shop' })
  @ApiBody({
    schema: {
      example: {
        name: 'Vision Center',
        slug: 'vision-center',
        logoUrl: 'https://example.com/logo.png',
        config: {
          primaryColor: '#000000',
        },
      },
    },
  })
  @Post()
  async create(@Body() shopData: Partial<Shop>): Promise<Shop> {
    return this.shopsService.create(shopData);
  }
}
