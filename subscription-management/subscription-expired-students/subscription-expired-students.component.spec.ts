import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionExpiredStudentsComponent } from './subscription-expired-students.component';

describe('SubscriptionExpiredStudentsComponent', () => {
  let component: SubscriptionExpiredStudentsComponent;
  let fixture: ComponentFixture<SubscriptionExpiredStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionExpiredStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionExpiredStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
