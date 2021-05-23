import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserIsUserGuard implements CanActivate {

  constructor(
    @Inject(forwardRef(() => UserService))
    private userservice: UserService
  ) { }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request  = context.switchToHttp().getRequest()
    const params = request.params
    const user:User = request.user
    console.log(params)

    return this.userservice.findOne(user.id).pipe(
      map((user:User)=>{
        let hasPermission = false

        if(user.id === Number(params.id)){
          hasPermission = true
        }
        return user && hasPermission
      })
    )
  }
}
