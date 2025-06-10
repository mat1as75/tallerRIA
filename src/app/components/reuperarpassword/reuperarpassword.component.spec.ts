import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuperarpasswordComponent } from './reuperarpassword.component';

describe('ReuperarpasswordComponent', () => {
  let component: ReuperarpasswordComponent;
  let fixture: ComponentFixture<ReuperarpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReuperarpasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuperarpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
