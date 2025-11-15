import { API_BASE_URL } from '../../config/env';
import { UserResponse, RegisterUserRequest, LoginUserRequest, LoginUserResponse } from './types';

export class userService {
    private readonly baseUrl = `${API_BASE_URL}/api/users`;

    async getAllUser(): Promise<UserResponse[]> {
			const response = await fetch(this.baseUrl, {
					method: 'GET',
					headers: {
					'Content-Type': 'application/json',
					},
			});

			if (!response.ok) {
					throw new Error(`Failed to fetch driver records: ${response.statusText}`);
			}

			const data = await response.json();

			return data.data;
		}

		async createUser(user: RegisterUserRequest): Promise<UserResponse> {
			const response = await fetch(this.baseUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(user),
				});

			if (!response.ok) {
					throw new Error(`Failed to create user: ${response.statusText}`);
			}

			return response.json();
		}

		async loginUser(loginData: LoginUserRequest): Promise<LoginUserResponse> {
			const response = await fetch(`${this.baseUrl}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(loginData),
			});

			if (!response.ok) {
				throw new Error(`Login failed: ${response.statusText}`);
			}

			return response.json();
		}

		async getCurrentUser(): Promise<UserResponse> {
			const token = localStorage.getItem('auth_token');
			const response = await fetch(`${this.baseUrl}/me`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					...(token && { Authorization: `Bearer ${token}` }),
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					// Token expired or invalid
					localStorage.removeItem('auth_token');
				}
				throw new Error(`Failed to get current user: ${response.statusText}`);
			}

			const data = await response.json();
			return data.data || data;
		}
}

export const UserService = new userService();
