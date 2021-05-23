import { Body, Controller, Delete, Get, Param, Post ,Put,Query,Request, Res, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BlogService } from './blog.service';
import { UserIsAuthorGuard } from './guards/user-is-author.guard';
import { BlogEntry } from './models/blog.entry.interface';
import { v4 as uuidv4 } from 'uuid';
import { Image } from './models/image.interface';
import { join } from 'path';


export const storage = {
    storage: diskStorage({
        destination: './uploads/blog-imgs',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
            const extension: string = path.parse(file.originalname).ext

            cb(null, `${filename}${extension}`)
        }
    })
}

@Controller('blogs')
export class BlogController {
    constructor(private blogservice:BlogService){}


    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body()BlogEntry:BlogEntry, @Request() req):Observable<BlogEntry>{
        const user = req.user
        return this.blogservice.create(user, BlogEntry)
    }

/*     @Get()
    findBlogEntries(@Query('userId')userId:number):Observable<BlogEntry[]>{
        if(userId == null){
            return this.blogservice.findAll()
        }else{
            return this.blogservice.findByUser(userId)
        }
    } */


    @Get('')
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
      ) {
        limit = limit > 100 ? 100 : limit;
        return this.blogservice.paginateAll({
          page:  Number(page),
          limit: Number(limit),
          route: 'http://localhost:3000/api/blogs',
        });
        }

        @Get('user/:user')
        indexByUser(
            @Query('page') page: number = 1,
            @Query('limit') limit: number = 10,
            @Param('user') userId: number
          ) {
            limit = limit > 100 ? 100 : limit;
            return this.blogservice.paginateByUser({
              page:  Number(page),
              limit: Number(limit),
              route: 'http://localhost:3000/api/blogs',
            },Number(userId));
            }
        


    @Get(':id')
    findOne(@Param('id')id:number):Observable<BlogEntry>{
        return this.blogservice.fiindOne(id)
    }


    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put(':id')
    updateOne(@Param('id')id:number , @Body()blogentry:BlogEntry):Observable<BlogEntry>{
       return this.blogservice.updateOne(Number(id), blogentry)
    }


    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Delete(':id')
    deleteOne(@Param('id')id:number):Observable<any>{
        return this.blogservice.deletOne(id)
    }

    
    @UseGuards(JwtAuthGuard)
    @Post('img/upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Image> {
        return (file)
        
    }

    @Get('image/:imageName')
    findProfileImg(@Param('imageName')imageName, @Res()res ):Observable<Object>{
        return of(res.sendFile(join(process.cwd(), 'uploads/blog-imgs/' + imageName)))
    }

}
