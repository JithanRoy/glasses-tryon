import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ShopCatalog, ShopsService } from './shops.service';
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

  @ApiOperation({ summary: 'Get shop details with active glasses products' })
  @ApiParam({
    name: 'slug',
    example: 'vision-center',
    description: 'Shop slug used for QR/shop routing',
  })
  @Get(':slug/catalog')
  async findCatalog(@Param('slug') slug: string): Promise<ShopCatalog> {
    return this.shopsService.findCatalogBySlug(slug);
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

  @ApiOperation({ summary: 'Update a shop' })
  @ApiParam({
    name: 'id',
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Shop UUID',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() shopData: Partial<Shop>,
  ): Promise<Shop> {
    return this.shopsService.update(id, shopData);
  }

  @ApiOperation({ summary: 'Delete a shop' })
  @ApiParam({
    name: 'id',
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Shop UUID',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: true }> {
    return this.shopsService.remove(id);
  }
}
