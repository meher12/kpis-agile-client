import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsStoryComponent } from './details-story.component';

describe('DetailsStoryComponent', () => {
  let component: DetailsStoryComponent;
  let fixture: ComponentFixture<DetailsStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsStoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
