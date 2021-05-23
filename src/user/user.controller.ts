import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, userRole } from './user.interface';
import { UserService } from './user.service';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { UserIsUserGuard } from 'src/auth/guards/user-is-user.guard';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileImgs',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
            const extension: string = path.parse(file.originalname).ext

            cb(null, `${filename}${extension}`)
        }
    })
}

@Controller('users')
export class UserController {

    constructor(private userservice: UserService) { }

    @Post()
    async createUser(@Body() user: User): Promise<Observable<User | object>> {
        return (await this.userservice.createUser(user)).pipe(
            map((user: User) => user),
            catchError(err => of({ error: err.message }))
        )
    }

    @Post('login')
    logiin(@Body() user: User): Observable<object> {
        return this.userservice.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt }
            })
        )
    }


    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userservice.findOne(params.id)
    }



    @hasRoles(userRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('firstName') firstName: string
    ): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        //.log(firstname)
        if (firstName === null || firstName === undefined) {
            return this.userservice.pagination({ 
                page: Number(page),
                limit: Number(limit),
                route: 'http://localhost:3000/api/users' 
            })
        } else {
            return this.userservice.paginateFilterByFirstName(
                { page: Number(page),
                  limit: Number(limit), 
                  route: 'http://localhost:3000/api/users' },
                { firstName }
            )
        }
    }


    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userservice.updateOne(Number(id), user)
    }

    @hasRoles(userRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User> {
        return this.userservice.deleteOne(Number(id))
    }


    @hasRoles(userRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userservice.updateRoleOfUser(Number(id), user)
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<object> {
        const user:User = req.user
        console.log(user)

        return this.userservice.updateOne(user.id,{profileImage:file.filename}).pipe(
            tap((user:User)=> console.log(user)),
            map((user:User)=>({profileImage:user.profileImage}))
        )
    }


     @Get('profile-img/:imgName')
    findProfileImg(@Param('imgName')imgName, @Res()res ):Observable<object>{
        return of(res.sendFile(join(process.cwd(), 'uploads/profileImgs/' + imgName)))
    }
 

}
