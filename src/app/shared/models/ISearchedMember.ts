export interface ISearchedMember {
  photoUrl?: string;
  email: string;
  id: string;
  status: MemberStatusType;
}
export enum MemberStatusType {
  Uninvited,
  Invited,
  Member,
}
