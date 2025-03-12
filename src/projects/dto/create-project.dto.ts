import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    startDate: Date;

    @IsString()
    @IsNotEmpty()
    endDate: Date;

    @IsNumber()
    status: number;
}
