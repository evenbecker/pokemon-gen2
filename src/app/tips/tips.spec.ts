import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tips } from './tips';

describe('Tips', () => {
  let component: Tips;
  let fixture: ComponentFixture<Tips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tips]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
