import React from "react";
import { Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import type { Project } from "../types";
import {
  calculateProjectProgress,
  calculateBudgetUtilization,
  getProjectStatusColor,
  getProjectStatusLabel,
  formatCurrency,
  formatProjectDate,
  isProjectAtRisk,
} from "../utils";
import { Card } from "../../../shared/components";

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  onEdit,
  onDelete,
}) => {
  const progress = calculateProjectProgress(
    project.estimatedHours,
    project.actualHours
  );
  const budgetUtilization = calculateBudgetUtilization(
    project.budget,
    project.spentBudget
  );
  const isAtRisk = isProjectAtRisk(project);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.(project);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(project);
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 relative group">
      <div onClick={handleCardClick} className="w-full h-full">
        {/* Risk indicator */}
        {isAtRisk && (
          <div className="absolute top-3 right-3 z-10">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 pr-8">
              {project.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(
              project.status
            )}`}
          >
            {getProjectStatusLabel(project.status)}
          </span>
        </div>

        {/* Client */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Cliente:</span> {project.client.name}
          </p>
          {project.client.company && (
            <p className="text-sm text-gray-500">{project.client.company}</p>
          )}
        </div>

        {/* Progress */}
        {project.status !== "planning" && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Progresso</span>
              <span className="text-sm font-medium">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress >= 100
                    ? "bg-green-500"
                    : progress >= 75
                    ? "bg-blue-500"
                    : progress >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Budget */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Orçamento</span>
            <span className="text-sm font-medium">
              {budgetUtilization.toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {formatCurrency(project.spentBudget || 0)}
            </span>
            <span className="font-medium">
              {formatCurrency(project.budget)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                budgetUtilization > 100
                  ? "bg-red-500"
                  : budgetUtilization > 80
                  ? "bg-amber-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Início</p>
              <p>{formatProjectDate(project.startDate)}</p>
            </div>
          </div>
          {project.endDate && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Fim</p>
                <p>{formatProjectDate(project.endDate)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Hours */}
        <div className="flex justify-between items-center text-sm mb-4">
          <span className="text-gray-600">Horas</span>
          <span className="font-medium">
            {project.actualHours || 0} / {project.estimatedHours}h
          </span>
        </div>

        {/* Location */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {project.location.city}, {project.location.state}
          </p>
        </div>

        {/* Completion indicator */}
        {project.status === "completed" && (
          <div className="absolute top-3 left-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleEdit}
          className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
        >
          Excluir
        </button>
      </div>
    </Card>
  );
};
