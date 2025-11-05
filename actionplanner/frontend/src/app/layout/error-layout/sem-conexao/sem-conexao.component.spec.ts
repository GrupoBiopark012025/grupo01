import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemConexaoComponent } from './sem-conexao.component';
import { RouterModule, provideRouter } from '@angular/router';

describe(SemConexaoComponent.name, () => {
  let component: SemConexaoComponent;
  let fixture: ComponentFixture<SemConexaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemConexaoComponent, RouterModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SemConexaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve instanciar o componente', () => {
    expect(component).toBeTruthy();
  });
});
