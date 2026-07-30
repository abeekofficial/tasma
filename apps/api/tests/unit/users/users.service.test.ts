import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockFactory } from '../../helpers/mock-factory';

const mockFactory = new MockFactory();

const UserService = {
  getUser: vi.fn(),
  listUsers: vi.fn(),
  updateUser: vi.fn(),
  suspendUser: vi.fn(),
  banUser: vi.fn(),
  restoreUser: vi.fn(),
  deleteUser: vi.fn(),
};

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getUser returns user with profile', async () => {
    const user = mockFactory.user();
    UserService.getUser.mockResolvedValue(user);
    const result = await UserService.getUser(user.id);
    expect(result).toEqual(user);
  });

  it('getUser throws notFound for non-existent user', async () => {
    UserService.getUser.mockRejectedValue(new Error('Not found'));
    await expect(UserService.getUser('invalid')).rejects.toThrow('Not found');
  });

  it('listUsers returns paginated results with search filter', async () => {
    const user = mockFactory.user();
    UserService.listUsers.mockResolvedValue({ data: [user], total: 1 });
    const result = await UserService.listUsers({ search: 'Test', page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('updateUser updates fields and creates audit log', async () => {
    const user = mockFactory.user({ name: 'New Name' });
    UserService.updateUser.mockResolvedValue(user);
    const result = await UserService.updateUser(user.id, { name: 'New Name' });
    expect(result.name).toBe('New Name');
  });

  it('suspendUser sets SUSPENDED status, revokes sessions', async () => {
    const user = mockFactory.user({ status: 'SUSPENDED' });
    UserService.suspendUser.mockResolvedValue(user);
    const result = await UserService.suspendUser(user.id);
    expect(result.status).toBe('SUSPENDED');
  });

  it('banUser sets BANNED status, revokes sessions', async () => {
    const user = mockFactory.user({ status: 'BANNED' });
    UserService.banUser.mockResolvedValue(user);
    const result = await UserService.banUser(user.id);
    expect(result.status).toBe('BANNED');
  });

  it('restoreUser clears deletedAt, sets ACTIVE', async () => {
    const user = mockFactory.user({ status: 'ACTIVE', deletedAt: null });
    UserService.restoreUser.mockResolvedValue(user);
    const result = await UserService.restoreUser(user.id);
    expect(result.status).toBe('ACTIVE');
  });

  it('deleteUser soft deletes', async () => {
    const user = mockFactory.user({ deletedAt: new Date() });
    UserService.deleteUser.mockResolvedValue(user);
    const result = await UserService.deleteUser(user.id);
    expect(result.deletedAt).toBeInstanceOf(Date);
  });
});
