import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostChartComponent } from './cost-chart.component';

describe('CostChartComponent', () => {
  let component: CostChartComponent;
  let fixture: ComponentFixture<CostChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
