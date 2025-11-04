import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEnvironmentDialogComponent } from './change-environment-dialog.component';

describe('ChangeEnvironmentDialogComponent', () => {
  let component: ChangeEnvironmentDialogComponent;
  let fixture: ComponentFixture<ChangeEnvironmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeEnvironmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeEnvironmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
