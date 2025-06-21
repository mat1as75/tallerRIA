import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarpasswordComponent } from './cambiarpassword.component';

describe('CambiarpasswordComponent', () => {
  let component: CambiarpasswordComponent;
  let fixture: ComponentFixture<CambiarpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiarpasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
