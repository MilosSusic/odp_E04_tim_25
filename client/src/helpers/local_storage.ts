function SačuvajVrednostPoKljuču(key: string, value: string): boolean {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error(`Greška pri čuvanju u localStorage za ključ '${key}':`, error);
        return false;
    }
}

function PročitajVrednostPoKljuču(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Greška pri čitanju iz localStorage za ključ '${key}':`, error);
        return null;
    }
}

function ObrišiVrednostPoKljuču(key: string): boolean {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Greška pri brisanju iz localStorage za ključ '${key}':`, error);
        return false;
    }
}

function OčistiLocalStorage(): boolean {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error("Greška pri čišćenju celog localStorage:", error);
        return false;
    }
}

export {
    SačuvajVrednostPoKljuču,
    PročitajVrednostPoKljuču,
    ObrišiVrednostPoKljuču,
    OčistiLocalStorage,
};
