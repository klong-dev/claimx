import { IsString, IsNotEmpty } from 'class-validator';

export class UserProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    startDate: Date;

    @IsString()
    @IsNotEmpty()
    endDate: Date;
}
