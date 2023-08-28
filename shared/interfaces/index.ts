export enum UserRole {
  CLIENT = "CLIENT",
  STAFF = "STAFF",
  DEVELOPER = "DEVELOPER",
  ADMIN = "ADMIN",
}

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole | string;
  company: string;
  position: string;
  createdAt: Date | string;
  lastModifiedAt: Date | string;
}
