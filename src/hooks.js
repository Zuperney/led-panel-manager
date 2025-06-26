import { useState, useEffect } from "react";

// Hook customizado para carregar dados de APIs
export function useApiData(endpoint, isActive = true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isActive) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Carregando dados de: /api/${endpoint}`);
        const response = await fetch(`/api/${endpoint}`);
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
        }
        const result = await response.json();
        console.log(`Dados carregados de ${endpoint}:`, result);
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error(`Erro ao carregar ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, isActive]);

  const updateData = async (newData) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (!response.ok) throw new Error(`Erro ao salvar ${endpoint}`);
      setData(newData);
      return true;
    } catch (err) {
      setError(err.message);
      console.error(`Erro ao salvar ${endpoint}:`, err);
      return false;
    }
  };

  return { data, setData, loading, error, updateData };
}

// Hook para persistência no localStorage
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue];
}

// Hook para controle de feedback temporário
export function useTemporaryFeedback(duration = 3000) {
  const [feedback, setFeedback] = useState("");

  const showFeedback = (message) => {
    setFeedback(message);
    setTimeout(() => setFeedback(""), duration);
  };

  return [feedback, showFeedback];
}
