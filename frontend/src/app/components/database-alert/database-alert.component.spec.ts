import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseAlertComponent } from './database-alert.component';

describe('DatabaseAlertComponent', () => {
  let component: DatabaseAlertComponent;
  let fixture: ComponentFixture<DatabaseAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
