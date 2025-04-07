// src/services/UserService.ts
import axios from 'axios';
import { CreateUserDto, UpdateUserDto, UserDto } from '@/types/models';

const API_URL = process.env.REACT_APP_API_URL;

export class UserService {
    static async login(email: string, password: string): Promise<{ user: UserDto } | { message: string }> {
        try {
            const response = await axios.post(`${API_URL}/users/login`, { email, password });
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw this.handleError(error);
        }
    }

    static async getUsers(page = 1, limit = 10): Promise<{ items: UserDto[], total: number }> {
        try {
            const response = await axios.get(`${API_URL}/users`, {
                params: { page, take: limit }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getUser(id: string): Promise<UserDto> {
        try {
            const response = await axios.get(`${API_URL}/users/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async createUser(userData: CreateUserDto): Promise<UserDto> {
        try {
            const response = await axios.post(`${API_URL}/users`, userData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async updateUser(id: string, userData: UpdateUserDto, userId: string): Promise<UserDto> {
        try {
            const response = await axios.put(`${API_URL}/users/${id}`, userData, {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async deleteUser(id: string, userId: string): Promise<void> {
        try {
            await axios.delete(`${API_URL}/users/${id}`, {
                params: { userId }
            });
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private static handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'An error occurred';
            return new Error(message);
        }
        return error;
    }
}
