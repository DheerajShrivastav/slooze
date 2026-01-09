import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
    });

    // Enable validation pipes
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }));

    const port = process.env.PORT || 4000;
    await app.listen(port);

    console.log(`🚀 Server running on http://localhost:${port}/graphql`);
}

bootstrap();
