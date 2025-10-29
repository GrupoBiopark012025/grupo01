import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskPriorityBadgeComponent } from './task-priority-badge.component';
import { TaskPriorityEnum } from '@data/task/dtos';

describe('TaskPriorityBadgeComponent', () => {
  let component: TaskPriorityBadgeComponent;
  let fixture: ComponentFixture<TaskPriorityBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPriorityBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPriorityBadgeComponent);
    component = fixture.componentInstance;
    component.priority = TaskPriorityEnum.BAIXA; // Define uma prioridade padrão para teste
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct label for each priority', () => {
    component.priority = TaskPriorityEnum.BAIXA;
    expect(component.getLabel()).toBe('Baixa');

    component.priority = TaskPriorityEnum.MEDIA;
    expect(component.getLabel()).toBe('Média');

    component.priority = TaskPriorityEnum.ALTA;
    expect(component.getLabel()).toBe('Alta');

    component.priority = TaskPriorityEnum.URGENTE;
    expect(component.getLabel()).toBe('Urgente');
  });

  it('should return the correct CSS classes for each priority', () => {
    component.priority = TaskPriorityEnum.BAIXA;
    expect(component.getBadgeClass()).toContain('bg-green-100');

    component.priority = TaskPriorityEnum.MEDIA;
    expect(component.getBadgeClass()).toContain('bg-blue-100');

    component.priority = TaskPriorityEnum.ALTA;
    expect(component.getBadgeClass()).toContain('bg-orange-100');

    component.priority = TaskPriorityEnum.URGENTE;
    expect(component.getBadgeClass()).toContain('bg-red-100');
  });
});