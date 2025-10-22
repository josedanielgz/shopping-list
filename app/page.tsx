// ./src/app/page.tsx

"use client"
import React from 'react';
import SearchBar from '@/components/SearchBar';
import ItemList from '@/components/ItemList';
import { useShoppingList } from '@/hooks/shoppingList'; 
import { ItemCompraFormData } from '@/types/item';


const ShoppingListPage: React.FC = () => {
    
    // Extraer todo el estado y handlers del hook
    const {
        items, 
        isLoading, 
        error,
        searchQuery, 
        handleAddItem, 
        handleSearch, 
        handleToggleComprado, 
        handleDeleteItem
    } = useShoppingList();

    // Renderizar el estado de carga
    if (isLoading) {
        // Usar flex-grow y bg-gray-100 para que se vea bien dentro del layout
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-100"> 
                <h1 className="text-xl font-semibold text-gray-700">Cargando lista...</h1>
            </div>
        );
    }
    
    // JSX final
    return (
  
        <main className="container mx-auto px-4 py-8 flex-grow">
            {/* Sección de búsqueda y agregar items */}
            <SearchBar 
                onAddItem={handleAddItem as (itemData: ItemCompraFormData) => void}
                onSearch={handleSearch}
            />
            
            {/* Sección de lista de items */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Mi Lista de Compras
                    </h2>
                    <span className="text-gray-600">
                        {items.length} item{items.length !== 1 ? 's' : ''}
                    </span>
                </div>
                
                <ItemList 
                    items={items}
                    searchQuery={searchQuery}
                    onToggleComprado={handleToggleComprado}
                    onDeleteItem={handleDeleteItem}
                />
            </section>
        </main>

    );
};

export default ShoppingListPage;