import { motion } from "framer-motion";
import { Button } from "../ModernUI";
import { Eye, Edit3 } from "lucide-react";
import {
  MainContainer,
  SectionHeader,
  SectionContent,
  InfoGrid,
  InfoCell,
  Tag,
  EmptyState,
} from "../ui/BaseComponents";

export default function GabinetesDetalhesNew({
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
      <MainContainer>
        {/* Header da Seção */}
        <SectionHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Eye className="text-green-400" />
            Detalhes do Gabinete
          </h3>
        </SectionHeader>

        {/* Conteúdo dos Detalhes */}
        <SectionContent>
          {gabineteSelecionado !== null ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {(() => {
                const gabinete = gabinetes[gabineteSelecionado];
                const area = (gabinete.largura * gabinete.altura) / 1000000; // m²
                const pixelsLargura =
                  gabinete.pixels_largura || gabinete.resolucaoX || 0;
                const pixelsAltura =
                  gabinete.pixels_altura || gabinete.resolucaoY || 0;
                const densidadePixel = (pixelsLargura * pixelsAltura) / area;
                const pixelPitch = gabinete.pitch || gabinete.pixelPitch;
                const isPremium = pixelPitch <= 5;
                const isIndoor = pixelPitch <= 10;

                return (
                  <>
                    {/* Informações Básicas */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
                      <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Informações Básicas
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Nome:
                          </span>
                          <span className="text-white font-semibold">
                            {gabinete.nome}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">
                            Tipo:
                          </span>
                          <Tag variant={isIndoor ? "indoor" : "outdoor"}>
                            {isIndoor ? "Indoor" : "Outdoor"}
                          </Tag>
                        </div>
                        {isPremium && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-medium">
                              Categoria:
                            </span>
                            <Tag variant="premium">Premium</Tag>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Especificações Técnicas */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
                      <h4 className="font-bold text-purple-400 mb-4 flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        Especificações Técnicas
                      </h4>
                      <InfoGrid>
                        <InfoCell
                          label="Dimensões"
                          value={`${gabinete.largura} × ${gabinete.altura}mm`}
                        />
                        <InfoCell
                          label="Resolução"
                          value={`${pixelsLargura} × ${pixelsAltura}px`}
                        />
                        <InfoCell
                          label="Pixel Pitch"
                          value={`${pixelPitch}mm`}
                          valueClass="font-semibold text-blue-400 mt-1"
                        />
                        <InfoCell
                          label="Área Total"
                          value={`${area.toFixed(2)}m²`}
                        />
                      </InfoGrid>
                    </div>

                    {/* Características Elétricas */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
                      <h4 className="font-bold text-yellow-400 mb-4 flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        Características Elétricas e Físicas
                      </h4>
                      <InfoGrid>
                        <InfoCell
                          label="Potência"
                          value={`${gabinete.potencia}W`}
                          valueClass="font-semibold text-yellow-400 mt-1"
                        />
                        <InfoCell label="Peso" value={`${gabinete.peso}kg`} />
                        <InfoCell
                          label="Densidade de Pixels"
                          value={`${Math.round(
                            densidadePixel
                          ).toLocaleString()} px/m²`}
                        />
                        <InfoCell
                          label="Eficiência"
                          value={`${(gabinete.potencia / area).toFixed(1)}W/m²`}
                        />
                      </InfoGrid>
                    </div>

                    {/* Botão de Editar */}
                    <div className="pt-4">
                      <Button
                        onClick={() => editarGabinete(gabineteSelecionado)}
                        icon={Edit3}
                        className="w-full"
                      >
                        Editar Gabinete
                      </Button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          ) : (
            <EmptyState
              icon={Eye}
              title="Nenhum gabinete selecionado"
              description="Clique em um gabinete da lista para ver seus detalhes completos."
            />
          )}
        </SectionContent>
      </MainContainer>
    </motion.div>
  );
}
