import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckClickableComponent } from './check-clickable.component';

describe('CheckClickableComponent', () => {
  let component: CheckClickableComponent;
  let fixture: ComponentFixture<CheckClickableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckClickableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckClickableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
