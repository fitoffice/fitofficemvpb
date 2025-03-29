import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { PieChart, Activity, Calendar as CalendarIcon, Clock, TrendingUp, Award, Target, BarChart2, Dumbbell } from 'lucide-react';

interface Exercise {
  _id: string;
  exercise: {
    nombre: string;
    grupoMuscular: string[];
  };
  sets: Array<{
    reps: number;
    weight: number;
    rest: number;
    completed: boolean;
  }>;
}

interface Session {
  _id: string;
  name: string;
  tipo: string;
  exercises: Exercise[];
}

interface DayPlan {
  _id: string;
  day: string;
  fecha: string;
  sessions: Session[];
}

interface WeekPlan {
  _id: string;
  weekNumber: number;
  startDate: string;
  days: {
    [key: string]: DayPlan;
  };
}

interface VistaResumenProps {
  semanaActual: number;
  planSemanal: WeekPlan;
  updatePlan: (plan: WeekPlan) => void;
}

const VistaResumen: React.FC<VistaResumenProps> = ({
  semanaActual,
  planSemanal,
}) => {
  const { theme } = useTheme();

  // Calcular el progreso por día
  const calcularProgresoDia = (dia: string) => {
    if (!planSemanal) return 0;
    const dayPlan = planSemanal[dia];
    if (!dayPlan?.sessions?.length) return 0;

    let totalExercises = 0;
    let completedExercises = 0;

    dayPlan.sessions.forEach(session => {
      if (!session?.exercises) return;
      session.exercises.forEach(exercise => {
        if (!exercise?.sets) return;
        totalExercises++;
        const isCompleted = exercise.sets.every(set => set && set.reps > 0 && set.weight > 0);
        if (isCompleted) completedExercises++;
      });
    });

    return totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  };

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const progressData = dias.map(dia => ({
    label: dia,
    completed: Math.round(calcularProgresoDia(dia)),
  }));

  // Calcular logros basados en el progreso real
  const calcularLogros = () => {
    if (!planSemanal) return [];
    
    const logros = [];
    const diasConSesiones = dias.filter(dia => 
      planSemanal[dia]?.sessions?.length > 0
    ).length;

    if (diasConSesiones >= 1) {
      logros.push({
        icon: Award,
        title: 'Planificación Iniciada',
        description: '¡Has comenzado tu planificación de entrenamiento!'
      });
    }

    const diasCompletados = dias.filter(dia => 
      calcularProgresoDia(dia) === 100
    ).length;

    if (diasCompletados >= 3) {
      logros.push({
        icon: Target,
        title: 'Consistencia',
        description: `${diasCompletados} días completados`
      });
    }

    const totalProgress = dias.reduce((acc, dia) => acc + calcularProgresoDia(dia), 0) / 7;
    if (totalProgress >= 50) {
      logros.push({
        icon: CalendarIcon,
        title: 'Compromiso',
        description: 'Más del 50% del plan completado'
      });
    }

    return logros;
  };

  // Calcular métricas reales basadas en el plan
  const calcularMetricas = () => {
    if (!planSemanal) return {
      intensidad: { alta: 0, media: 0, baja: 0 },
      duracion: { larga: 0, media: 0, corta: 0 },
      completado: 0
    };

    let totalSets = 0;
    let setsCompletados = 0;
    let totalEjercicios = 0;
    let ejerciciosPorTipo: { [key: string]: number } = {};
    let duracionTotal = 0;

    Object.values(planSemanal).forEach(day => {
      if (!day?.sessions) return;
      
      day.sessions.forEach(session => {
        if (!session?.exercises) return;
        
        session.exercises.forEach(exercise => {
          if (!exercise?.exercise?.grupoMuscular || !exercise?.sets) return;
          
          totalEjercicios++;
          
          exercise.exercise.grupoMuscular.forEach(grupo => {
            ejerciciosPorTipo[grupo] = (ejerciciosPorTipo[grupo] || 0) + 1;
          });

          exercise.sets.forEach(set => {
            if (!set) return;
            totalSets++;
            if (set.completed) setsCompletados++;
            duracionTotal += set.rest || 0;
          });
        });
      });
    });

    return {
      intensidad: {
        alta: Math.round((ejerciciosPorTipo['Pecho'] || 0) / (totalEjercicios || 1) * 100),
        media: Math.round((ejerciciosPorTipo['Piernas'] || 0) / (totalEjercicios || 1) * 100),
        baja: Math.round((ejerciciosPorTipo['Core'] || 0) / (totalEjercicios || 1) * 100),
      },
      duracion: {
        larga: Math.round(duracionTotal > 3600 ? 100 : (duracionTotal / 3600 * 100)),
        media: Math.round(duracionTotal > 1800 && duracionTotal <= 3600 ? 100 : 0),
        corta: Math.round(duracionTotal <= 1800 ? 100 : 0),
      },
      completado: Math.round((setsCompletados / (totalSets || 1)) * 100),
    };
  };

  const calcularTendenciasDiarias = () => {
    if (!planSemanal) return Array(7).fill(0).map((_, i) => ({
      dia: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][i],
      valor: 0
    }));

    const dias = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
    return dias.map(dia => {
      const diaCompleto = dia === 'Mie' ? 'Miércoles' : 
                         dia === 'Sab' ? 'Sábado' : 
                         dia + 'es';
                         
      const dayPlan = planSemanal[diaCompleto];
      if (!dayPlan?.sessions) return { dia, valor: 0 };

      let totalSets = 0;
      let completedSets = 0;

      dayPlan.sessions.forEach(session => {
        if (!session?.exercises) return;
        
        session.exercises.forEach(exercise => {
          if (!exercise?.sets) return;
          
          exercise.sets.forEach(set => {
            if (!set) return;
            totalSets++;
            if (set.completed) completedSets++;
          });
        });
      });

      return {
        dia,
        valor: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
      };
    });
  };

  const achievements = calcularLogros();
  const metricas = calcularMetricas();
  const tendencias = calcularTendenciasDiarias();
  const totalProgress = Math.round(dias.reduce((acc, dia) => acc + calcularProgresoDia(dia), 0) / 7);

  const stats = [
    {
      icon: CalendarIcon,
      title: 'Sesiones Totales',
      value: Object.values(planSemanal || {}).reduce((acc: number, day: any) => 
        acc + (day?.sessions?.length || 0), 0
      ),
      color: 'text-blue-500',
    },
    {
      icon: Activity,
      title: 'Días Activos',
      value: Object.values(planSemanal || {}).filter((day: any) => 
        day?.sessions?.length > 0
      ).length,
      color: 'text-green-500',
    },
    {
      icon: Clock,
      title: 'Promedio Diario',
      value: (Object.values(planSemanal || {}).reduce((acc: number, day: any) => 
        acc + (day?.sessions?.length || 0), 0
      ) / 7).toFixed(1),
      color: 'text-purple-500',
    },
    {
      icon: PieChart,
      title: 'Completado',
      value: `${totalProgress}%`,
      color: 'text-orange-500',
    },
  ];

  const metricasVisuales = [
    {
      categoria: 'Intensidad',
      datos: [
        { label: 'Alta', valor: metricas.intensidad.alta },
        { label: 'Media', valor: metricas.intensidad.media },
        { label: 'Baja', valor: metricas.intensidad.baja },
      ],
      icon: Activity,
      color: 'bg-red-500',
    },
    {
      categoria: 'Duración',
      datos: [
        { label: '60+ min', valor: metricas.duracion.larga },
        { label: '30-60 min', valor: metricas.duracion.media },
        { label: '0-30 min', valor: metricas.duracion.corta },
      ],
      icon: Clock,
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg transition-all duration-300
                ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold">Progreso General - Semana {semanaActual}</h2>
        </div>

        <div className="space-y-6">
          {progressData.map((day, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{day.label}</span>
                <span className="text-sm text-gray-500">{day.completed}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${day.completed}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <BarChart2 className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold">Estadísticas Detalladas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metricasVisuales.map((metrica, index) => {
            const Icon = metrica.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">{metrica.categoria}</h3>
                </div>
                <div className="space-y-3">
                  {metrica.datos.map((dato, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{dato.label}</span>
                        <span>{dato.valor}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${metrica.color} transition-all duration-300`}
                          style={{ width: `${dato.valor}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-bold">Tendencias Semanales</h2>
        </div>

        <div className="h-64 flex items-end space-x-4">
          {tendencias.map((dia, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t transition-all duration-300"
                style={{ height: `${dia.valor}%` }}
              />
              <span className="mt-2 text-sm font-medium">{dia.dia}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-6">Logros</h2>
        <div className="grid gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg flex items-start space-x-4
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <Icon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <Target className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold">Objetivos y Métricas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-semibold mb-4">Cumplimiento de Objetivos</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Progreso
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {metricas.completado}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${metricas.completado}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                />
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-semibold mb-4">Rendimiento General</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Intensidad Promedio</span>
                <span className="font-medium">{Math.round(metricas.intensidad.alta / 10)}/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Consistencia</span>
                <span className="font-medium">{metricas.completado}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Estado</span>
                <span className="font-medium">
                  {metricas.completado >= 80 ? 'Excelente' : 
                   metricas.completado >= 60 ? 'Bueno' : 
                   metricas.completado >= 40 ? 'Regular' : 'Necesita Mejorar'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaResumen;