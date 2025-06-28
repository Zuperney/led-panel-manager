import { motion } from "framer-motion";
import { Button } from "../ModernUI";
import { Eye, Monitor, Edit3 } from "lucide-react";

export default function GabinetesDetalhes({
  gabineteSelecionado,
  gabinetes,
  editarGabinete,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Container Principal - Detalhes do Gabinete */}
      <div className="glass-card">
        {/* Header da Seção */}
        <div className="border-b border-gray-700 p-6 pb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Eye className="text-green-400" />
            Detalhes do Gabinete
          </h3>
        </div>

        {/* Conteúdo dos Detalhes */}
        <div className="p-6 pt-6">
          {gabineteSelecionado !== null ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {(() => {
                const gabinete = gabinetes[gabineteSelecionado];
                const area = (gabinete.largura * gabinete.altura) / 1000000; // m²
                const densidadePixel =
                  (gabinete.resolucaoX * gabinete.resolucaoY) / area;

                return (
                  <>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Informações Básicas
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Nome:
                          </span>
                          <span className="font-semibold text-white">
                            {gabinete.nome}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Largura:
                          </span>
                          <span className="font-semibold text-white">
                            {gabinete.largura}mm
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Altura:
                          </span>
                          <span className="font-semibold text-white">
                            {gabinete.altura}mm
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Área:
                          </span>
                          <span className="font-semibold text-green-400">
                            {area.toFixed(4)}m²
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        Especificações
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Pixel Pitch:
                          </span>
                          <span className="font-semibold text-blue-400">
                            {gabinete.pixelPitch}mm
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Resolução:
                          </span>
                          <span className="font-semibold text-white">
                            {gabinete.resolucaoX}×{gabinete.resolucaoY}px
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Densidade:
                          </span>
                          <span className="font-semibold text-purple-400">
                            {densidadePixel.toFixed(0)} px/m²
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Consumo e Peso
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Potência:
                          </span>
                          <span className="font-semibold text-yellow-400">
                            {gabinete.potencia}W
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Peso:
                          </span>
                          <span className="font-semibold text-white">
                            {gabinete.peso}kg
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            W/m²:
                          </span>
                          <span className="font-semibold text-orange-400">
                            {(gabinete.potencia / area).toFixed(0)}W/m²
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            kg/m²:
                          </span>
                          <span className="font-semibold text-cyan-400">
                            {(gabinete.peso / area).toFixed(1)}kg/m²
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => editarGabinete(gabineteSelecionado)}
                        icon={Edit3}
                      >
                        Editar Gabinete
                      </Button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-800/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Monitor className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                Nenhum gabinete selecionado
              </h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                Selecione um gabinete da lista para ver suas especificações
                detalhadas
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
