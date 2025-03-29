import React from 'react';
import { Target, Ruler, Weight, ArrowRight, Info } from 'lucide-react';
import { ClientData } from '../FormulasPopup';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface QuestionnaireProps {
  clientData: ClientData;
  setClientData: React.Dispatch<React.SetStateAction<ClientData>>;
  onNext: () => void;
}

const objectives = [
  'Pérdida de peso',
  'Ganancia muscular',
  'Resistencia',
  'Fuerza',
  'Tonificación'
];

const Questionnaire: React.FC<QuestionnaireProps> = ({
  clientData,
  setClientData,
  onNext
}) => {
  return (
    <div className="p-8 space-y-8">
      <Card>
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2">
              <Target className="w-7 h-7 text-indigo-600" />
              Información del Cliente
            </h2>
            <div className="group relative">
              <Info className="w-5 h-5 text-indigo-400 hover:text-indigo-600 transition-colors cursor-help" />
              <div className="absolute right-0 w-64 p-3 bg-white rounded-lg shadow-xl border border-indigo-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 text-sm text-gray-600">
                Complete la información básica del cliente para personalizar su plan de entrenamiento.
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div id="tutorial-client-info" className="space-y-6">
              <label className="block">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <Ruler className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-base font-semibold text-gray-700">Rango de Altura (cm)</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={clientData.height[0]}
                    onChange={e => setClientData(prev => ({
                      ...prev,
                      height: [Number(e.target.value), prev.height[1]]
                    }))}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all hover:border-indigo-400"
                    placeholder="Mínimo"
                  />
                  <span className="text-gray-400 font-medium">-</span>
                  <input
                    type="number"
                    value={clientData.height[1]}
                    onChange={e => setClientData(prev => ({
                      ...prev,
                      height: [prev.height[0], Number(e.target.value)]
                    }))}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all hover:border-indigo-400"
                    placeholder="Máximo"
                  />
                </div>
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <Weight className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-base font-semibold text-gray-700">Rango de Peso (kg)</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={clientData.weight[0]}
                    onChange={e => setClientData(prev => ({
                      ...prev,
                      weight: [Number(e.target.value), prev.weight[1]]
                    }))}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all hover:border-indigo-400"
                    placeholder="Mínimo"
                  />
                  <span className="text-gray-400 font-medium">-</span>
                  <input
                    type="number"
                    value={clientData.weight[1]}
                    onChange={e => setClientData(prev => ({
                      ...prev,
                      weight: [prev.weight[0], Number(e.target.value)]
                    }))}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all hover:border-indigo-400"
                    placeholder="Máximo"
                  />
                </div>
              </label>
            </div>

            <div>
              <label className="block">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-base font-semibold text-gray-700">Objetivo Principal</span>
                </div>
                <select
                  value={clientData.objective}
                  onChange={e => setClientData(prev => ({
                    ...prev,
                    objective: e.target.value
                  }))}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all hover:border-indigo-400"
                >
                  <option value="">Seleccione un objetivo</option>
                  {objectives.map(obj => (
                    <option key={obj} value={obj}>{obj}</option>
                  ))}
                </select>
              </label>

              <div id="tutorial-recommendations" className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <h3 className="text-sm font-semibold text-indigo-700 mb-2">Recomendaciones:</h3>
                <ul className="text-sm text-indigo-600 space-y-1">
                  <li>• Ingrese rangos realistas para altura y peso</li>
                  <li>• Considere el objetivo más importante para el cliente</li>
                  <li>• Los datos pueden ser ajustados posteriormente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button id="tutorial-next" onClick={onNext} className="px-6 py-2.5">
          Siguiente
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Questionnaire;