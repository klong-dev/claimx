import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UserProjectDto {
    @IsNumber()
    @IsNotEmpty()
    projectId: number;

    @IsNumber()
    @IsNotEmpty()
    memberId: number;

    @IsString()
    @IsNotEmpty()
    role: string;
}
