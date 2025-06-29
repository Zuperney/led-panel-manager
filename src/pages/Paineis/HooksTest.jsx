/**
 * Arquivo de teste para validar hooks individualmente
 * Este arquivo deve ser removido após integração completa
 * 
 * @author Led Panel Manager Team
 * @since 1.3.0
 */

import React from 'react';
import {
  usePainelForm,
  usePainelCrud,
  usePainelCalculations,
  usePainelFiltering
} from './hooks';

// Mock data for testing
const mockGabinetes = [
  {
    nome: 'Gabinete Test',
    largura: 500,
    altura: 500,
    potencia: 250,
    tipo: 'indoor'
  }
];

const mockPaineis = [
  {
    nome: 'Painel Test',
    projeto: 'Projeto Test',
    gabinete: 'Gabinete Test',
    modo: 'metro',
    larguraM: 2,
    alturaM: 1.5,
    qtdLargura: 4,
    qtdAltura: 3
  }
];

/**
 * Componente de teste simples para validar hooks
 */
function HooksTest() {
  console.log('🧪 Testando hooks individuais...');

  // Teste usePainelForm
  try {
    const formHook = usePainelForm('projeto-test');
    console.log('✅ usePainelForm: OK', formHook.form);
  } catch (error) {
    console.error('❌ usePainelForm:', error);
  }

  // Teste usePainelCalculations
  try {
    const calcHook = usePainelCalculations({
      form: {
        gabinete: 'Gabinete Test',
        modo: 'metro',
        larguraM: 2,
        alturaM: 1.5
      },
      gabinetes: mockGabinetes,
      tensao: '220',
      tipoRede: 'bifasico'
    });
    console.log('✅ usePainelCalculations: OK', calcHook.resultado);
  } catch (error) {
    console.error('❌ usePainelCalculations:', error);
  }

  // Teste usePainelFiltering
  try {
    const filterHook = usePainelFiltering(mockPaineis, mockGabinetes);
    console.log('✅ usePainelFiltering: OK', filterHook.paineisFiltrados);
  } catch (error) {
    console.error('❌ usePainelFiltering:', error);
  }

  // Teste usePainelCrud (mock básico)
  try {
    const crudHook = usePainelCrud({
      paineis: mockPaineis,
      setPaineis: () => {},
      paineisFiltrados: mockPaineis,
      selectedProjectId: 'projeto-test',
      salvarPaineis: async () => {},
      showFeedback: () => {}
    });
    console.log('✅ usePainelCrud: OK', !!crudHook.criarPainel);
  } catch (error) {
    console.error('❌ usePainelCrud:', error);
  }

  return (
    <div>
      <h3>Teste de Hooks - Verifique o console</h3>
      <p>Este componente testa a inicialização dos hooks.</p>
    </div>
  );
}

export default HooksTest;
