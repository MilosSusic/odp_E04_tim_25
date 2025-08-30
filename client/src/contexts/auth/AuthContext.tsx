import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { AuthContextType } from "../../types/auth/AuthContext";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";
import type { AuthUser } from "../../types/auth/AuthUser";
import { ObrišiVrednostPoKljuču, PročitajVrednostPoKljuču, SačuvajVrednostPoKljuču } from "../../helpers/local_storage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const decodeJWT = (token: string): JwtTokenClaims | null => {
    try {
        const decoded = jwtDecode<JwtTokenClaims>(token);

        if (decoded.id && decoded.korisnickoIme && decoded.uloga) {
            return {
                id: decoded.id,
                korisnickoIme: decoded.korisnickoIme,
                uloga: decoded.uloga,
            };
        }
        return null;
    } catch (error) {
        console.error("Greška pri dekodiranju JWT tokena:", error);
        return null;
    }
};

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp ? decoded.exp < currentTime : false;
    } catch {
        return true;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = PročitajVrednostPoKljuču("authToken");

        if (savedToken) {
            if (isTokenExpired(savedToken)) {
                ObrišiVrednostPoKljuču("authToken");
                setIsLoading(false);
                return;
            }

            const claims = decodeJWT(savedToken);
            if (claims) {
                setToken(savedToken);
                setUser({
                    id: claims.id,
                    korisnickoIme: claims.korisnickoIme,
                    uloga: claims.uloga,
                });
            } else {
                ObrišiVrednostPoKljuču("authToken");
            }
        }

        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        const claims = decodeJWT(newToken);

        if (claims && !isTokenExpired(newToken)) {
            setToken(newToken);
            setUser({
                id: claims.id,
                korisnickoIme: claims.korisnickoIme,
                uloga: claims.uloga,
            });
            SačuvajVrednostPoKljuču("authToken", newToken);
        } else {
            console.error("Nevažeći ili istekao token");
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        ObrišiVrednostPoKljuču("authToken");
    };

    const isAuthenticated = !!user && !!token;

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

