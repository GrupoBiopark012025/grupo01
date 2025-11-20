import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUserSectorsDialogComponent } from './select-user-sectors-dialog.component';

describe('SelectUserSectorsDialogComponent', () => {
  let component: SelectUserSectorsDialogComponent;
  let fixture: ComponentFixture<SelectUserSectorsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectUserSectorsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectUserSectorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
