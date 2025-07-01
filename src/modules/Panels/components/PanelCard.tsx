import React from "react";
import {
  Monitor,
  Zap,
  Eye,
  Thermometer,
  Edit2,
  Trash2,
  Copy,
} from "lucide-react";
import type { Panel } from "../types";
import {
  calculatePanelMetrics,
  formatPowerConsumption,
  formatDimensions,
} from "../utils";

interface PanelCardProps {
  panel: Panel;
  onEdit?: (panel: Panel) => void;
  onDelete?: (panel: Panel) => void;
  onDuplicate?: (panel: Panel) => void;
  onClick?: (panel: Panel) => void;
}

export const PanelCard: React.FC<PanelCardProps> = ({
  panel,
  onEdit,
  onDelete,
  onDuplicate,
  onClick,
}) => {
  const calculations = calculatePanelMetrics(panel);

  return (
    <div
      className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick?.(panel)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-led-primary/20 rounded-lg">
            <Monitor className="h-5 w-5 text-led-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{panel.name}</h3>
            <p className="text-sm text-gray-300">
              {panel.manufacturer} {panel.model}
            </p>
          </div>
        </div>

        {/* Actions menu - visible on hover */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(panel);
              }}
              className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
              title="Edit Panel"
            >
              <Edit2 className="h-4 w-4 text-blue-400" />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(panel);
              }}
              className="p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
              title="Duplicate Panel"
            >
              <Copy className="h-4 w-4 text-green-400" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(panel);
              }}
              className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
              title="Delete Panel"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Monitor className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300">Dimensions</span>
          </div>
          <p className="text-white font-medium">
            {formatDimensions(panel.width, panel.height)}
          </p>
          <p className="text-xs text-gray-400">
            {calculations.resolution.horizontal} ×{" "}
            {calculations.resolution.vertical} px
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Zap className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300">Power</span>
          </div>
          <p className="text-white font-medium">
            {formatPowerConsumption(panel.powerConsumption)}
          </p>
          <p className="text-xs text-gray-400">{panel.inputVoltage}V input</p>
        </div>
      </div>

      {/* Additional specs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm">
            <Eye className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300">Pixel Pitch</span>
          </div>
          <p className="text-white font-medium">{panel.pixelPitch}mm</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm">
            <Thermometer className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300">Operating Temp</span>
          </div>
          <p className="text-white font-medium">
            {panel.operatingTemperature.min}°C to{" "}
            {panel.operatingTemperature.max}°C
          </p>
        </div>
      </div>

      {/* Price */}
      {panel.price && (
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Price</span>
            <span className="text-lg font-bold text-led-accent">
              ${panel.price.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-led-primary/5 to-led-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
