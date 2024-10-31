// src/services/UserService.ts
import { HttpClient } from '../../../utils/HttpClient';

// Інтерфейс для користувача
export interface User {
    id: number;
    email: string;
    username: string;
    password: string; // Якщо потрібно, можеш не включати це поле у реальному проекті з міркувань безпеки
    name: {
        firstname: string;
        lastname: string;
    };
    address: {
        city: string;
        street: string;
        number: number;
        zipcode: string;
        geolocation: {
            lat: string;
            long: string;
        };
    };
    phone: string;
}

type CreateUserRequest = Omit<User, 'id'>; // Створення користувача без id
type UpdateUserRequest = User; // Оновлення користувача включає id

export class UserService {
    private httpClient: HttpClient;

    constructor(signal?: AbortSignal) {
        this.httpClient = new HttpClient({
            baseURL: 'https://fakestoreapi.com/users', // URL бази даних для користувачів
            timeout: 10000,
            signal,
        });
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.httpClient.get<User[]>('');
    }

    public async getUserById(id: number): Promise<User> {
        return await this.httpClient.get<User>(`/${id}`);
    }

    public async createUser(user: CreateUserRequest): Promise<User> {
        return await this.httpClient.post<User, CreateUserRequest>('', user);
    }

    public async updateUser(user: UpdateUserRequest): Promise<User> {
        return await this.httpClient.put<User, UpdateUserRequest>(`/${user.id}`, user);
    }

    public async deleteUserById(id: number): Promise<User> {
        return await this.httpClient.delete<User>(`/${id}`);
    }
}
