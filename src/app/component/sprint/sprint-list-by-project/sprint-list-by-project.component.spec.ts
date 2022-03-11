import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintListByProjectComponent } from './sprint-list-by-project.component';

describe('SprintListByProjectComponent', () => {
  let component: SprintListByProjectComponent;
  let fixture: ComponentFixture<SprintListByProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SprintListByProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintListByProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
