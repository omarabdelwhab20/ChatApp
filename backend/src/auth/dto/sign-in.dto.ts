import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class SignInDto {


    @IsNotEmpty({message : "Password is required"})
    @MinLength(8 , {message : "Password must be more than 8 characters"})
    @MaxLength( 50 ,{message : "Password must be less than 50 characters"})
    password : string



    @IsNotEmpty({message : "Email is required"})
    @IsEmail({},{message : "Invalid email"})
    email : string
}
