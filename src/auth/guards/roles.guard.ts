import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { use } from "passport";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";

@Injectable()
export class RolesGuard {
    constructor(
        private reflector: Reflector,

        @Inject(forwardRef(() => UserService))
        private userservice: UserService
    ) {

    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler())
        if (!roles) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user: User = request.user

        return this.userservice.findOne(user.id).pipe(
            map((user: User) => {
                const hasRole = () => roles.indexOf(user.role) > -1
                let hasPermission: boolean = false

                if (hasRole()) {

                    console.log('has role true')
                    hasPermission = true
                }
                  //return true
                return user && hasPermission
            })
        )

    }
}