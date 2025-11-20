import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TaskDataService } from './task-data.service';
import { environment } from '../../../environments/environment';
import { GetTaskDto, GetTaskQuery, TaskStatusEnum, TaskPriorityEnum } from './dtos';
import { ApiPaginatedList } from '@data/common/dtos';

describe('TaskDataService', () => {
  let service: TaskDataService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskDataService]
    });
    service = TestBed.inject(TaskDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get tasks list', () => {
    const mockResponse: ApiPaginatedList<GetTaskDto> = {
      data: [
        {
          id: 1,
          title: 'Tarefa de teste',
          status: TaskStatusEnum.PENDENTE,
          priority: TaskPriorityEnum.MEDIA,
          createdAt: new Date(),
          updatedAt: new Date(),
          userCreatedId: 1
        }
      ],
      totalPages: 1,
      totalData: 1,
      currentPage: 1
    } as ApiPaginatedList<GetTaskDto>;

    const query = new GetTaskQuery();
    query.page = 1;
    query.size = 10;

    service.getTasks(query).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.data.length).toBe(1);
      expect(response.data[0].title).toBe('Tarefa de teste');
    });

    const req = httpMock.expectOne(`${baseUrl}?page=1&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get task by id', () => {
    const mockTask: GetTaskDto = {
      id: 1,
      title: 'Tarefa de teste',
      status: TaskStatusEnum.PENDENTE,
      priority: TaskPriorityEnum.MEDIA,
      createdAt: new Date(),
      updatedAt: new Date(),
      userCreatedId: 1
    };

    service.getTaskById(1).subscribe(task => {
      expect(task).toEqual(mockTask);
      expect(task.id).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should create task', () => {
    const newTask: Partial<GetTaskDto> = {
      title: 'Nova tarefa',
      status: TaskStatusEnum.PENDENTE,
      priority: TaskPriorityEnum.ALTA,
      userCreatedId: 1
    };

    const mockResponse: GetTaskDto = {
      id: 1,
      ...newTask,
      createdAt: new Date(),
      updatedAt: new Date()
    } as GetTaskDto;

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(mockResponse);
      expect(task.id).toBe(1);
      expect(task.title).toBe('Nova tarefa');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(mockResponse);
  });

  it('should update task', () => {
    const taskUpdate: Partial<GetTaskDto> = {
      title: 'Tarefa atualizada',
      status: TaskStatusEnum.EM_ANDAMENTO
    };

    const mockResponse: GetTaskDto = {
      id: 1,
      title: 'Tarefa atualizada',
      status: TaskStatusEnum.EM_ANDAMENTO,
      priority: TaskPriorityEnum.MEDIA,
      createdAt: new Date(),
      updatedAt: new Date(),
      userCreatedId: 1
    };

    service.updateTask(1, taskUpdate).subscribe(task => {
      expect(task).toEqual(mockResponse);
      expect(task.title).toBe('Tarefa atualizada');
      expect(task.status).toBe(TaskStatusEnum.EM_ANDAMENTO);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(taskUpdate);
    req.flush(mockResponse);
  });

  it('should delete task', () => {
    service.deleteTask(1).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get my tasks', () => {
    const mockResponse: ApiPaginatedList<GetTaskDto> = {
      data: [
        {
          id: 1,
          title: 'Minha tarefa',
          status: TaskStatusEnum.PENDENTE,
          priority: TaskPriorityEnum.MEDIA,
          createdAt: new Date(),
          updatedAt: new Date(),
          userCreatedId: 1,
          userResponsibleId: 1
        }
      ],
      totalPages: 1,
      totalData: 1,
      currentPage: 1
    } as ApiPaginatedList<GetTaskDto>;

    const query = new GetTaskQuery();
    query.page = 1;
    query.size = 10;

    service.getMyTasks(query).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.data.length).toBe(1);
      expect(response.data[0].title).toBe('Minha tarefa');
    });

    const req = httpMock.expectOne(`${baseUrl}/my-tasks?page=1&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
