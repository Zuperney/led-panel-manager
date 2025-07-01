import React from "react";
import { Calendar, Clock, User, Edit2, Trash2 } from "lucide-react";
import type { Project } from "../types/project.types";

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  // Calcular dias restantes
  const getDaysRemaining = () => {
    const deliveryDate = new Date(project.deliveryDate);
    const today = new Date();
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  // Função para obter cor do status
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Função para obter label do status
  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return '📋 Planejamento';
      case 'in-progress':
        return '🚧 Em Andamento';
      case 'delivered':
        return '✅ Entregue';
      case 'cancelled':
        return '❌ Cancelado';
      default:
        return status;
    }
  };

  // Função para obter cor da urgência
  const getUrgencyColor = () => {
    if (project.status === 'delivered' || project.status === 'cancelled') {
      return '';
    }

    if (daysRemaining < 0) {
      return 'text-red-600'; // Atrasado
    } else if (daysRemaining <= 3) {
      return 'text-red-500'; // Urgente
    } else if (daysRemaining <= 7) {
      return 'text-yellow-600'; // Atenção
    } else {
      return 'text-green-600'; // Ok
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
              {project.name}
            </h3>
          </div>
          
          <div className="flex space-x-1 ml-2">
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Editar projeto"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Excluir projeto"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status e urgência */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
            {getStatusLabel(project.status)}
          </span>
          
          {project.status !== 'delivered' && project.status !== 'cancelled' && (
            <span className={`text-xs font-medium ${getUrgencyColor()}`}>
              {daysRemaining < 0 ? 
                `⚠️ ${Math.abs(daysRemaining)} dia(s) atrasado` :
                daysRemaining === 0 ? 
                  '📅 Entrega hoje!' :
                  daysRemaining === 1 ? 
                    '⏰ Entrega amanhã' :
                    `📆 ${daysRemaining} dias restantes`
              }
            </span>
          )}
        </div>

        {/* Informações do projeto */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-500">Cliente:</span>
            <span className="font-medium ml-2">{project.client}</span>
          </div>

          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-500">Entrega:</span>
            <span className="font-medium ml-2">
              {new Date(project.deliveryDate).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-500">Criado:</span>
            <span className="font-medium ml-2">
              {new Date(project.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Descrição */}
        {project.description && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 line-clamp-2">
              {project.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
