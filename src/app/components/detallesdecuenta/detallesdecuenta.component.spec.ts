import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesdecuentaComponent } from './detallesdecuenta.component';

describe('DetallesdecuentaComponent', () => {
  let component: DetallesdecuentaComponent;
  let fixture: ComponentFixture<DetallesdecuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesdecuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesdecuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
