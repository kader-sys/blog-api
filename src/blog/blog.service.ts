import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from './models/blog.entry.entity';
import { BlogEntry } from './models/blog.entry.interface';

const slugify = require('slugify') ;

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntryEntity) private readonly Blogrepository: Repository<BlogEntryEntity>,
    ) { }

    create(user: User, blogEntry: BlogEntry): Observable<BlogEntry> {
        blogEntry.author = user
        return this.generateSlug(blogEntry.title).pipe(
            switchMap((slug: string) => {
                blogEntry.slug = slug
                return from(this.Blogrepository.save(blogEntry))
            })
        )
    }

    generateSlug(title: any): Observable<any> {
        return of(slugify(title))
    }

    findAll(): Observable<BlogEntry[]> {
        return from(this.Blogrepository.find({ relations: ['author'] }))
    }

    fiindOne(id): Observable<BlogEntry> {
        return from(this.Blogrepository.findOne({ id }, { relations: ['author'] }))
    }

    findByUser(userId): Observable<BlogEntry[]> {
        return from(this.Blogrepository.find({
            where: { author: userId },
            relations: ['author']
        })).pipe(
            map((blogentries: BlogEntry[]) => blogentries)
        )
    }

    updateOne(id: number, blogEntry: BlogEntry): Observable<BlogEntry> {
        return from(this.Blogrepository.update(id, blogEntry)).pipe(
            switchMap((() => this.fiindOne(id)))
        )
    }

    deletOne(id: number): Observable<any> {
        return from(this.Blogrepository.delete(id))
    }


    paginateAll(options: IPaginationOptions): Observable<Pagination<BlogEntry>> {
        return from(paginate<BlogEntry>(this.Blogrepository, options, {
            relations: ['author']
        })).pipe(
            map((blogentries: Pagination<BlogEntry>) => blogentries))
    }



    paginateByUser(options: IPaginationOptions, userId: number): Observable<Pagination<BlogEntry>> {
        return from(paginate<BlogEntry>(this.Blogrepository, options, {
            relations: ['author'],
            where: [
                { author: userId }
            ]
        })).pipe(
            map((blogentries: Pagination<BlogEntry>) => blogentries))
    }
}
