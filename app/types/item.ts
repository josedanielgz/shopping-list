export interface ItemCompra {
  id?: number;
  nombre: string;
  cantidad: number;
  precio: number;
  comprado: boolean;
  creado_en?: Date;
}

export interface ItemCompraFormData {
  nombre: string;
  cantidad: number;
  precio: number;
  comprado: boolean;
}