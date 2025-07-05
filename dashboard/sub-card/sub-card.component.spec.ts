import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCardComponent } from './sub-card.component';

describe('CardsWidget20Component', () => {
  let component: SubCardComponent;
  let fixture: ComponentFixture<SubCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
