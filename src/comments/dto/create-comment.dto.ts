import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    claimRequestId: number;

    @IsNumber()
    @IsOptional()
    repCommentId?: number;
}
