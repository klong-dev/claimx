import { PartialType } from '@nestjs/mapped-types';
import { CreateClaimRequestDto } from './create-claim-request.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateClaimRequestDto extends PartialType(CreateClaimRequestDto) {
    @IsNumber()
    requestId: number;
}
