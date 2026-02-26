import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

export function useFirebaseSync<T extends { id: string }>(
    collectionName: string,
    initialData: T[]
) {
    const [data, setData] = useState<T[]>(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(
            collection(db, collectionName),
            (snapshot) => {
                const cloudData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
                if (cloudData.length > 0) {
                    setData(cloudData);
                } else {
                    // Seed the initial data directly to Firestore so the user doesn't stay in "local illusion"
                    setData(initialData);
                    if (initialData && initialData.length > 0) {
                        initialData.forEach(async (item) => {
                            if (item.id) {
                                try {
                                    const cleanSeedItem = JSON.parse(JSON.stringify(item));
                                    await setDoc(doc(db, collectionName, item.id), cleanSeedItem);
                                } catch (e: any) {
                                    console.error("Error seeding data:", e);
                                    toast({
                                        title: `Fallo en Auto-Carga (${collectionName})`,
                                        description: e.message,
                                        variant: "destructive"
                                    });
                                }
                            }
                        });
                    }
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error(`Error fetching ${collectionName}:`, err);
                toast({
                    title: `Error Firestore (${collectionName})`,
                    description: err.message,
                    variant: "destructive"
                });
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collectionName]);

    const sanitizeForFirestore = (obj: any) => {
        // Convierte el objeto a string y de vuelta a JSON
        // Esto elimina las funciones (como React Icons) y valores undefined que rompen Firestore
        return JSON.parse(JSON.stringify(obj));
    };

    const saveItem = async (item: T) => {
        if (!db) return false;
        try {
            if (!item.id) {
                throw new Error("Item must have an id before saving");
            }
            const cleanItem = sanitizeForFirestore(item);
            await setDoc(doc(db, collectionName, item.id), cleanItem);
            return true;
        } catch (err: any) {
            console.error(`Error saving to ${collectionName}:`, err);
            toast({
                title: `Error al Guardar (${collectionName})`,
                description: err.message,
                variant: "destructive"
            });
            return false;
        }
    };

    const removeItem = async (id: string) => {
        if (!db) return false;
        try {
            await deleteDoc(doc(db, collectionName, id));
            return true;
        } catch (err: any) {
            console.error(`Error deleting from ${collectionName}:`, err);
            toast({
                title: `Error al Eliminar (${collectionName})`,
                description: err.message,
                variant: "destructive"
            });
            return false;
        }
    };

    return { data, loading, error, saveItem, removeItem, setData };
}
