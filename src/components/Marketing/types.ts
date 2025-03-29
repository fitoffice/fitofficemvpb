export interface Client {
  _id: string;
  email: string;
  planningActivo?: {
    _id: string;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    meta: string;
    semanas: number;
  };
  dietaActiva?: {
    _id: string;
    nombre: string;
    objetivo: string;
    estado: string;
  };
}

export interface Lead {
  _id: string;
  email: string;
}

export interface Segment {
  _id: string;
  name: string;
  description: string;
  region: string;
  interests: string[];
  source: string;
  clients: Client[];
  leads: Lead[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  minAge: string;
  maxAge: string;
  gender: string[];
  region: string;
  interests: string[];
  source: string[];
}

export interface FilterState {
  isOpen: boolean;
  options: FilterOptions;
}
