import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorStatusBadgeComponent } from './sector-status-badge.component';

describe('SectorStatusBadgeComponent', () => {
  let component: SectorStatusBadgeComponent;
  let fixture: ComponentFixture<SectorStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectorStatusBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectorStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
