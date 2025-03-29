import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Table from '../Common/Table';

interface Income {
  _id: string;
  entrenador: string;
  monto: number;
  moneda: string;
  fecha: string;
  descripcion: string;
  estado: string;
}

export function RecentSalesWidget() {
  const [ingresos, setIngresos] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers = ['ID', 'Entrenador', 'Importe', 'Moneda', 'Fecha', 'Descripción', 'Estado'];

  const formatData = (data: Income[]) => {
    return data.map(item => ({
      id: item._id.substring(0, 8),
      entrenador: item.entrenador,
      monto: item.monto,
      moneda: item.moneda,
      fecha: new Date(item.fecha).toLocaleDateString(),
      descripcion: item.descripcion,
      estado: item.estado
    }));
  };

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ingresos');
        }

        const data = await response.json();
        setIngresos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Cargando...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table 
          headers={headers}
          data={formatData(ingresos)}
          variant="white"
        />
      </CardContent>
    </Card>
  );
}
