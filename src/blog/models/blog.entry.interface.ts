import { User } from "src/user/user.interface";


export interface BlogEntry {
     id?:number
     title?: string
     slug?: string
     description?: string
     body?: string
     createdAt?: Date
     updatedAt?: Date
     likes?: number
     headerImag?: string
     publishedDate?: Date
     isPublished?: boolean
     author?: User

}