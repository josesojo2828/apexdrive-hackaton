"use client";
import { useState, useEffect } from "react";
import apiClient from "@/utils/api/api.client";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get("/cars/users")
            .then(r => setUsers(r.data))
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    }, []);

    return { users, loading };
}
