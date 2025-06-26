// Utilidades de cálculo para painéis LED
export function calcularPainelPorGabinete(gabinete, qtdLargura, qtdAltura) {
  // gabinete: objeto do banco de gabinetes
  // qtdLargura, qtdAltura: quantidade de gabinetes em cada direção
  
  // Validação e conversão segura de valores
  const larguraGab = Number(gabinete.largura) || 0;
  const alturaGab = Number(gabinete.altura) || 0;
  const pixelsLarguraGab = Number(gabinete.pixels_largura) || 0;
  const pixelsAlturaGab = Number(gabinete.pixels_altura) || 0;
  const pesoGab = Number(gabinete.peso) || 0;
  const potenciaGab = Number(gabinete.potencia) || 0;
  
  const largura = (larguraGab * qtdLargura) / 1000; // metros
  const altura = (alturaGab * qtdAltura) / 1000; // metros
  const area = largura * altura;
  const pixelsLargura = pixelsLarguraGab * qtdLargura;
  const pixelsAltura = pixelsAlturaGab * qtdAltura;
  const peso = pesoGab * qtdLargura * qtdAltura;
  const potencia = potenciaGab * qtdLargura * qtdAltura;
  return { largura, altura, area, pixelsLargura, pixelsAltura, peso, potencia };
}

export function calcularPainelPorMetro(gabinete, larguraM, alturaM) {
  // gabinete: objeto do banco de gabinetes
  // larguraM, alturaM: dimensões desejadas em metros
  const larguraGab = Number(gabinete.largura) || 1;
  const alturaGab = Number(gabinete.altura) || 1;
  
  const qtdLargura = Math.round((larguraM * 1000) / larguraGab);
  const qtdAltura = Math.round((alturaM * 1000) / alturaGab);
  return calcularPainelPorGabinete(gabinete, qtdLargura, qtdAltura);
}

// Calcula corrente e potência aparente para todas as combinações de energia
// tipoRede: "monofasico", "bifasico", "trifasico"
// tensao: "220" ou "380"
export function calcularEnergia(
  potenciaW,
  tipoRede = "monofasico",
  tensao = "220"
) {
  const tensaoNum = Number(tensao);
  const fatorPotencia = 0.92; // típico para LED
  const potenciaVA = potenciaW / fatorPotencia;
  let corrente = 0;
  let descricao = "";

  if (tipoRede === "monofasico") {
    corrente = potenciaVA / tensaoNum;
    descricao = `Monofásico ${tensaoNum}V: ${corrente.toFixed(2)} A`;
  } else if (tipoRede === "bifasico") {
    // Bifásico: divide a carga em 2 fases
    corrente = potenciaVA / tensaoNum / 2;
    descricao = `Bifásico ${tensaoNum}V: ${corrente.toFixed(2)} A por fase`;
  } else if (tipoRede === "trifasico") {
    // Trifásico: I = VA / (V * sqrt(3))
    corrente = potenciaVA / (tensaoNum * Math.sqrt(3));
    descricao = `Trifásico ${tensaoNum}V: ${corrente.toFixed(2)} A por fase`;
  }

  return {
    potenciaVA: potenciaVA.toFixed(2),
    corrente: corrente.toFixed(2),
    descricao,
  };
}

// Calcula intensidade (corrente total) para o painel
export function calcularIntensidade(potenciaW, tensao = "220") {
  const tensaoNum = Number(tensao);
  const fatorPotencia = 0.92;
  const potenciaVA = potenciaW / fatorPotencia;
  // Corrente total (A) para o painel
  return (potenciaVA / tensaoNum).toFixed(2);
}

// Novo cálculo realista de potência considerando brilho, conteúdo e base
export function calcularPotenciaFinal(
  gabinete,
  qtdGabinetes,
  brilhoPercentual,
  fatorConteudo = 0.33,
  consumoBasePercentual = 0.3
) {
  // 1. Potência máxima total - com conversão segura
  const potenciaGab = Number(gabinete.potencia) || 0;
  const P_total_max = potenciaGab * qtdGabinetes;
  // 2. PWM real
  const pwm = Math.pow(brilhoPercentual / 100, 2);
  // 3. Potência ajustada pelo brilho
  const P_brilho = P_total_max * pwm;
  // 4. Potência consumida pelo conteúdo
  const P_conteudo = P_brilho * fatorConteudo;
  // 5. Consumo base
  const P_base = P_total_max * consumoBasePercentual;
  // 6. Potência final estimada
  const P_final = P_conteudo + P_base;
  return {
    P_total_max,
    pwm,
    P_brilho,
    P_conteudo,
    P_base,
    P_final,
  };
}
