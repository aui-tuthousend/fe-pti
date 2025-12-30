export interface User {
  password: string;
  name: string;
  role: string;
}

export interface UserResponse {
  id: number;
  name: string;
  role: string;
}

export interface LoginUserResponse extends UserResponse {
  token: string;
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
    id: user.id,
    name: user.name,
    role: user.role
  }
}
