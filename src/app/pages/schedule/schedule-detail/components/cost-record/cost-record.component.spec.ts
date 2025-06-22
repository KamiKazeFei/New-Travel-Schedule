import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostRecordComponent } from './cost-record.component';

describe('CostRecordComponent', () => {
  let component: CostRecordComponent;
  let fixture: ComponentFixture<CostRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
