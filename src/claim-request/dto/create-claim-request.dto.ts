import { IsArray, IsInt, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateClaimDto } from 'src/claim/dto/create-claim.dto';

export class CreateClaimRequestDto {
    @IsInt()
    projectId: number;

    @IsInt()
    hours: number;

    @IsArray()
    @Type(() => CreateClaimDto)
    claims: CreateClaimDto[];
}