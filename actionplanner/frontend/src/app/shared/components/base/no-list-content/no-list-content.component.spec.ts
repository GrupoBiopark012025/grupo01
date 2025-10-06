import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoListContentComponent } from './no-list-content.component';

describe('NoListContentComponent', () => {
  let component: NoListContentComponent;
  let fixture: ComponentFixture<NoListContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoListContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoListContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
