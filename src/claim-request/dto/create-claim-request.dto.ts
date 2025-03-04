import { IsInt } from 'class-validator';

export class CreateClaimRequestDto {
    @IsInt()
    projectId: number;

    @IsInt()
    hours: number;
}