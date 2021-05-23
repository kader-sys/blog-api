import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { authenticate } from 'passport';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule
    ],
    providers:[
        UserService
    ],
    controllers:[
        UserController
    ],
    exports:[
        UserService
    ]

})
export class UserModule {}
