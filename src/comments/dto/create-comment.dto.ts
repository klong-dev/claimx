import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    claimRequestId: number;

    @IsNumber()
    @IsNotEmpty()
    authorId: number;

    @IsNumber()
    @IsOptional()
    replierId?: number;
}
