"use client";
import React, { useState } from 'react';
import { ItemCompraFormData } from '@/types/item';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (itemData: ItemCompraFormData) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAddItem }) => {
  const [formData, setFormData] = useState<ItemCompraFormData>({
    nombre: '',
    cantidad: 1,
    precio: 0.00,
    comprado: false, // Por defecto, al agregar es pendiente
  });

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
          ? parseFloat(value) || 0 
          : value
    }));

    // Limpiar errores al escribir
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() || formData.cantidad <= 0 || formData.precio < 0) {
      setError("Por favor, rellena el nombre y asegúrate que la cantidad y el precio sean válidos.");
      return;
    }

    onAddItem(formData);
    
    // Resetear formulario y cerrar modal
    setFormData({ nombre: '', cantidad: 1, precio: 0.00, comprado: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300 scale-100">
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Agregar Nuevo Item</h2>
        
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Item</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Leche, Pan, Arroz"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                id="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio Unitario ($)</label>
              <input
                type="number"
                name="precio"
                id="precio"
                value={formData.precio}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="comprado"
              name="comprado"
              type="checkbox"
              checked={formData.comprado}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
            <label htmlFor="comprado" className="ml-2 block text-sm text-gray-900">
              Ya Comprado
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-150"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150"
            >
              Guardar Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;