import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Info, CheckCircle2 } from 'lucide-react';

interface Equipment {
  item: string;
  description: string;
  price: string;
}

interface RecommendationsResponse {
  recommendedEquipment: Equipment[];
  justifications: {
    cardio?: string;
    flexibility?: string;
    strength?: string;
  };
  spaceLayout: string;
  budgetAlternatives: string;
  maintenanceTips: string;
  accessories?: string[];
  purchasePriorities: string;
}

interface HomeEquipmentResponseProps {
  recommendations: RecommendationsResponse;
}

const HomeEquipmentResponse: React.FC<HomeEquipmentResponseProps> = ({ recommendations }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const cardHover = {
    rest: { scale: 1, transition: { duration: 0.2 } },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-10 p-4"
    >
      {/* Recommended Equipment Section */}
      <motion.section 
        variants={fadeInUp} 
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-3xl font-bold mb-8 text-violet-600 dark:text-violet-400 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-violet-600 dark:text-violet-400 animate-bounce" />
          Equipo Recomendado
        </h3>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.recommendedEquipment.map((equipment, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="rest"
              whileHover="hover"
              variants={cardHover}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl transform transition-all duration-300 border border-violet-200 dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500 shadow-lg"
            >
              <motion.h4 
                className="font-semibold text-xl mb-3 text-gray-900 dark:text-white"
                whileHover={{ scale: 1.02 }}
              >
                {equipment.item}
              </motion.h4>
              <p className="text-gray-700 dark:text-gray-300 text-base mb-4 leading-relaxed">
                {equipment.description}
              </p>
              <motion.div 
                className="flex items-center justify-between bg-violet-50 dark:bg-violet-900/20 p-3 rounded-xl"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span className="text-lg">{equipment.price}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-violet-100 dark:bg-violet-800 text-violet-600 dark:text-violet-300 p-2 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-700 transition-colors"
                >
                  <Info className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Accessories Section */}
      {recommendations.accessories && recommendations.accessories.length > 0 && (
        <motion.section 
          variants={fadeInUp} 
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-3xl font-bold mb-8 text-orange-500 dark:text-orange-400 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-orange-500 dark:text-orange-400 animate-bounce" />
            Accesorios Recomendados
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.accessories.map((accessory, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="rest"
                whileHover="hover"
                variants={cardHover}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl transform transition-all duration-300 border border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 shadow-lg"
              >
                <motion.h4 
                  className="font-semibold text-xl text-gray-900 dark:text-white text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  {accessory}
                </motion.h4>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Justifications Section */}
      <motion.section variants={fadeInUp} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400 flex items-center gap-3">
          <Info className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-bounce" />
          Justificación
        </h3>
        <div className="space-y-6">
          {Object.entries(recommendations.justifications).map(([key, value], index) => (
            value && (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl"
              >
                <h4 className="font-semibold text-lg mb-2 capitalize text-gray-900 dark:text-white">{key}</h4>
                <p className="text-gray-700 dark:text-gray-300">{value}</p>
              </motion.div>
            )
          ))}
        </div>
      </motion.section>

      {/* Purchase Priorities Section */}
      {recommendations.purchasePriorities && (
        <motion.section variants={fadeInUp} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-3xl font-bold mb-8 text-indigo-600 dark:text-indigo-400 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-bounce" />
            Prioridades de Compra
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl">
            <p className="text-gray-700 dark:text-gray-300">{recommendations.purchasePriorities}</p>
          </div>
        </motion.section>
      )}

      {/* Additional Information Section */}
      <motion.section variants={fadeInUp} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-3xl font-bold mb-8 text-green-600 dark:text-green-400 flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 animate-bounce" />
          Información Adicional
        </h3>
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl">
            <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Distribución del Espacio</h4>
            <p className="text-gray-700 dark:text-gray-300">{recommendations.spaceLayout}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl">
            <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Alternativas de Presupuesto</h4>
            <p className="text-gray-700 dark:text-gray-300">{recommendations.budgetAlternatives}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl">
            <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Consejos de Mantenimiento</h4>
            <p className="text-gray-700 dark:text-gray-300">{recommendations.maintenanceTips}</p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomeEquipmentResponse;
