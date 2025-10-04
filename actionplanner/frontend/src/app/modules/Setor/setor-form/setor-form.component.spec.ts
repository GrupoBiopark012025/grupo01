import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetorFormComponent } from './setor-form.component';

describe('SetorFormComponent', () => {
  let component: SetorFormComponent;
  let fixture: ComponentFixture<SetorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});