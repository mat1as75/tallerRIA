import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPedidoComponent } from './modificar-pedido.component';

describe('ModificarPedidoComponent', () => {
  let component: ModificarPedidoComponent;
  let fixture: ComponentFixture<ModificarPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
