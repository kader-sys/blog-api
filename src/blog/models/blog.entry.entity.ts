import { type } from "node:os";
import { UserEntity } from "src/user/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('blog_entity')
export class BlogEntryEntity {

    @PrimaryGeneratedColumn()
    id: number


    @Column()
    title: string


    @Column({nullable:true})
    slug: string


    @Column({ default: '' })
    description: string


    @Column({ default: '' })
    body: string


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',nullable:true })
    createdAt: Date


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',nullable:true })
    updatedAt: Date


    @BeforeUpdate()
    updateTimeStamp() {
        this.updatedAt = new Date
    }

    @Column({ default: 0 ,nullable:true})
    likes: number

    @Column({nullable:true})
    headerImag: string

    @Column({nullable:true})
    publishedDate: Date

    @Column({nullable:true})
    isPublished: boolean

    @ManyToOne(type=> UserEntity, user=> user.blogEntries)
    author: UserEntity



}