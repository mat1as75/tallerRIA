import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorUpdateComponent } from './gestor-update.component';

describe('GestorUpdateComponent', () => {
  let component: GestorUpdateComponent;
  let fixture: ComponentFixture<GestorUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestorUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
