import { uniqueFileName } from '../data.factory';

type FileOptions = {
  name?: string;
  mimeType?: string;
  buffer?: Buffer;
};

const buildDummyPdfBuffer = () => Buffer.from('%PDF-1.4\n% Playwright dummy content\n', 'utf-8');

export const buildValidFile = (options: FileOptions = {}) => ({
  name: options.name ?? uniqueFileName('pdf'),
  mimeType: options.mimeType ?? 'application/pdf',
  buffer: options.buffer ?? buildDummyPdfBuffer(),
});

export const buildInvalidFile = (options: FileOptions = {}) => ({
  name: options.name ?? uniqueFileName('txt'),
  mimeType: options.mimeType ?? 'text/plain',
  buffer: options.buffer ?? Buffer.from('Plain text content', 'utf-8'),
});
