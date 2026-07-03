export interface LoginResponse {
  message: string;
  admin: {
    id: number;
    username: string;
  };
}