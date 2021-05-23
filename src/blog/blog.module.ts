import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { BlogEntryEntity } from './models/blog.entry.entity';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([BlogEntryEntity]),
        AuthModule,
        UserModule
    ],
    controllers: [
        BlogController
    ],
    providers:[
        BlogService
    ]
})
export class BlogModule {}
