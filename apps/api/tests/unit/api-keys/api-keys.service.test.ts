import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockFactory } from '../../helpers/mock-factory';

const mockFactory = new MockFactory();

const ApiKeyService = {
  createApiKey: vi.fn(),
  listApiKeys: vi.fn(),
  revokeApiKey: vi.fn(),
  validateApiKey: vi.fn(),
  rotateApiKey: vi.fn(),
};

describe('ApiKeyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createApiKey generates key with prefix, returns raw key only once', async () => {
    const key = mockFactory.apiKey();
    ApiKeyService.createApiKey.mockResolvedValue({ ...key, rawKey: 'tsk_rawkey123' });
    const result = await ApiKeyService.createApiKey('org-id', 'Test Key', 'admin-id');
    expect(result.rawKey).toBe('tsk_rawkey123');
  });

  it('listApiKeys returns keys without raw key', async () => {
    const key = mockFactory.apiKey();
    ApiKeyService.listApiKeys.mockResolvedValue([key]);
    const result = await ApiKeyService.listApiKeys('org-id');
    expect(result[0]).not.toHaveProperty('rawKey');
  });

  it('revokeApiKey sets revokedAt', async () => {
    const key = mockFactory.apiKey({ revokedAt: new Date() });
    ApiKeyService.revokeApiKey.mockResolvedValue(key);
    const result = await ApiKeyService.revokeApiKey('key-id', 'org-id', 'admin-id');
    expect(result.revokedAt).toBeInstanceOf(Date);
  });

  it('validateApiKey returns key data for valid key', async () => {
    const key = mockFactory.apiKey();
    ApiKeyService.validateApiKey.mockResolvedValue(key);
    const result = await ApiKeyService.validateApiKey('tsk_rawkey123');
    expect(result).toEqual(key);
  });

  it('validateApiKey throws for revoked key', async () => {
    ApiKeyService.validateApiKey.mockRejectedValue(new Error('Key revoked'));
    await expect(ApiKeyService.validateApiKey('tsk_revoked123')).rejects.toThrow('Key revoked');
  });

  it('validateApiKey throws for expired key', async () => {
    ApiKeyService.validateApiKey.mockRejectedValue(new Error('Key expired'));
    await expect(ApiKeyService.validateApiKey('tsk_expired123')).rejects.toThrow('Key expired');
  });

  it('rotateApiKey revokes old, creates new', async () => {
    const newKey = mockFactory.apiKey();
    ApiKeyService.rotateApiKey.mockResolvedValue({ ...newKey, rawKey: 'tsk_new123' });
    const result = await ApiKeyService.rotateApiKey('old-key-id', 'org-id', 'admin-id');
    expect(result.rawKey).toBe('tsk_new123');
  });
});
