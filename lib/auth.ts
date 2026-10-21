import { jwtVerify, SignJWT } from 'jose';

export const ADMIN_COOKIE_NAME = 'wd_admin_token';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'whitediamond_secure_jwt_secret_token_9918237192';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AdminPayload {
  email: string;
  username: string;
  role: 'admin';
}

export async function createAdminToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as AdminPayload;
  } catch (err) {
    return null;
  }
}
