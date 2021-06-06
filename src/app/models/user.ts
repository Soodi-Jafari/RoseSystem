export interface User {
  id: number;
  Types: number[];
  UserName: string;
  Alias: string;
  fullname: string;
  code: string;
}

export interface ChangePassUser {
  username: string;
  oldPassword: string;
  newPassword: string;
}

