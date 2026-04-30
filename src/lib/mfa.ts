import { generateSecret, generateURI, verify } from 'otplib';
import QRCode from 'qrcode';

export function generateMFASecret(email: string) {
  const secret = generateSecret();
  const otpauth = generateURI({
    secret,
    label: email,
    issuer: 'Primetek Global',
  });
  return { secret, otpauth };
}

export async function generateQRCode(otpauth: string) {
  try {
    return await QRCode.toDataURL(otpauth);
  } catch (err) {
    console.error('QR Code generation error:', err);
    throw new Error('Failed to generate QR code');
  }
}

export async function verifyMFAToken(token: string, secret: string) {
  return await verify({ token, secret });
}
