import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc'; // Algoritmo de cifrado
const secretKey = crypto.createHash('sha256').update(process.env.CRYPTO_SECRET).digest('base64').substr(0, 32);
const iv = crypto.randomBytes(16); // Vector de inicialización

export function encrypt(text: string) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}


export function decrypt(text: string) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}