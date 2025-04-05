import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}