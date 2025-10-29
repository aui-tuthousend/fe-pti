import { API_BASE_URL } from '../../config/env';
import { UserResponse, RegisterUserRequest } from './types';

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
}

export const UserService = new userService();