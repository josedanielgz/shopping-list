"use client"
import React from 'react';
import { ItemCompra } from '@/types/item';

interface ItemListProps {
  items: ItemCompra[];
  searchQuery: string;
  onToggleComprado: (id: number) => void;
  onDeleteItem: (id: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({ 
  items, 
  searchQuery, 
  onToggleComprado, 
  onDeleteItem 
}) => {
  const filteredItems = items.filter(item =>
    item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsComprados = filteredItems.filter(item => item.comprado);
  const itemsPendientes = filteredItems.filter(item => !item.comprado);

  const totalPendientes = itemsPendientes.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const totalComprados = itemsComprados.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {searchQuery ? 'No se encontraron items' : 'No hay items en la lista'}
        </h3>
        <p className="text-gray-500">
          {searchQuery 
            ? 'Intenta con otros términos de búsqueda'
            : 'Agrega algunos items para comenzar'
          }
        </p>
      </div>
    );
  }

  const ItemCard = ({ item }: { item: ItemCompra }) => (
    <div className={`bg-white rounded-lg shadow-md border-l-4 ${
      item.comprado 
        ? 'border-green-500 bg-green-50' 
        : 'border-orange-500'
    }`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              item.comprado ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {item.nombre}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>Cantidad: {item.cantidad}</span>
              <span>Precio: ${item.precio.toFixed(2)}</span>
              <span className="font-semibold">
                Total: ${(item.precio * item.cantidad).toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => item.id && onToggleComprado(item.id)}
              className={`px-3 py-1 rounded text-sm ${
                item.comprado
                  ? 'bg-gray-500 hover:bg-gray-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {item.comprado ? '↶' : '✓'}
            </button>
            <button
              onClick={() => item.id && onDeleteItem(item.id)}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
            >
              ×
            </button>
          </div>
        </div>

        {item.creado_en && (
          <p className="text-xs text-gray-400">
            Agregado: {new Date(item.creado_en).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-600">Total Items</div>
          <div className="text-2xl font-bold">{filteredItems.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-orange-200">
          <div className="text-sm text-gray-600">Pendientes</div>
          <div className="text-2xl font-bold text-orange-600">
            ${totalPendientes.toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-green-200">
          <div className="text-sm text-gray-600">Comprados</div>
          <div className="text-2xl font-bold text-green-600">
            ${totalComprados.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Items Pendientes */}
      {itemsPendientes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            Pendientes ({itemsPendientes.length})
          </h3>
          <div className="grid gap-3">
            {itemsPendientes.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Items Comprados */}
      {itemsComprados.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Comprados ({itemsComprados.length})
          </h3>
          <div className="grid gap-3 opacity-75">
            {itemsComprados.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;