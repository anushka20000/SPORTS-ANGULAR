import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedStudentsComponent } from './subscribed-students.component';

describe('SubscribedStudentsComponent', () => {
  let component: SubscribedStudentsComponent;
  let fixture: ComponentFixture<SubscribedStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribedStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
