import { useContext } from "react";
import AuthContext from "../../contexts/auth/AuthContext";
import type { AuthContextType } from "../../types/auth/AuthContext";

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth mora biti korišćen unutar <AuthProvider>");
    }

    return context;
};