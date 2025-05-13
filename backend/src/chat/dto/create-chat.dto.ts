import { IsNotEmpty } from "class-validator";

export class CreateChatDto {
    @IsNotEmpty({message : "Sender id is required"})
    senderId : string


    @IsNotEmpty({message : "Receiver id is required"})
    receiverId : string
}
