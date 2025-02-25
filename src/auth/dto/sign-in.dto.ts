import { IsString, IsNotEmpty } from 'class-validator';

export class SignInDto {
    @IsString()
    email: string;

    @IsString()
    password: string;
}