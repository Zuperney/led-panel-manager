import { useState, useEffect, useCallback } from 'react';
import type { Cabinet, CabinetFormData } from '../types/cabinet.types';

const STORAGE_KEY = 'led-panel-manager-cabinets';

export const useCabinetData = () => {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCabinets(parsed);
      }
    } catch (err) {
      setError('Erro ao carregar dados dos gabinetes');
      console.error('Error loading cabinets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar dados no localStorage
  const saveToStorage = useCallback((data: Cabinet[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      setError('Erro ao salvar dados dos gabinetes');
      console.error('Error saving cabinets:', err);
    }
  }, []);

  // Função para calcular pixel pitch automaticamente
  const calculatePixelPitch = (widthMm: number, widthPixels: number): number => {
    if (widthPixels === 0) return 0;
    return Number((widthMm / widthPixels).toFixed(2));
  };

  // Adicionar gabinete
  const addCabinet = useCallback((formData: CabinetFormData) => {
    try {
      const newCabinet: Cabinet = {
        id: crypto.randomUUID(),
        ...formData,
        pixelPitch: calculatePixelPitch(formData.widthMm, formData.widthPixels),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedCabinets = [...cabinets, newCabinet];
      setCabinets(updatedCabinets);
      saveToStorage(updatedCabinets);
      setError(null);

      return newCabinet;
    } catch (err) {
      setError('Erro ao adicionar gabinete');
      console.error('Error adding cabinet:', err);
      throw err;
    }
  }, [cabinets, saveToStorage]);

  // Atualizar gabinete
  const updateCabinet = useCallback((id: string, formData: CabinetFormData) => {
    try {
      const updatedCabinets = cabinets.map(cabinet => 
        cabinet.id === id 
          ? {
              ...cabinet,
              ...formData,
              pixelPitch: calculatePixelPitch(formData.widthMm, formData.widthPixels),
              updatedAt: new Date().toISOString(),
            }
          : cabinet
      );

      setCabinets(updatedCabinets);
      saveToStorage(updatedCabinets);
      setError(null);

      return updatedCabinets.find(cabinet => cabinet.id === id);
    } catch (err) {
      setError('Erro ao atualizar gabinete');
      console.error('Error updating cabinet:', err);
      throw err;
    }
  }, [cabinets, saveToStorage]);

  // Deletar gabinete
  const deleteCabinet = useCallback((id: string) => {
    try {
      const updatedCabinets = cabinets.filter(cabinet => cabinet.id !== id);
      setCabinets(updatedCabinets);
      saveToStorage(updatedCabinets);
      setError(null);
    } catch (err) {
      setError('Erro ao deletar gabinete');
      console.error('Error deleting cabinet:', err);
      throw err;
    }
  }, [cabinets, saveToStorage]);

  // Buscar gabinete por ID
  const getCabinetById = useCallback((id: string) => {
    return cabinets.find(cabinet => cabinet.id === id);
  }, [cabinets]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Estatísticas dos gabinetes
  const getStats = useCallback(() => {
    const total = cabinets.length;
    const indoor = cabinets.filter(cabinet => cabinet.type === 'indoor').length;
    const outdoor = cabinets.filter(cabinet => cabinet.type === 'outdoor').length;
    
    const averagePixelPitch = total > 0 
      ? Number((cabinets.reduce((sum, cabinet) => sum + cabinet.pixelPitch, 0) / total).toFixed(2))
      : 0;
    
    const totalPower = cabinets.reduce((sum, cabinet) => sum + cabinet.powerWatts, 0);

    return {
      total,
      indoor,
      outdoor,
      averagePixelPitch,
      totalPower,
    };
  }, [cabinets]);

  return {
    cabinets,
    loading,
    error,
    addCabinet,
    updateCabinet,
    deleteCabinet,
    getCabinetById,
    clearError,
    getStats,
  };
};
