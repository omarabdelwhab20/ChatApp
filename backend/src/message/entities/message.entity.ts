import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Message {

    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column()
    chatId : string


    @Column()
    senderId : string


    @Column()
    text : string


    @CreateDateColumn()
    createdAt : Date


    @UpdateDateColumn()
    updatedAt : Date
}
