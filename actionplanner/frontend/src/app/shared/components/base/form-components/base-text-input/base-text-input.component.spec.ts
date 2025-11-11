import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTextInputComponent } from './base-text-input.component';

describe('BaseTextInputComponent', () => {
  let component: BaseTextInputComponent;
  let fixture: ComponentFixture<BaseTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseTextInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
