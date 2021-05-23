import { type } from "node:os"
import { BlogEntryEntity } from "src/blog/models/blog.entry.entity"
import {Entity,PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany} from "typeorm"
import { userRole } from "./user.interface"




@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({nullable:true})
    email: string
    

    @Column({select:false})
    password: string

 
    @Column({type:'enum', enum: userRole, default: userRole.USER})
    role:userRole 



    @Column({nullable:true})
    profileImage:string

    @OneToMany(type=> BlogEntryEntity, BlogEntryEntity=>BlogEntryEntity.author)
    blogEntries:BlogEntryEntity[]


    @BeforeInsert()
    emailToLoweCase(){
        this.email = this.email.toLowerCase()
    }
}