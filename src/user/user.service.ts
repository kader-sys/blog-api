import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from "typeorm";
import { User, userRole } from './user.interface';
import { from, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
    constructor(
        private authservice: AuthService,
        @InjectRepository(UserEntity) private readonly userrepository: Repository<UserEntity>) {

    }

    async createUser(user: User): Promise<Observable<any>> {
        return (await this.authservice.hashPassword(user.password)).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity()
                newUser.firstName = user.firstName
                newUser.lastName = user.lastName
                newUser.email = user.email
                newUser.password = passwordHash
                newUser.role = userRole.USER

                return from(this.userrepository.save(newUser)).pipe(
                    map((user) => {
                        const { password, ...result } = user
                        return result
                    }),
                    catchError(err => throwError(err))
                )
            })
            //return from(this.userrepository.save(user))
        )

    }

    findOne(id: number): Observable<any> {
        return from(this.userrepository.findOne({id}, {relations:['blogEntries']})).pipe(
            map((user) => {
                const { password, ...result } = user
                return result
            })
        )
        //return (this.userrepository.findOne({id}))
    }



    findAll(): Observable<any> {
        return from(this.userrepository.find()).pipe(
            map((users) => {
                users.forEach(function (v) { delete v.password })
                return users
            })
        )

        //return from(this.userrepository.find())
    }

    pagination(options: IPaginationOptions): Observable<Pagination<User>> {

        return from(paginate<any>(this.userrepository, options)).pipe(
            map((userPagable: Pagination<User>) => {
                userPagable.items.forEach(function (v) { delete v.password })

                return userPagable;
            })
        )
    }


    paginateFilterByFirstName(options: IPaginationOptions, user: any): Observable<Pagination<User>> {
        return from(this.userrepository.findAndCount({
            skip: options.page * options.limit || 0,
            take: options.limit || 10,
            order: { id: "ASC" },
            select: ['id', 'firstName', 'lastName', 'email', 'role'],
            where: [
                { firstName: Like(`%${user.firstName}%`) }
            ]
        })).pipe(
            map(([users, totalUsers]) => {
                console.log(users)
                console.log(options.page)
                const userPageable: Pagination<User> = {
                    items: users,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + ``,
                        next: options.route + `?lmit=${options.limit}&page=${options.page + 1}`,
                        last: options.route + `?lmit=${options.limit}&page=${Math.ceil(totalUsers / options.limit)}`,
                    },
                    meta: {
                        currentPage: options.page,
                        itemCount: users.length,
                        itemsPerPage: options.limit,
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / options.limit)
                    }
                }

                return userPageable
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userrepository.delete(id))
    }

    updateOne(id: number, user: User) {
        delete user.email
        delete user.password
        delete user.role
        return from(this.userrepository.update(id, user)).pipe(
            switchMap(() => this.findOne(id))
        )
    }


    login(user: User): Observable<string> {
        return this.validatUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authservice.generateJwt(user).pipe(map((jwt: string) => jwt))
                } else {
                    return 'wrong credential'
                }
            })
        )
    }


    validatUser(email: string, password: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) => this.authservice.comparPassword(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const { password, ...result } = user
                        return result
                    } else {
                        throw Error
                    }
                })
            ))
        )
    }


    findByMail(email: string): Observable<User | object> {
        return from(this.userrepository.findOne({ email }))
    }


    updateRoleOfUser(id: number, user: User): Observable<any> {
        return from(this.userrepository.update(id, user))
    }

}
