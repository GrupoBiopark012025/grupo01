import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetorEditComponent } from './setor-edit.component';

describe('SetorEditComponent', () => {
  let component: SetorEditComponent;
  let fixture: ComponentFixture<SetorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetorEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
