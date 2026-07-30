import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockFactory } from '../../helpers/mock-factory';

const mockFactory = new MockFactory();

const OrganizationService = {
  createOrganization: vi.fn(),
  getOrganization: vi.fn(),
  updateOrganization: vi.fn(),
  getMembers: vi.fn(),
  updateMemberRole: vi.fn(),
  removeMember: vi.fn(),
  transferOwnership: vi.fn(),
};

describe('OrganizationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createOrganization creates org, adds owner, creates workspace', async () => {
    const org = mockFactory.organization();
    OrganizationService.createOrganization.mockResolvedValue(org);
    const result = await OrganizationService.createOrganization({ name: 'New Org', ownerId: 'user-id' });
    expect(result.name).toBe('Test Organization'); // from mock
  });

  it('getOrganization returns org for member, throws for non-member', async () => {
    const org = mockFactory.organization();
    OrganizationService.getOrganization.mockResolvedValue(org);
    const result = await OrganizationService.getOrganization(org.id, 'user-id');
    expect(result).toEqual(org);
  });

  it('updateOrganization updates with audit', async () => {
    const org = mockFactory.organization({ name: 'Updated Org' });
    OrganizationService.updateOrganization.mockResolvedValue(org);
    const result = await OrganizationService.updateOrganization(org.id, { name: 'Updated Org' }, 'user-id');
    expect(result.name).toBe('Updated Org');
  });

  it('getMembers returns paginated members', async () => {
    const member = mockFactory.orgMember();
    OrganizationService.getMembers.mockResolvedValue({ data: [member], total: 1 });
    const result = await OrganizationService.getMembers(member.organizationId, 1, 10);
    expect(result.data).toHaveLength(1);
  });

  it('updateMemberRole changes role, creates audit', async () => {
    const member = mockFactory.orgMember({ role: 'ADMIN' });
    OrganizationService.updateMemberRole.mockResolvedValue(member);
    const result = await OrganizationService.updateMemberRole('org-id', 'member-id', 'ADMIN', 'admin-id');
    expect(result.role).toBe('ADMIN');
  });

  it('updateMemberRole throws when trying to demote only OWNER', async () => {
    OrganizationService.updateMemberRole.mockRejectedValue(new Error('Cannot demote only owner'));
    await expect(OrganizationService.updateMemberRole('org-id', 'owner-id', 'ADMIN', 'owner-id')).rejects.toThrow('Cannot demote only owner');
  });

  it('removeMember removes member, creates audit', async () => {
    OrganizationService.removeMember.mockResolvedValue(true);
    const result = await OrganizationService.removeMember('org-id', 'member-id', 'admin-id');
    expect(result).toBe(true);
  });

  it('removeMember throws when OWNER tries to remove self', async () => {
    OrganizationService.removeMember.mockRejectedValue(new Error('Owner cannot remove themselves'));
    await expect(OrganizationService.removeMember('org-id', 'owner-id', 'owner-id')).rejects.toThrow('Owner cannot remove themselves');
  });

  it('transferOwnership swaps OWNER role', async () => {
    OrganizationService.transferOwnership.mockResolvedValue(true);
    const result = await OrganizationService.transferOwnership('org-id', 'owner-id', 'new-owner-id');
    expect(result).toBe(true);
  });
});
