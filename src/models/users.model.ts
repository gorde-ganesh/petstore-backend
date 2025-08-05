export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  pets: any[];
}

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};
