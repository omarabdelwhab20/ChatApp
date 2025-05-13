import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {

    @IsNotEmpty({message : "Text is required"})
    @IsString({message : "text must be string"})
    text : string



    @IsNotEmpty({message : "Chat id is rquired"})
    @IsString({message : "Chat id must be string"})
    chatId : string
}
