import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSelectSkeletonComponent } from './direct-select-skeleton.component';

describe('DirectSelectSkeletonComponent', () => {
  let component: DirectSelectSkeletonComponent;
  let fixture: ComponentFixture<DirectSelectSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectSelectSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectSelectSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
