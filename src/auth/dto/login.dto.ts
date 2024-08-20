import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @Length(4,100)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(8,100)
    password: string;
}