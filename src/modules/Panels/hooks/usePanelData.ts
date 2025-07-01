import { useState, useEffect, useCallback } from "react";
import type { Panel, PanelFilter } from "../types";
import type { PanelFormData } from "../components/PanelForm";

/**
 * Converts PanelFormData to Panel
 */
const formDataToPanel = (
  data: PanelFormData,
  existingId?: string,
  existingCreatedAt?: Date
): Panel => {
  const now = new Date();

  return {
    id:
      existingId ||
      `panel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    manufacturer: data.manufacturer,
    model: data.model,
    width: data.width,
    height: data.height,
    pixelPitch: data.pixelPitch,
    powerConsumption: data.powerConsumption,
    brightness: data.brightness,
    refreshRate: data.refreshRate,
    inputVoltage: data.inputVoltage,
    operatingTemperature: {
      min: data.operatingTemperatureMin,
      max: data.operatingTemperatureMax,
    },
    ipRating: data.ipRating,
    weight: data.weight,
    price: data.price,
    description: data.description,
    createdAt: existingCreatedAt || now,
    updatedAt: now,
  };
};

/**
 * Hook for managing panel data and operations
 */
export const usePanelData = () => {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load panels from localStorage on mount
  useEffect(() => {
    const loadPanels = () => {
      try {
        setLoading(true);
        const storedPanels = localStorage.getItem("led-panels");
        if (storedPanels) {
          const parsedPanels = JSON.parse(storedPanels);
          setPanels(
            parsedPanels.map((panel: any) => ({
              ...panel,
              createdAt: new Date(panel.createdAt),
              updatedAt: new Date(panel.updatedAt),
            }))
          );
        }
      } catch (err) {
        setError("Failed to load panels from storage");
        console.error("Error loading panels:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPanels();
  }, []);

  // Save panels to localStorage whenever panels change
  useEffect(() => {
    if (panels.length > 0) {
      try {
        localStorage.setItem("led-panels", JSON.stringify(panels));
      } catch (err) {
        console.error("Error saving panels:", err);
      }
    }
  }, [panels]);

  const addPanel = useCallback((panelData: PanelFormData) => {
    const newPanel = formDataToPanel(panelData);
    setPanels((prev) => [...prev, newPanel]);
    return newPanel;
  }, []);

  const updatePanel = useCallback((id: string, panelData: PanelFormData) => {
    setPanels((prev) =>
      prev.map((panel) =>
        panel.id === id
          ? formDataToPanel(panelData, id, panel.createdAt)
          : panel
      )
    );
  }, []);

  const deletePanel = useCallback((id: string) => {
    setPanels((prev) => prev.filter((panel) => panel.id !== id));
  }, []);

  const filterPanels = useCallback(
    (filters: PanelFilter) => {
      return panels.filter((panel) => {
        // Search term filter
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          if (
            !panel.name.toLowerCase().includes(searchLower) &&
            !panel.manufacturer.toLowerCase().includes(searchLower) &&
            !panel.model.toLowerCase().includes(searchLower)
          ) {
            return false;
          }
        }

        // Manufacturer filter
        if (
          filters.manufacturer &&
          panel.manufacturer !== filters.manufacturer
        ) {
          return false;
        }

        // Pixel pitch filter
        if (filters.pixelPitch && filters.pixelPitch.length > 0) {
          if (!filters.pixelPitch.includes(panel.pixelPitch)) {
            return false;
          }
        }

        // Power range filter
        if (filters.powerRange) {
          const [min, max] = filters.powerRange;
          if (panel.powerConsumption < min || panel.powerConsumption > max) {
            return false;
          }
        }

        // Price range filter
        if (filters.priceRange && panel.price) {
          const [min, max] = filters.priceRange;
          if (panel.price < min || panel.price > max) {
            return false;
          }
        }

        return true;
      });
    },
    [panels]
  );

  const duplicatePanel = useCallback(
    (id: string) => {
      const panel = panels.find((p) => p.id === id);
      if (panel) {
        const formData: PanelFormData = {
          name: `${panel.name} (Copy)`,
          manufacturer: panel.manufacturer,
          model: panel.model,
          width: panel.width,
          height: panel.height,
          pixelPitch: panel.pixelPitch,
          powerConsumption: panel.powerConsumption,
          brightness: panel.brightness,
          refreshRate: panel.refreshRate,
          inputVoltage: panel.inputVoltage,
          operatingTemperatureMin: panel.operatingTemperature.min,
          operatingTemperatureMax: panel.operatingTemperature.max,
          ipRating: panel.ipRating,
          weight: panel.weight,
          price: panel.price,
          description: panel.description,
        };

        return addPanel(formData);
      }
    },
    [panels, addPanel]
  );

  return {
    panels,
    loading,
    error,
    addPanel,
    updatePanel,
    deletePanel,
    filterPanels,
    duplicatePanel,
    clearError: () => setError(null),
  };
};
