import apiClient from "@/utils/api/api.client";
export { apiClient };
import { LoginCredentials, RegisterData, LoginAuthResponse, AuthResponse } from "../types/auth.types";
import { AxiosError } from "axios";

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<LoginAuthResponse> => {
    try {
        const response = await apiClient.post(`/auth/login`, {
            email: credentials.email,
            password: credentials.password,
        });

        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = error.response?.data?.message || "Error de conexión";
            throw new Error(message);
        }
        throw new Error("Error de conexión");
    }
};

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post(`/auth/register`,
            {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
            },
        );

        const responseData: AuthResponse = response.data;
        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Error de conexión. Por favor intenta de nuevo.");
    }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
    try {
        await apiClient.post(`/auth/logout`);
    } catch (error) {
        // Silent fail for logout
        console.error("Logout error:", error);
    }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get(`/auth/check`);

        return response.data;
    } catch (error) {
        throw error;
    }
};
