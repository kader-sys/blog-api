import { BlogEntry } from "src/blog/models/blog.entry.interface";

//import {Exclude} from 'class-transformer'
export class User {

    id?: number;
    firstName?: string;
    lastName?:string;
    email?: string;
    role?:userRole;
    password?:string;
    profileImage?:string
    blogEntries?: BlogEntry[]

}


export enum userRole{
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user'
}