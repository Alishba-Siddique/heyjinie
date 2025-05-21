// src/services/encryption.service.ts

import crypto from 'crypto';

function deriveKey(passphrase: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
}

// Encrypt function
export function encrypt(data: string, passphrase: string): string {
    const salt = crypto.randomBytes(16);
    const key = deriveKey(passphrase, salt);
    const iv = crypto.randomBytes(16); // AES-CBC uses a 16-byte IV
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    const hmac = crypto.createHmac('sha256', key).update(Buffer.concat([salt, iv, encrypted])).digest();

    return Buffer.concat([salt, iv, hmac, encrypted]).toString('base64');
}

// Decrypt function
export function decrypt(encryptedData: string, passphrase: string): string {
    const data = Buffer.from(encryptedData, 'base64');
    const salt = data.slice(0, 16);
    const iv = data.slice(16, 32);
    const hmac = data.slice(32, 64);
    const encrypted = data.slice(64);
    const key = deriveKey(passphrase, salt);

    const calculatedHmac = crypto.createHmac('sha256', key).update(Buffer.concat([salt, iv, encrypted])).digest();
    if (!crypto.timingSafeEqual(hmac, calculatedHmac)) {
        throw new Error('HMAC verification failed');
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
}