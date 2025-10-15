import { encrypt, decrypt } from './encryption';

// Define which fields should be encrypted
const ENCRYPTED_FIELDS = [
  'taxId',
  'vatId', 
  'address',
  'city',
  'postalCode',
  'phone',
  'company'
] as const;

// Helper function to encrypt object fields
const encryptFields = (data: Record<string, unknown>): Record<string, unknown> => {
  if (!data || typeof data !== 'object') return data;
  
  const encrypted = { ...data };
  
  for (const field of ENCRYPTED_FIELDS) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encrypt(encrypted[field] as string);
    }
  }
  
  return encrypted;
};

// Helper function to decrypt object fields
const decryptFields = (data: Record<string, unknown>): Record<string, unknown> => {
  if (!data || typeof data !== 'object') return data;
  
  const decrypted = { ...data };
  
  for (const field of ENCRYPTED_FIELDS) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      decrypted[field] = decrypt(decrypted[field] as string);
    }
  }
  
  return decrypted;
};

// Helper functions for manual encryption/decryption when needed
export const encryptUserData = (userData: Record<string, unknown>): Record<string, unknown> => encryptFields(userData);
export const decryptUserData = (userData: Record<string, unknown>): Record<string, unknown> => decryptFields(userData);
