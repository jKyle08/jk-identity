import { StorageAdapter } from '@jk/identity';

/**
 * In-memory implementation of {@link StorageAdapter}.
 * Stores avatar files in memory — for development and testing only.
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private readonly files = new Map<string, { data: Buffer; mimeType: string }>();

  async uploadAvatar(identityId: string, file: Buffer, mimeType: string): Promise<string> {
    const url = `memory://avatars/${identityId}`;
    this.files.set(url, { data: file, mimeType });
    return url;
  }

  async deleteAvatar(_identityId: string, avatarUrl: string): Promise<void> {
    this.files.delete(avatarUrl);
  }

  getFile(url: string): { data: Buffer; mimeType: string } | undefined {
    return this.files.get(url);
  }

  clear(): void {
    this.files.clear();
  }
}
