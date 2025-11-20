import { Component, Input } from '@angular/core';
import { TaskStatusEnum } from "@data/task/dtos";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";

@Component({
  selector: 'app-task-status-badge',
  standalone: true,
  imports: [ZardBadgeComponent],
  templateUrl: './task-status-badge.component.html'
})
export class TaskStatusBadgeComponent {
  @Input({ required: true }) status!: TaskStatusEnum;

  getLabel(): string {
    const labels = {
      [TaskStatusEnum.PENDENTE]: 'Pendente',
      [TaskStatusEnum.EM_ANDAMENTO]: 'Em andamento',
      [TaskStatusEnum.CONCLUIDA]: 'Concluída',
      [TaskStatusEnum.CANCELADA]: 'Cancelada'
    };

    return labels[this.status] || 'Desconhecido';
  }

  getBadgeClass(): string {
    const classes = {
      [TaskStatusEnum.PENDENTE]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [TaskStatusEnum.EM_ANDAMENTO]: 'bg-blue-100 text-blue-800 border-blue-200',
      [TaskStatusEnum.CONCLUIDA]: 'bg-green-100 text-green-800 border-green-200',
      [TaskStatusEnum.CANCELADA]: 'bg-red-100 text-red-800 border-red-200'
    };

    return classes[this.status] || 'bg-gray-100 text-gray-800 border-gray-200';
  }
}