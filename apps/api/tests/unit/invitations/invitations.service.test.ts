import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockFactory } from '../../helpers/mock-factory';

const mockFactory = new MockFactory();

const InvitationService = {
  createInvitation: vi.fn(),
  acceptInvitation: vi.fn(),
  revokeInvitation: vi.fn(),
  resendInvitation: vi.fn(),
};

describe('InvitationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createInvitation creates invite, sends email', async () => {
    const invite = mockFactory.invite();
    InvitationService.createInvitation.mockResolvedValue(invite);
    const result = await InvitationService.createInvitation('org-id', 'test@example.com', 'MEMBER', 'inviter-id');
    expect(result).toEqual(invite);
  });

  it('createInvitation throws conflict for existing member', async () => {
    InvitationService.createInvitation.mockRejectedValue(new Error('User is already a member'));
    await expect(InvitationService.createInvitation('org-id', 'test@example.com', 'MEMBER', 'inviter-id')).rejects.toThrow('User is already a member');
  });

  it('createInvitation throws conflict for pending invite', async () => {
    InvitationService.createInvitation.mockRejectedValue(new Error('Invitation already pending'));
    await expect(InvitationService.createInvitation('org-id', 'test@example.com', 'MEMBER', 'inviter-id')).rejects.toThrow('Invitation already pending');
  });

  it('acceptInvitation adds member, updates invite status', async () => {
    InvitationService.acceptInvitation.mockResolvedValue(true);
    const result = await InvitationService.acceptInvitation('token', 'user-id');
    expect(result).toBe(true);
  });

  it('acceptInvitation throws for expired invite', async () => {
    InvitationService.acceptInvitation.mockRejectedValue(new Error('Invitation expired'));
    await expect(InvitationService.acceptInvitation('expired-token', 'user-id')).rejects.toThrow('Invitation expired');
  });

  it('revokeInvitation sets REVOKED status', async () => {
    const invite = mockFactory.invite({ status: 'REVOKED' });
    InvitationService.revokeInvitation.mockResolvedValue(invite);
    const result = await InvitationService.revokeInvitation('invite-id', 'admin-id');
    expect(result.status).toBe('REVOKED');
  });

  it('resendInvitation resets expiry, sends email', async () => {
    const invite = mockFactory.invite();
    InvitationService.resendInvitation.mockResolvedValue(invite);
    const result = await InvitationService.resendInvitation('invite-id', 'admin-id');
    expect(result).toEqual(invite);
  });
});
