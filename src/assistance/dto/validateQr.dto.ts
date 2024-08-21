import { IsNotEmpty, IsString } from "class-validator";

export class ValidateQrDto {
    @IsNotEmpty()
    @IsString()
    qrCode: string;

}