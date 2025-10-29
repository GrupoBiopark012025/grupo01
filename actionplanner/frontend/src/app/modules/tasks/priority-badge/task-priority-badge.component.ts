import { Component, Input } from '@angular/core';
import { TaskPriorityEnum } from "@data/task/dtos";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";

@Component({
  selector: 'app-task-priority-badge',
  standalone: true,
  imports: [ZardBadgeComponent],
  templateUrl: './task-priority-badge.component.html'
})
export class TaskPriorityBadgeComponent {
  @Input({ required: true }) priority!: TaskPriorityEnum;

  getLabel(): string {
    const labels = {
      [TaskPriorityEnum.BAIXA]: 'Baixa',
      [TaskPriorityEnum.MEDIA]: 'Média',
      [TaskPriorityEnum.ALTA]: 'Alta',
      [TaskPriorityEnum.URGENTE]: 'Urgente'
    };

    return labels[this.priority] || 'Desconhecido';
  }

  getBadgeClass(): string {
    const classes = {
      [TaskPriorityEnum.BAIXA]: 'bg-green-100 text-green-800 border-green-200',
      [TaskPriorityEnum.MEDIA]: 'bg-blue-100 text-blue-800 border-blue-200',
      [TaskPriorityEnum.ALTA]: 'bg-orange-100 text-orange-800 border-orange-200',
      [TaskPriorityEnum.URGENTE]: 'bg-red-100 text-red-800 border-red-200'
    };

    return classes[this.priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  }
}