import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeStudentsComponent } from './free-students.component';

describe('FreeStudentsComponent', () => {
  let component: FreeStudentsComponent;
  let fixture: ComponentFixture<FreeStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
