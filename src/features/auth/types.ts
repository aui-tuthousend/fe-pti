export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
