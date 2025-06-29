/**
 * Hook customizado para cálculos de painéis LED
 *
 * Responsabilidades:
 * - Cálculos por gabinete vs metro
 * - Cálculos de potência (máxima, média, detalhada)
 * - Cálculos de energia e corrente elétrica
 * - Validação de dados de entrada
 * - Gerenciamento de estados de cálculo
 *
 * @author Led Panel Manager Team
 * @since 1.3.0
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  calcularPainelPorGabinete,
  calcularPainelPorMetro,
  calcularEnergia,
  calcularPotenciaFinal,
  CalculationError
} from "../services/painelCalculations";

export function usePainelCalculations({ form, gabinetes, tensao, tipoRede }) {
  const [resultado, setResultado] = useState(null);
  const [energia, setEnergia] = useState(null);
  const [potenciaDetalhe, setPotenciaDetalhe] = useState(null);
  const [erro, setErro] = useState(null);

  /**
   * Encontra o gabinete selecionado
   */
  const gabinete = useMemo(() => {
    if (!form.gabinete || !Array.isArray(gabinetes) || gabinetes.length === 0) {
      return null;
    }
    return gabinetes.find((g) => g.nome === form.gabinete);
  }, [form.gabinete, gabinetes]);

  /**
   * Calcula quantidade de gabinetes baseado no modo
   */
  const quantidadeGabinetes = useMemo(() => {
    if (!gabinete) return 0;

    if (form.modo === "gabinete") {
      return (Number(form.qtdLargura) || 1) * (Number(form.qtdAltura) || 1);
    } else if (form.modo === "metro") {
      const larguraGab = Number(gabinete.largura) || 500;
      const alturaGab = Number(gabinete.altura) || 500;
      const larguraM = Number(form.larguraM) || 0;
      const alturaM = Number(form.alturaM) || 0;

      if (larguraM <= 0 || alturaM <= 0) return 0;

      return (
        Math.round((larguraM * 1000) / larguraGab) *
        Math.round((alturaM * 1000) / alturaGab)
      );
    }

    return 0;
  }, [
    gabinete,
    form.modo,
    form.qtdLargura,
    form.qtdAltura,
    form.larguraM,
    form.alturaM,
  ]);

  /**
   * Executa cálculos do painel baseado no modo selecionado
   */
  const calcularPainel = useCallback(() => {
    try {
      setErro(null);

      // Validações básicas
      if (!gabinete) {
        setResultado(null);
        setEnergia(null);
        setPotenciaDetalhe(null);
        return;
      }

      let res = null;

      if (form.modo === "gabinete") {
        const qtdLargura = Number(form.qtdLargura) || 1;
        const qtdAltura = Number(form.qtdAltura) || 1;

        if (qtdLargura <= 0 || qtdAltura <= 0) {
          throw new Error("Quantidade de gabinetes deve ser maior que zero");
        }

        res = calcularPainelPorGabinete(gabinete, qtdLargura, qtdAltura);
      } else if (form.modo === "metro") {
        const larguraM = Number(form.larguraM) || 0;
        const alturaM = Number(form.alturaM) || 0;

        if (larguraM <= 0 || alturaM <= 0) {
          throw new Error("Medidas em metros devem ser maiores que zero");
        }

        res = calcularPainelPorMetro(gabinete, larguraM, alturaM);
      }

      if (!res) {
        setResultado(null);
        setEnergia(null);
        setPotenciaDetalhe(null);
        return;
      }

      // Cálculos de potência
      const potenciaGab = Number(gabinete.potencia) || 0;
      const P_total_max = potenciaGab * quantidadeGabinetes;

      // Cálculo de potência detalhada (consumo realista)
      const brilhoPercentualMax = 100;
      const fatorConteudo = 0.33; // 33% do conteúdo é branco em média
      const consumoBasePercentual = 0.3; // 30% de consumo base

      // Potência máxima (100% brilho)
      const pwmMax = Math.pow(brilhoPercentualMax / 100, 2);
      const P_brilhoMax = P_total_max * pwmMax;
      const P_conteudoMax = P_brilhoMax * fatorConteudo;
      const P_baseMax = P_total_max * consumoBasePercentual;
      const P_finalMax = P_conteudoMax + P_baseMax;

      // Potência média (50% brilho)
      const brilhoPercentual50 = 50;
      const pwm50 = Math.pow(brilhoPercentual50 / 100, 2);
      const P_brilho50 = P_total_max * pwm50;
      const P_conteudo50 = P_brilho50 * fatorConteudo;
      const P_base50 = P_total_max * consumoBasePercentual;
      const P_final50 = P_conteudo50 + P_base50;

      // Armazena detalhes da potência
      setPotenciaDetalhe({
        P_total_max,
        P_finalMax,
        P_final50,
        quantidadeGabinetes,
        potenciaPorGabinete: potenciaGab,
      });

      // Resultado com potência calculada
      const resultadoCompleto = {
        ...res,
        potencia: P_finalMax,
        quantidadeGabinetes,
      };

      setResultado(resultadoCompleto);

      // Cálculo de energia
      const energiaCalculada = calcularEnergia(P_finalMax, tipoRede, tensao);
      setEnergia(energiaCalculada);
    } catch (error) {
      console.error("Erro ao calcular painel:", error);
      setErro(error.message);
      setResultado(null);
      setEnergia(null);
      setPotenciaDetalhe(null);
    }
  }, [gabinete, form, quantidadeGabinetes, tipoRede, tensao]);

  /**
   * Calcula potência para um painel específico
   * @param {Object} painel - Dados do painel
   * @param {number} percentualBrilho - Percentual de brilho (0-100)
   * @returns {Object} - Dados de potência calculados
   */
  const calcularPotenciaPainel = useCallback(
    (painel, percentualBrilho = 100) => {
      try {
        if (!painel || !gabinetes) return null;

        const gabineteObj = gabinetes.find((g) => g.nome === painel.gabinete);
        if (!gabineteObj) return null;

        const qtdGab = (painel.qtdLargura || 1) * (painel.qtdAltura || 1);
        const potResult = calcularPotenciaFinal(
          gabineteObj,
          qtdGab,
          percentualBrilho
        );

        return {
          ...potResult,
          gabinete: gabineteObj,
          quantidadeGabinetes: qtdGab,
        };
      } catch (error) {
        console.error("Erro ao calcular potência do painel:", error);
        return null;
      }
    },
    [gabinetes]
  );

  /**
   * Calcula energia para um painel específico
   * @param {number} potencia - Potência em watts
   * @param {string} tipoRede - Tipo de rede elétrica
   * @param {string} tensao - Tensão
   * @returns {Object} - Dados de energia calculados
   */
  const calcularEnergiaPainel = useCallback((potencia, tipoRede, tensao) => {
    try {
      return calcularEnergia(potencia, tipoRede, tensao);
    } catch (error) {
      console.error("Erro ao calcular energia:", error);
      return null;
    }
  }, []);

  /**
   * Valida se os dados do formulário são suficientes para cálculo
   */
  const podeCalcular = useMemo(() => {
    if (!form.gabinete || !gabinete) return false;

    if (form.modo === "gabinete") {
      return (
        (Number(form.qtdLargura) || 0) > 0 && (Number(form.qtdAltura) || 0) > 0
      );
    } else if (form.modo === "metro") {
      return (
        (Number(form.larguraM) || 0) > 0 && (Number(form.alturaM) || 0) > 0
      );
    }

    return false;
  }, [form, gabinete]);

  /**
   * Limpa todos os cálculos
   */
  const limparCalculos = useCallback(() => {
    setResultado(null);
    setEnergia(null);
    setPotenciaDetalhe(null);
    setErro(null);
  }, []);

  // Effect para recalcular automaticamente quando dados mudarem
  useEffect(() => {
    if (podeCalcular) {
      calcularPainel();
    } else {
      limparCalculos();
    }
  }, [podeCalcular, calcularPainel, limparCalculos]);

  return {
    // Resultados dos cálculos
    resultado,
    energia,
    potenciaDetalhe,
    erro,

    // Estados computados
    gabinete,
    quantidadeGabinetes,
    podeCalcular,

    // Funções de cálculo
    calcularPainel,
    calcularPotenciaPainel,
    calcularEnergiaPainel,
    limparCalculos,

    // Utilitários
    isCalculando: false, // Pode ser usado para loading states futuros
  };
}
