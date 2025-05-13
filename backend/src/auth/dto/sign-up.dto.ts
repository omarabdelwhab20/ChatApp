import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class SignUpDto {


    @IsNotEmpty({message : "Fullname is required"})
    @MaxLength( 50 ,{message : "Fullname must be less than 50 characters"})
    @MinLength(3 , {message : "Fullname must be more than 3 characters"})
    fullName : string


    @IsNotEmpty({message : "Password is required"})
    @MinLength(8 , {message : "Password must be more than 8 characters"})
    @MaxLength( 50 ,{message : "Password must be less than 50 characters"})
    password : string



    @IsNotEmpty({message : "Email is required"})
    @IsEmail({},{message : "Invalid email"})
    email : string
}
