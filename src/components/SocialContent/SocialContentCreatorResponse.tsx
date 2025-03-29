import React from 'react'; 
import { motion } from 'framer-motion';

interface SocialContentCreatorResponseProps {
  response: any;
}

const SocialContentCreatorResponse: React.FC<SocialContentCreatorResponseProps> = ({ response }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  /**
   * Función de ayuda para renderizar contenido
   * que puede ser un string o un objeto con { title, description }.
   */
  const renderTextOrObject = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      // Suponiendo que el objeto viene con { title, description }
      return (
        <div className="space-y-1">
          {value.title && (
            <p className="font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">
              {value.title}
            </p>
          )}
          {value.description && (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {value.description}
            </p>
          )}
        </div>
      );
    } else {
      // Si es string o número, lo mostramos tal cual
      return (
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {value}
        </p>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Ideas de Contenido */}
        <motion.section variants={fadeInUp} {...fadeInUp} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-1 bg-purple-500 rounded-full"></div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Ideas de Contenido
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {response?.contentPlan?.contentIdeas &&
              // Asumiendo que contentIdeas puede ser un objeto, hacemos Object.entries
              Object.entries(response.contentPlan.contentIdeas).map(([key, idea]) => (
                <motion.div
                  key={key}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100 dark:border-purple-900 transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-inner text-white font-bold">
                      {key.replace('Idea', '')}
                    </div>
                    <div className="space-y-2 flex-1">
                      {/* Renderizamos según sea string u objeto */}
                      {renderTextOrObject(idea)}
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.section>

        {/* Estructura de Contenido */}
        <motion.section variants={fadeInUp} {...fadeInUp} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-1 bg-emerald-500 rounded-full"></div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
              Estructura de Contenido
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {response?.contentPlan?.contentStructure &&
              Object.entries(response.contentPlan.contentStructure).map(([type, structure]) => (
                <motion.div
                  key={type}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-inner">
                        {/* Aquí puedes personalizar íconos por tipo */}
                      </div>
                      <h4 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
                        {type.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {typeof structure === 'object'
                        ? Object.entries(structure).map(([key, value]) => (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="space-y-2"
                            >
                              <h5 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                {key}
                              </h5>
                              {/* También revisamos si value es string u objeto */}
                              <div className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-emerald-300 dark:border-emerald-700">
                                {renderTextOrObject(value)}
                              </div>
                            </motion.div>
                          ))
                        : renderTextOrObject(structure)}
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.section>

        {/* Optimización de Plataformas */}
        <motion.section variants={fadeInUp} {...fadeInUp} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-1 bg-blue-500 rounded-full"></div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
              Optimización de Plataformas
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-6 md:grid-cols-3"
          >
            {response?.contentPlan?.platformOptimization &&
              Object.entries(response.contentPlan.platformOptimization).map(([platform, strategy]) => (
                <motion.div
                  key={platform}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100 dark:border-blue-900"
                >
                  <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500 mb-4">
                    {platform}
                  </h4>
                  {renderTextOrObject(strategy)}
                </motion.div>
              ))}
          </motion.div>
        </motion.section>

        {/* Estrategia de Hashtags */}
        <motion.section variants={fadeInUp} {...fadeInUp} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-1 bg-red-500 rounded-full"></div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              Estrategia de Hashtags
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-8 md:grid-cols-2"
          >
            {/* Contenido General */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-4">
                Contenido General
              </h4>
              <div className="flex flex-wrap gap-3">
                {response?.contentPlan?.hashtagStrategy?.["Contenido general"]?.map((hashtag: string, index: number) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-2 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 text-red-600 dark:text-red-300 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {hashtag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Para Desafíos */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 mb-4">
                Para Desafíos
              </h4>
              <div className="flex flex-wrap gap-3">
                {response?.contentPlan?.hashtagStrategy?.["Para desafíos"]?.map((hashtag: string, index: number) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-2 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 text-orange-600 dark:text-orange-300 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {hashtag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Variaciones de Contenido */}
        <motion.section variants={fadeInUp} {...fadeInUp} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-1 bg-orange-500 rounded-full"></div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
              Variaciones de Contenido
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Imágenes */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-100 dark:border-orange-900"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg shadow-inner">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
                  Imágenes
                </h4>
              </div>
              <ul className="space-y-2">
                {response?.contentPlan?.contentVariations?.["Imágenes"]?.map((item: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-gray-600 dark:text-gray-400 leading-relaxed pl-4 border-l-2 border-orange-200 dark:border-orange-800"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Textos */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100 dark:border-purple-900"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg shadow-inner">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                  Textos
                </h4>
              </div>
              <ul className="space-y-2">
                {response?.contentPlan?.contentVariations?.["Textos"]?.map((item: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-gray-600 dark:text-gray-400 leading-relaxed pl-4 border-l-2 border-purple-200 dark:border-purple-800"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Videos */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100 dark:border-blue-900"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg shadow-inner">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                  Videos
                </h4>
              </div>
              <ul className="space-y-2">
                {response?.contentPlan?.contentVariations?.["Videos"]?.map((item: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-gray-600 dark:text-gray-400 leading-relaxed pl-4 border-l-2 border-blue-200 dark:border-blue-800"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Plan de Engagement */}
        <motion.section variants={fadeInUp} {...fadeInUp} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-1 bg-pink-500 rounded-full"></div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
              Plan de Engagement
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-6"
          >
            {response?.contentPlan?.engagementPlan &&
              Object.entries(response.contentPlan.engagementPlan).map(([strategy, action]) => (
                <motion.div
                  key={strategy}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-pink-100 dark:border-pink-900"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 rounded-full">
                      <svg
                        className="w-5 h-5 text-pink-600 dark:text-pink-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0
                            4.418-4.03 8-9 8a9.863 9.863 0
                            01-4.255-.949L3 20l1.395-3.72C3.512
                            15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9
                            3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2 flex-1">
                      <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
                        {strategy}
                      </h4>
                      {renderTextOrObject(action)}
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.section>

        {/* Calendario de Publicación */}
        <motion.section variants={fadeInUp} {...fadeInUp} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-1 bg-indigo-500 rounded-full"></div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
              Calendario de Publicación
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {response?.contentPlan?.publishingSchedule &&
              Object.entries(response.contentPlan.publishingSchedule).map(([day, schedule]) => (
                <motion.div
                  key={day}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-indigo-100 dark:border-indigo-900"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-center w-full h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                      <h4 className="font-medium text-indigo-600 dark:text-indigo-400">
                        {day}
                      </h4>
                    </div>
                    {/* Puede ser string u objeto */}
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0
                            11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Utilizamos la misma función de renderizado */}
                      {renderTextOrObject(schedule)}
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.section>

        {/* Métricas Clave */}
        <motion.section variants={fadeInUp} {...fadeInUp} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-1 bg-teal-500 rounded-full"></div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-green-500">
              Métricas Clave
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-6 md:grid-cols-2"
          >
            {response?.contentPlan?.metrics &&
              Object.entries(response.contentPlan.metrics).map(([metric, description]) => (
                <motion.div
                  key={metric}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-teal-100 dark:border-teal-900"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-teal-100 dark:bg-teal-900/30 rounded-full">
                      {/* Aquí puedes personalizar iconos según el 'metric' */}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-green-500">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      {renderTextOrObject(description)}
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.section>

      </div>
    </motion.div>
  );
};

export default SocialContentCreatorResponse;
