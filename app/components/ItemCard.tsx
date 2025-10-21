// ./src/app/components/ui/ItemCard.tsx

import React from 'react';
import { ItemCompra } from '@/types/item';

interface ItemCardProps {
  item: ItemCompra;
  onToggleComprado: (id: number) => void;
  onDeleteItem: (id: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onToggleComprado, 
  onDeleteItem 
}) => {
  
  // Convertimos el precio de string (PostgreSQL) a número aquí, en el scope local.
  const itemPrice = parseFloat(item.precio as unknown as string);
  const itemTotal = itemPrice * item.cantidad;

  return (
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
              <span>Precio: ${itemPrice.toFixed(2)}</span>
              <span className="font-semibold">
                Total: ${itemTotal.toFixed(2)}
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
};

export default ItemCard;