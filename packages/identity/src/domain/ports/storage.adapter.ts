export interface StorageAdapter {
  uploadAvatar(identityId: string, file: Buffer, mimeType: string): Promise<string>;
  deleteAvatar(identityId: string, avatarUrl: string): Promise<void>;
}

export const STORAGE_ADAPTER = Symbol('STORAGE_ADAPTER');
