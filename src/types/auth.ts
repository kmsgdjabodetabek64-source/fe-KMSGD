export interface Admin {
  id: number;
  username: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  admin: Admin;
}
