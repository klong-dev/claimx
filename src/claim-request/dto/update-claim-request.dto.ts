import { PartialType } from '@nestjs/mapped-types';
import { CreateClaimRequestDto } from './create-claim-request.dto';

export class UpdateClaimRequestDto extends PartialType(CreateClaimRequestDto) {}
