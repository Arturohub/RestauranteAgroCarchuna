import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasadminComponent } from './reservasadmin.component';

describe('ReservasadminComponent', () => {
  let component: ReservasadminComponent;
  let fixture: ComponentFixture<ReservasadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
