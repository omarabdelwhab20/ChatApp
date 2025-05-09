import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column({
        type: 'varchar',
        length: 255,
        nullable : false
    })
    fullName : string


    @Column({
        type: 'varchar',
        unique: true,
        nullable : false
    })
    email : string


    @Column({
        type: 'varchar',
        nullable : false
    })
    password : string

    
    @Column({
        type : 'boolean',
        default : false
    })
    isVerified : boolean


    @Column({
        type: 'varchar',
        nullable : true
    })
    resetPasswordCode : string


    @Column({
        type: 'date',
        nullable : true
    })
    resetPasswordCodeExpires : Date

    @Column({
        type : 'varchar',
        nullable : true
    })
    verificationLink : string


    @Column({
        type : 'date',
        nullable : true
    })
    verificationLinkExpires : Date


    @CreateDateColumn()
    createdAt : Date


    @UpdateDateColumn()
    updatedAt : Date






}
