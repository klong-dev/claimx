import { IsString } from "class-validator";

export class CreateClaimDto {
    @IsString()
    date: string;

    @IsString()
    from: string;

    @IsString()
    to: string;

    @IsString()
    hours: string;

    @IsString()
    remark: string;
}