import { useState } from 'react';

interface EconomicWidget {
  title: string;
  value: number;
  icon: string;
  isPercentage?: boolean;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export const useEconomicData = () => {
  const [economicData, setEconomicData] = useState<EconomicWidget[]>([
    { title: "Proyección del Mes", value: 10000, icon: "TrendingUp", layout: { x: 0, y: 0, w: 1, h: 1 } },
    { title: "Gasto Mensual", value: 5000, icon: "DollarSign", layout: { x: 1, y: 0, w: 1, h: 1 } },
    { title: "Planes Vendidos", value: 50, icon: "FileText", layout: { x: 2, y: 0, w: 1, h: 1 } },
    { title: "Clientes Actuales", value: 200, icon: "Users", layout: { x: 3, y: 0, w: 1, h: 1 } },
    { title: "Ingreso Mensual", value: 12000, icon: "DollarSign", layout: { x: 0, y: 1, w: 1, h: 1 } },
    { title: "Ingresos Totales", value: 150000, icon: "DollarSign", layout: { x: 1, y: 1, w: 1, h: 1 } },
    { title: "Margen de Ganancia", value: 20, icon: "PieChart", isPercentage: true, layout: { x: 2, y: 1, w: 1, h: 1 } },
    { title: "Clientes Nuevos", value: 15, icon: "UserPlus", layout: { x: 3, y: 1, w: 1, h: 1 } },
  ]);

  const updateEconomicData = (index: number, value: number) => {
    setEconomicData((prevData) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], value };
      return newData;
    });
  };

  const removeWidget = (index: number) => {
    setEconomicData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const addWidget = () => {
    const newWidget: EconomicWidget = {
      title: "Nuevo Widget",
      value: 0,
      icon: "DollarSign",
      layout: { x: 0, y: Infinity, w: 1, h: 1 }, // Se añadirá al final
    };
    setEconomicData((prevData) => [...prevData, newWidget]);
  };

  return { economicData, updateEconomicData, removeWidget, addWidget };
};