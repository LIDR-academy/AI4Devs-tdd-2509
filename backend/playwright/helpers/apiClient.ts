import { APIRequestContext, APIResponse } from '@playwright/test';

type JsonData = Record<string, unknown>;

type MultipartValue =
  | string
  | number
  | boolean
  | {
      name: string;
      mimeType: string;
      buffer: Buffer;
    };

type MultipartData = Record<string, MultipartValue>;

export const postJson = (
  request: APIRequestContext,
  path: string,
  data: JsonData,
): Promise<APIResponse> => {
  return request.post(path, {
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const postMultipart = (
  request: APIRequestContext,
  path: string,
  multipart: MultipartData,
): Promise<APIResponse> => {
  return request.post(path, {
    multipart,
  });
};
