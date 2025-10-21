// ./src/page.tsx

"use client"
import React from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ItemList from './components/ItemList';
import { useShoppingList } from './hooks/shoppingList'; 
import { ItemCompraFormData } from './types/item';

console.log("Valor de Header importado:", Header);

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
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <h1 className="text-xl font-semibold text-gray-700">Cargando lista...</h1>
            </div>
        );
    }
    
    // JSX final
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <main className="container mx-auto px-4 py-8">
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

            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 Lista de Compras Demo. Todos los derechos reservados.</p>
                    <p className="text-gray-400 mt-2">
                        Aplicación demo con Node.js, Express, TypeScript y PostgreSQL
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ShoppingListPage;