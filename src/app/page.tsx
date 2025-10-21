
"use client"
import React, { useState } from 'react';
import Header from '@/components/ui/Header';
import SearchBar from '@/components/ui/SearchBar';
import ItemList from '@/components/ui/ItemList';
import { ItemCompra, ItemCompraFormData } from '@/types/item';

const LandingPage: React.FC = () => {
  const [items, setItems] = useState<ItemCompra[]>([
    {
      id: 1,
      nombre: 'Leche',
      cantidad: 2,
      precio: 2.50,
      comprado: false,
      creado_en: new Date()
    },
    {
      id: 2,
      nombre: 'Pan',
      cantidad: 1,
      precio: 1.80,
      comprado: true,
      creado_en: new Date()
    },
    {
      id: 3,
      nombre: 'Arroz',
      cantidad: 3,
      precio: 3.20,
      comprado: false,
      creado_en: new Date()
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleAddItem = (itemData: ItemCompraFormData) => {
    const newItem: ItemCompra = {
      ...itemData,
      id: Date.now(), // ID temporal
      creado_en: new Date()
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleToggleComprado = (id: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, comprado: !item.comprado } : item
    ));
  };

  const handleDeleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Sección de búsqueda y agregar items */}
        <SearchBar 
          onAddItem={handleAddItem}
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

export default LandingPage;