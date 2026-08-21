import { createContext, type ReactNode, useEffect, useState } from 'react';

type AuthContextType = {
    name: string | null;
    setName: React.Dispatch<React.SetStateAction<string | null>>;
    role: string | null;
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
};

export const authContext = createContext<AuthContextType>(
    {} as AuthContextType,
);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [name, setName] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const savedName = localStorage.getItem('name');
        if (savedName) {
            setName(savedName);
        }
        const savedRole = localStorage.getItem('role');
        if (savedRole) {
            setRole(savedRole);
        }
    }, []);

    return (
        <authContext.Provider value={{ name, setName, role, setRole }}>
            {children}
        </authContext.Provider>
    );
}
