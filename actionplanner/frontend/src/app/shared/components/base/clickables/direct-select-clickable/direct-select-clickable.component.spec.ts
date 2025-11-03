import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSelectClickableComponent } from './direct-select-clickable.component';

describe('DirectSelectClickableComponent', () => {
  let component: DirectSelectClickableComponent;
  let fixture: ComponentFixture<DirectSelectClickableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectSelectClickableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectSelectClickableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
