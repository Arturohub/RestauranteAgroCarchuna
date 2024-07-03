import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserinfoAdminComponent } from './userinfo-admin.component';

describe('UserinfoAdminComponent', () => {
  let component: UserinfoAdminComponent;
  let fixture: ComponentFixture<UserinfoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserinfoAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserinfoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
