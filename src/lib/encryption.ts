import crypto from 'crypto';

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-cbc';

// Ensure encryption key is 32 characters
const getEncryptionKey = (): Buffer => {
  return crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
};

export const encrypt = (text: string): string => {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, key);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (encryptedText: string): string => {
  const key = getEncryptionKey();
  const textParts = encryptedText.split(':');
  textParts.shift(); // Remove IV (not used in this simplified version)
  const encrypted = textParts.join(':');

  const decipher = crypto.createDecipher(ALGORITHM, key);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// Hash password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import('bcrypt');
  return bcrypt.hash(password, 12);
};

// Verify password using bcrypt
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(password, hashedPassword);
};

// Generate secure random token
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate secure random string for verification codes
export const generateVerificationCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};
