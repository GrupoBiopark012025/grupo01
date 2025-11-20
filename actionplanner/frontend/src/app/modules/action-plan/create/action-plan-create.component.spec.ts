import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanCreateComponent } from './action-plan-create.component';

describe('ActionPlanCreateComponent', () => {
  let component: ActionPlanCreateComponent;
  let fixture: ComponentFixture<ActionPlanCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPlanCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionPlanCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

