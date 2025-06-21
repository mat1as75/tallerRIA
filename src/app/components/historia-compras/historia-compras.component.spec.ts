import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaComprasComponent } from './historia-compras.component';

describe('HistoriaComprasComponent', () => {
  let component: HistoriaComprasComponent;
  let fixture: ComponentFixture<HistoriaComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
