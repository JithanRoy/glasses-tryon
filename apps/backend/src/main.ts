import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const routes = [
  ['GET', '/', 'Check if the backend is running'],
  ['GET', '/shops', 'Get all shops'],
  ['GET', '/shops/:slug', 'Get one shop by slug'],
  ['POST', '/shops', 'Create a new shop'],
  ['GET', '/products?shopId={shopId}', 'Get active glasses for a shop'],
  ['GET', '/products/:id', 'Get one glasses product by ID'],
  ['POST', '/products', 'Create a new glasses product'],
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Glasses Try-On API')
    .setDescription('Backend API for shops and glasses products')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(port);
  console.log('');
  console.log(`Backend is running on http://localhost:${port}`);
  console.log(`Swagger docs are available at http://localhost:${port}/api`);
  console.log('');
  console.table(
    routes.map(([method, path, description]) => ({
      Method: method,
      Route: `http://localhost:${port}${path}`,
      Description: description,
    })),
  );
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
