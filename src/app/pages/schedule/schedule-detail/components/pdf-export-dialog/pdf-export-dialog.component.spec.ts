import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfExportDialogComponent } from './pdf-export-dialog.component';

describe('PdfExportDialogComponent', () => {
  let component: PdfExportDialogComponent;
  let fixture: ComponentFixture<PdfExportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfExportDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfExportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
