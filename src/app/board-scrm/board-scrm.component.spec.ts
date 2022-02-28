import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardScrmComponent } from './board-scrm.component';

describe('BoardScrmComponent', () => {
  let component: BoardScrmComponent;
  let fixture: ComponentFixture<BoardScrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardScrmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardScrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
