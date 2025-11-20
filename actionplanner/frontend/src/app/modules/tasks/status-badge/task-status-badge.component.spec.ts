import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStatusBadgeComponent } from './task-status-badge.component';
import { TaskStatusEnum } from '@data/task/dtos';

describe('TaskStatusBadgeComponent', () => {
  let component: TaskStatusBadgeComponent;
  let fixture: ComponentFixture<TaskStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskStatusBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskStatusBadgeComponent);
    component = fixture.componentInstance;
    component.status = TaskStatusEnum.PENDENTE; // Define um status padrão para teste
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct label for each status', () => {
    component.status = TaskStatusEnum.PENDENTE;
    expect(component.getLabel()).toBe('Pendente');

    component.status = TaskStatusEnum.EM_ANDAMENTO;
    expect(component.getLabel()).toBe('Em andamento');

    component.status = TaskStatusEnum.CONCLUIDA;
    expect(component.getLabel()).toBe('Concluída');

    component.status = TaskStatusEnum.CANCELADA;
    expect(component.getLabel()).toBe('Cancelada');
  });

  it('should return the correct CSS classes for each status', () => {
    component.status = TaskStatusEnum.PENDENTE;
    expect(component.getBadgeClass()).toContain('bg-yellow-100');

    component.status = TaskStatusEnum.EM_ANDAMENTO;
    expect(component.getBadgeClass()).toContain('bg-blue-100');

    component.status = TaskStatusEnum.CONCLUIDA;
    expect(component.getBadgeClass()).toContain('bg-green-100');

    component.status = TaskStatusEnum.CANCELADA;
    expect(component.getBadgeClass()).toContain('bg-red-100');
  });
});