// import { motion } from "framer-motion"; // Para futuras animações
import { Calculator, Save } from "lucide-react";
import { SelectField } from "../../../../components/ModernUI";

/**
 * � PainelForm - Formulário de Criação/Edição de Painéis
 *
 * Responsabilidades:
 * - Renderizar formulário completo de painéis
 * - Gerenciar validações em tempo real
 * - Integrar com hooks de cálculo e CRUD
 * - Controlar estados de loading e erro
 * - Alternar entre modos de medição (metros/gabinetes)
 */
export default function PainelForm({
  selectedProjectId,
  setSelectedProjectId,
  painelForm,
  painelCalculations,
  painelCrud,
  gabinetes,
  loadingGabinetes,
  errorGabinetes,
  tensao,
  setTensao,
  tipoRede,
  setTipoRede,
  projetos,
  onSubmit,
  setSelectedPanelIndex,
  setPreviewPainel,
}) {
  return (
    <motion.div
      className="lg:col-span-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Calculator className="text-blue-400" />
          Configuração do Painel
        </h2>

        <div className="mb-6">
          <SelectField
            label="Projeto"
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setSelectedPanelIndex(null);
              setPreviewPainel(null);
            }}
            options={[
              { value: "", label: "Selecione o Projeto" },
              ...projetos.map((p) => ({
                value: p.nome,
                label: p.nome,
              })),
            ]}
          />
        </div>

        {/* Formulário só aparece se um projeto estiver selecionado */}
        {selectedProjectId && (
          <form onSubmit={onSubmit} style={{ marginBottom: 24 }}>
            <input name="projeto" type="hidden" value={selectedProjectId} />

            {/* Campo Nome */}
            <input
              name="nome"
              placeholder="Nome do Painel"
              value={painelForm.form.nome}
              onChange={painelForm.handleChange}
              required
            />

            {/* Campo Gabinete */}
            <select
              name="gabinete"
              value={painelForm.form.gabinete}
              onChange={painelForm.handleChange}
              required
              disabled={loadingGabinetes}
            >
              <option value="">
                {loadingGabinetes
                  ? "Carregando gabinetes..."
                  : errorGabinetes
                  ? "Erro ao carregar gabinetes"
                  : gabinetes.length === 0
                  ? "Nenhum gabinete disponível"
                  : "Selecione o Gabinete"}
              </option>
              {gabinetes.map((g, i) => (
                <option key={i} value={g.nome}>
                  {g.nome} ({g.largura}×{g.altura}mm)
                </option>
              ))}
            </select>

            {/* Mensagens de erro/aviso */}
            {errorGabinetes && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "0.9em",
                  marginTop: 4,
                }}
              >
                ❌ Erro: {errorGabinetes}
              </div>
            )}
            {!loadingGabinetes && !errorGabinetes && gabinetes.length === 0 && (
              <div
                style={{
                  color: "#f59e0b",
                  fontSize: "0.9em",
                  marginTop: 4,
                }}
              >
                ⚠️ Nenhum gabinete encontrado. Verifique se há gabinetes
                cadastrados na aba Gabinetes.
              </div>
            )}

            {/* Seleção do modo de medição */}
            <div style={{ margin: "12px 0" }}>
              <label>
                <input
                  type="radio"
                  name="modo"
                  value="metro"
                  checked={painelForm.form.modo === "metro"}
                  onChange={painelForm.handleChange}
                />
                Medidas em Metros
              </label>
              <label style={{ marginLeft: 16 }}>
                <input
                  type="radio"
                  name="modo"
                  value="gabinete"
                  checked={painelForm.form.modo === "gabinete"}
                  onChange={painelForm.handleChange}
                />
                Medidas por Gabinetes
              </label>
            </div>

            {/* Campos de medição por gabinetes */}
            {painelForm.form.modo === "gabinete" ? (
              <>
                <input
                  name="qtdLargura"
                  type="number"
                  min={1}
                  value={painelForm.form.qtdLargura}
                  onChange={painelForm.handleChange}
                  placeholder="Qtd Gabinetes Largura"
                  required
                />
                <input
                  name="qtdAltura"
                  type="number"
                  min={1}
                  value={painelForm.form.qtdAltura}
                  onChange={painelForm.handleChange}
                  placeholder="Qtd Gabinetes Altura"
                  required
                />
              </>
            ) : (
              /* Campos de medição em metros */
              <>
                <input
                  name="larguraM"
                  type="number"
                  step="0.01"
                  min={0.01}
                  value={painelForm.form.larguraM}
                  onChange={painelForm.handleChange}
                  placeholder="Largura (m)"
                  required
                />
                <input
                  name="alturaM"
                  type="number"
                  step="0.01"
                  min={0.01}
                  value={painelForm.form.alturaM}
                  onChange={painelForm.handleChange}
                  placeholder="Altura (m)"
                  required
                />
              </>
            )}

            {/* Configurações elétricas */}
            <div style={{ margin: "12px 0" }}>
              <label>
                Tensão:
                <select
                  value={tensao}
                  onChange={(e) => {
                    setTensao(e.target.value);
                    if (e.target.value === "220" && tipoRede === "monofasico") {
                      setTipoRede("bifasico");
                    }
                  }}
                  style={{ marginLeft: 8 }}
                >
                  <option value="220">220V</option>
                  <option value="380">380V</option>
                </select>
              </label>
              <label style={{ marginLeft: 16 }}>
                Tipo de rede:
                <select
                  value={tipoRede}
                  onChange={(e) => setTipoRede(e.target.value)}
                  style={{ marginLeft: 8 }}
                >
                  {tensao === "220" ? (
                    <>
                      <option value="bifasico">Bifásico</option>
                      <option value="trifasico">Trifásico</option>
                    </>
                  ) : (
                    <>
                      <option value="monofasico">Monofásico</option>
                      <option value="bifasico">Bifásico</option>
                      <option value="trifasico">Trifásico</option>
                    </>
                  )}
                </select>
              </label>
            </div>

            {/* Botão de submit */}
            <button
              type="submit"
              disabled={!painelCalculations.resultado}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {painelCrud.editando !== null
                ? "Salvar Edição"
                : "Adicionar Painel"}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
