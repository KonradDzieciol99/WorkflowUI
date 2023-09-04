export interface IProjectMember {
  //photoUrl?: string;
  id: string;
  userId: string;
  userEmail: string;
  type: ProjectMemberType;
  invitationStatus: InvitationStatus;
  projectId: string;
  photoUrl?: string;
}
export function isIProjectMember(item: unknown): item is IProjectMember {
  if (typeof item !== 'object' || item === null) return false;

  return (
    'id' in item &&
    'userId' in item &&
    'userEmail' in item &&
    'type' in item &&
    'invitationStatus' in item &&
    'projectId' in item
  );
}

export enum ProjectMemberType {
  Leader,
  Admin,
  Member,
}
export enum InvitationStatus {
  Invited,
  Accepted,
}
