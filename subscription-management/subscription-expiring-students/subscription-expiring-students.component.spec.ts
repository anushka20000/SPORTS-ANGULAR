import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionExpiringStudentsComponent } from './subscription-expiring-students.component';

describe('SubscriptionExpiringStudentsComponent', () => {
  let component: SubscriptionExpiringStudentsComponent;
  let fixture: ComponentFixture<SubscriptionExpiringStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionExpiringStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionExpiringStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
