import { IsDate, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 100)
    title: string;

    @IsString()
    description?: string;

    @IsNotEmpty()
    initialDate: Date;

    @IsNotEmpty()
    finalDate: Date;

    @IsString()
    @IsNotEmpty()
    @Length(4, 100)
    speaker: string;

    @IsString()
    @IsNotEmpty()
    @Length(4, 100)
    location: string;
}
