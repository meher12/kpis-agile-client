import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStoryBySprintComponent } from './list-story-by-sprint.component';

describe('ListStoryBySprintComponent', () => {
  let component: ListStoryBySprintComponent;
  let fixture: ComponentFixture<ListStoryBySprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListStoryBySprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStoryBySprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
