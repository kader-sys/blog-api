import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, of } from 'rxjs';
import { Observable } from 'rxjs';
import { User } from 'src/user/user.interface';
import * as bcrypt from 'bcrypt';


//import bcrypt from 'bcrypt';

@Injectable()

export class AuthService {

    constructor(private readonly jwtservice:JwtService){
    }

    generateJwt(user:User): Observable<string>{
        return from(this.jwtservice.signAsync({user}))
    }
 
     hashPassword(password:string):Observable<any>{
        return from<any>( bcrypt.hash(password, 12))
    } 

     comparPassword(newPassword:string, passwordHash:string): Observable<any | boolean>{
        return of<any | boolean>(bcrypt.compare(newPassword, passwordHash))
    }  
}
