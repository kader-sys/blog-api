import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";
import { BlogService } from "../blog.service";
import { BlogEntry } from "../models/blog.entry.interface";

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
    constructor(private userservice: UserService, private blogservice: BlogService) {

    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const params = request.params
        const blogEntryId: number = Number(params.id)
        const user: User = request.user


        return this.userservice.findOne(user.id).pipe(
            switchMap((user: User) => this.blogservice.fiindOne(blogEntryId).pipe(
                map((blogentry: BlogEntry) => {
                    let hasPermission = false
                    if (user.id === blogentry.author.id) {
                        hasPermission = true
                    }
                    return user && hasPermission
                })
            ))
        )
    }
}