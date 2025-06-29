import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesdepedidoComponent } from './detallesdepedido.component';

describe('DetallesdepedidoComponent', () => {
  let component: DetallesdepedidoComponent;
  let fixture: ComponentFixture<DetallesdepedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesdepedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesdepedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
