import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInfoDialogComponent } from './schedule-info-dialog.component';

describe('ScheduleInfoDialogComponent', () => {
  let component: ScheduleInfoDialogComponent;
  let fixture: ComponentFixture<ScheduleInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
