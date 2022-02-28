import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPoComponent } from './board-po.component';

describe('BoardPoComponent', () => {
  let component: BoardPoComponent;
  let fixture: ComponentFixture<BoardPoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardPoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
