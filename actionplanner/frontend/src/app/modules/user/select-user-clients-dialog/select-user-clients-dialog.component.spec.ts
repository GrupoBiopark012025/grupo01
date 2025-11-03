import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUserClientsDialogComponent } from './select-user-clients-dialog.component';

describe('SelectUserClientsDialogComponent', () => {
  let component: SelectUserClientsDialogComponent;
  let fixture: ComponentFixture<SelectUserClientsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectUserClientsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectUserClientsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
