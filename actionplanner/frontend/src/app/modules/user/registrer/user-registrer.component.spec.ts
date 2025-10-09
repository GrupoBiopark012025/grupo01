import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistrerComponent } from './user-registrer.component';

describe('UserRegistrerComponent', () => {
  let component: UserRegistrerComponent;
  let fixture: ComponentFixture<UserRegistrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRegistrerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRegistrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
