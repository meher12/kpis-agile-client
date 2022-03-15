import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListByStoryComponent } from './task-list-by-story.component';

describe('TaskListByStoryComponent', () => {
  let component: TaskListByStoryComponent;
  let fixture: ComponentFixture<TaskListByStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskListByStoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListByStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
