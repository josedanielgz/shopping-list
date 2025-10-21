import { useState, useCallback, useEffect } from 'react';
import { ItemCompra, ItemCompraFormData } from '@/types/item'; 

// --- Configuración de la API ---
const API_URL = '/api/items';
const MIN_LOAD_TIME_MS = 300; // Simular tiempo de carga mínimo

// Conservar para propósitos de prueba
const MOCK_ITEMS: ItemCompra[] = [
    { id: 1, nombre: 'Leche', cantidad: 2, precio: 2.50, comprado: false, creado_en: new Date() },
    { id: 2, nombre: 'Pan', cantidad: 1, precio: 1.80, comprado: true, creado_en: new Date() },
    { id: 3, nombre: 'Arroz', cantidad: 3, precio: 3.20, comprado: false, creado_en: new Date() }
];

export const useShoppingList = () => {
    const [items, setItems] = useState<ItemCompra[]>([]); 
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Método GET (Cargar Items)
    const loadItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        const startTime = Date.now(); 

        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data: ItemCompra[] = await response.json();
            setItems(data);
        } catch (err) {
            console.error("Error al cargar ítems:", err);
            setError("No se pudo cargar la lista de compras. Por favor, inténtelo de nuevo.");
            setItems([]);
        } finally {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = MIN_LOAD_TIME_MS - elapsedTime;

            if (remainingTime > 0) {
                setTimeout(() => {
                    setIsLoading(false);
                }, remainingTime);
            } else {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);


    // Método POST (Añadir Item)
    const handleAddItem = useCallback(async (itemData: ItemCompraFormData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: itemData.nombre,
                    cantidad: itemData.cantidad 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fallo al agregar el ítem.');
            }

            const newItem: ItemCompra = await response.json();
            setItems(prev => [newItem, ...prev]);
        } catch (err) {
            console.error("Error al añadir ítem:", err);
            setError("No se pudo agregar el ítem.");
        }
    }, []);

    // --------------------------------------------------
    // 3. Método PUT (Toggle 'Comprado')
    // --------------------------------------------------
    const handleToggleComprado = useCallback(async (id: number) => {
        // Optimistic UI Update
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, comprado: !item.comprado } : item
        ));

        const currentItem = items.find(item => item.id === id);
        if (!currentItem) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comprado: !currentItem.comprado }),
            });

            if (!response.ok) {
                // Rollback si falla
                setItems(prev => prev.map(item =>
                    item.id === id ? { ...item, comprado: !item.comprado } : item
                ));
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fallo al actualizar el estado de compra.');
            }
            
        } catch (err) {
            console.error("Error al actualizar ítem:", err);
            setError("No se pudo actualizar el estado del ítem.");
        }
    }, [items]);

    // --------------------------------------------------
    // 4. Método DELETE (Eliminar Item)
    // --------------------------------------------------
    const handleDeleteItem = useCallback(async (id: number) => {
        // Optimistic UI Update: Elimina de la lista inmediatamente
        setItems(prev => prev.filter(item => item.id !== id));

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            // Si falla y no es 204 No Content ni 404
            if (!response.ok && response.status !== 204 && response.status !== 404) {
                throw new Error('Fallo al eliminar el ítem.');
            }

        } catch (err) {
            console.error("Error al eliminar ítem:", err);
            setError("No se pudo eliminar el ítem.");
            loadItems(); // Recarga para sincronizar
        }
    }, [loadItems]);

    // --------------------------------------------------
    // 5. Método de Búsqueda (Agregado) 🚀
    // --------------------------------------------------
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);


    // --- Lógica de Filtrado ---
    const filteredItems = items.filter(item => 
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        items: filteredItems,
        searchQuery,
        isLoading,
        error,
        handleAddItem,
        handleSearch,
        handleToggleComprado,
        handleDeleteItem,
        loadItems,
    };
};