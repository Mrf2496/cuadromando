import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Custom hook for local data management via Browser LocalStorage.
 * Replaces old Firebase Sync logic for local-only deployment.
 */
export function useLocalStorage<T extends { id: string }>(
    collectionName: string,
    initialData: T[]
) {
    const [data, setData] = useState<T[]>(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const storageKey = `antigravity_data_${collectionName}`;

    useEffect(() => {
        // Load from LocalStorage - 100% Local Deployment
        try {
            const local = localStorage.getItem(storageKey);
            if (local) {
                const parsed = JSON.parse(local);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setData(parsed);
                } else {
                    setData(initialData);
                }
            } else {
                setData(initialData);
                localStorage.setItem(storageKey, JSON.stringify(initialData));
            }
        } catch (e) {
            console.error("Local storage error:", e);
            setData(initialData);
        }
        setLoading(false);
    }, [collectionName, storageKey, initialData]);

    const saveItem = async (item: T) => {
        try {
            const currentData = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const index = currentData.findIndex((i: any) => i.id === item.id);
            let newData;
            if (index >= 0) {
                newData = [...currentData];
                newData[index] = item;
            } else {
                newData = [...currentData, item];
            }
            setData(newData);
            localStorage.setItem(storageKey, JSON.stringify(newData));
            return true;
        } catch (e) {
            console.error("Local save error:", e);
            toast({
                title: "Error al Guardar Localmente",
                description: "No se pudo guardar la información en este navegador.",
                variant: "destructive"
            });
            return false;
        }
    };

    const removeItem = async (id: string) => {
        try {
            const currentData = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const newData = currentData.filter((i: any) => i.id !== id);
            setData(newData);
            localStorage.setItem(storageKey, JSON.stringify(newData));
            return true;
        } catch (e) {
            console.error("Local remove error:", e);
            toast({
                title: "Error al Eliminar",
                description: "No se pudo eliminar el registro localmente.",
                variant: "destructive"
            });
            return false;
        }
    };

    return { data, loading, error, saveItem, removeItem, setData };
}
