import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainWidgetComponent } from './main-widget.component';

describe('MainWidgetComponent', () => {
  let component: MainWidgetComponent;
  let fixture: ComponentFixture<MainWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
