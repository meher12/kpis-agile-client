import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSprintComponent } from './update-sprint.component';

describe('UpdateSprintComponent', () => {
  let component: UpdateSprintComponent;
  let fixture: ComponentFixture<UpdateSprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
