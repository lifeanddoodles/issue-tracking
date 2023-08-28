export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  company: string;
  position: string;
  createdAt: Date | string;
  lastModifiedAt: Date | string;
}
