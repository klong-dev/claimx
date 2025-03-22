import { IsEAN, isEmpty, IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsNull } from "typeorm";

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

    @IsEmpty()
    replierId: number;
}
