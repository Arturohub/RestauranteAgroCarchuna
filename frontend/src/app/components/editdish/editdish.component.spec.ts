import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdishComponent } from './editdish.component';

describe('EditdishComponent', () => {
  let component: EditdishComponent;
  let fixture: ComponentFixture<EditdishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditdishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditdishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
