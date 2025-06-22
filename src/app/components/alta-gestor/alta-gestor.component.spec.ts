import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaGestorComponent } from './alta-gestor.component';

describe('AltaGestorComponent', () => {
  let component: AltaGestorComponent;
  let fixture: ComponentFixture<AltaGestorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaGestorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaGestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
