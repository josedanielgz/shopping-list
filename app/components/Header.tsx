import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Lista de Compras</h1>
            <p className="text-green-100 mt-2">
              Organiza tus compras de manera eficiente
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm">
              Demo
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;