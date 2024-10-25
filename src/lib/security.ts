import { sanitize } from 'isomorphic-dompurify';
import { hash, compare } from 'bcrypt';

// XSS対策
export function sanitizeInput(input: string): string {
  return sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

// パスワードのハッシュ化
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

// パスワードの検証
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

// 安全なJSONパース
export function safeJSONParse(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}