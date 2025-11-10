import { randomUUID } from 'crypto';

export const uniqueEmail = (prefix = 'candidate') => {
  const id = randomUUID().slice(0, 8);
  return `${prefix}.${Date.now()}.${id}@example.com`;
};

export const uniqueFileName = (extension = 'pdf') => {
  const id = randomUUID().slice(0, 8);
  return `file-${Date.now()}-${id}.${extension}`;
};
