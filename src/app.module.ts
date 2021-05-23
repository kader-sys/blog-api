import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Connection } from 'typeorm';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { BlogService } from './blog/blog.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "kader123",
        database: "shoping",
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: true 
      }
    ),
    UserModule,
    AuthModule,
    BlogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection:Connection){}

}
