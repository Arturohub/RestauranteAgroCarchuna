import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatenewdishComponent } from './createnewdish.component';

describe('CreatenewdishComponent', () => {
  let component: CreatenewdishComponent;
  let fixture: ComponentFixture<CreatenewdishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatenewdishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatenewdishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
