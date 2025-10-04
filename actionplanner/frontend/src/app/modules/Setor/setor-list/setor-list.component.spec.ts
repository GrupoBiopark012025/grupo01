import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetorListComponent } from './setor-list.component';

describe('SetorListComponent', () => {
  let component: SetorListComponent;
  let fixture: ComponentFixture<SetorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
