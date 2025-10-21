// ./src/hooks/useShoppingList.ts

import { useState, useCallback, useEffect } from 'react';
import { ItemCompra, ItemCompraFormData } from '@/app/types/item';

// --- MOCK DATA (Se eliminará al conectar la API) ---
const MOCK_ITEMS: ItemCompra[] = [
    { id: 1, nombre: 'Leche', cantidad: 2, precio: 2.50, comprado: false, creado_en: new Date() },
    { id: 2, nombre: 'Pan', cantidad: 1, precio: 1.80, comprado: true, creado_en: new Date() },
    { id: 3, nombre: 'Arroz', cantidad: 3, precio: 3.20, comprado: false, creado_en: new Date() }
];

export const useShoppingList = () => {
    // Inicializa como vacío, el useEffect se encargará de cargar los datos (MOCK o API)
    const [items, setItems] = useState<ItemCompra[]>([]); 
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Carga inicial de los datos mediante la API
    const loadItems = useCallback(() => {
        // Si es exitosa, reemplazar el MOCK con una llamada fetch a /api/items**
        setIsLoading(true);
        // Simulación de una carga de datos
        setTimeout(() => {
            setItems(MOCK_ITEMS);
            setIsLoading(false);
        }, 300); 
    }, []);

    useEffect(() => {
        loadItems(); // Carga inicial de datos
    }, [loadItems]);


    // --- Handlers de Funcionalidad (Donde irán las llamadas POST, PUT, DELETE) ---
    const handleAddItem = useCallback((itemData: ItemCompraFormData) => {
        // **TODO: Implementar aquí la llamada POST a /api/items**
        const newItem: ItemCompra = {
            ...itemData,
            id: Date.now(), // ID temporal
            creado_en: new Date()
        };
        setItems(prev => [...prev, newItem]);
    }, []);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleToggleComprado = useCallback((id: number) => {
        // **TODO: Implementar aquí la llamada PUT a /api/items/[id]**
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, comprado: !item.comprado } : item
        ));
    }, []);

    const handleDeleteItem = useCallback((id: number) => {
        // **TODO: Implementar aquí la llamada DELETE a /api/items/[id]**
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    // --- Lógica de Filtrado ---
    const filteredItems = items.filter(item => 
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        items: filteredItems, // Exporta los ítems filtrados
        searchQuery,
        isLoading,
        handleAddItem,
        handleSearch,
        handleToggleComprado,
        handleDeleteItem
    };
};