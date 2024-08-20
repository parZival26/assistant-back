import * as bcrypt from 'bcrypt';


export const encodePassword = (rawPassword: string): string => {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(rawPassword, SALT);
}