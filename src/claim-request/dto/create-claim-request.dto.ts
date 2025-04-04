import { IsArray, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateClaimDto } from 'src/claim/dto/create-claim.dto';

export class CreateClaimRequestDto {
    @IsInt()
    projectId: number;

    @IsInt()
    hours: number;

    @IsString()
    additionalRemark: string;

    @IsArray()
    @Type(() => CreateClaimDto)
    claims: CreateClaimDto[];
}