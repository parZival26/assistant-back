import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, ValidateIf } from "class-validator";

export class AddUsersToEventDto {
    @IsNotEmpty({ message: 'users array cannot be empty' })
    @IsArray()
    @ArrayNotEmpty({ message: 'users array must contain at least one user' })
    @IsNumber({}, { each: true, message: 'Each user must be a number' })
    users: number[];

    @IsNotEmpty({ message: 'event ID cannot be empty' })
    @IsNumber({}, { message: 'event ID must be a number' })
    event: number;
}