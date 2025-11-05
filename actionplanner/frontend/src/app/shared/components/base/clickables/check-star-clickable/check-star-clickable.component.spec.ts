import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckStarClickableComponent } from './check-star-clickable.component';

describe('CheckClickableComponent', () => {
  let component: CheckStarClickableComponent;
  let fixture: ComponentFixture<CheckStarClickableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckStarClickableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckStarClickableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
