import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Glasses } from '@glasses-tryon/shared';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Get active glasses products for a shop' })
  @ApiQuery({
    name: 'shopId',
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Shop UUID used to filter products',
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    example: 'true',
    description: 'Set true for admin views that need inactive products too',
  })
  @Get()
  async findAll(
    @Query('shopId') shopId: string,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<Glasses[]> {
    return this.productsService.findAllByShop(shopId, includeInactive === 'true');
  }

  @ApiOperation({ summary: 'Get one glasses product by ID' })
  @ApiParam({
    name: 'id',
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Glasses product UUID',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Glasses> {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new glasses product' })
  @ApiBody({
    schema: {
      example: {
        shopId: '00000000-0000-0000-0000-000000000000',
        name: 'Classic Black Frame',
        brand: 'Acme Eyewear',
        imageUrl: 'https://example.com/glasses-preview.png',
        modelUrl: 'https://example.com/glasses-overlay.png',
        price: 99.99,
        currency: 'USD',
        description: 'Lightweight everyday frame',
        isActive: true,
      },
    },
  })
  @Post()
  async create(@Body() productData: Partial<Glasses>): Promise<Glasses> {
    return this.productsService.create(productData);
  }

  @ApiOperation({ summary: 'Update a glasses product' })
  @ApiParam({
    name: 'id',
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Glasses product UUID',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() productData: Partial<Glasses>,
  ): Promise<Glasses> {
    return this.productsService.update(id, productData);
  }

  @ApiOperation({ summary: 'Delete a glasses product' })
  @ApiParam({
    name: 'id',
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Glasses product UUID',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: true }> {
    return this.productsService.remove(id);
  }
}
