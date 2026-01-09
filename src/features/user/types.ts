export interface User {
  name: string;
  email: string;
  phone: string;
  role: string;
  token?: string;
}

export interface UserResponse {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface LoginUserResponse {
  data: UserResponse & { token: string };
}

export interface RegisterUserRequest {
  email: string;
  phone: string;
  password: string;
  name: string;
  role?: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  password?: string;
  role?: string;
}

export function toUserRespons(user: any): UserResponse {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  }
}
