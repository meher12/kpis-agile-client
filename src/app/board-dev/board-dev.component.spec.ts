import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardDevComponent } from './board-dev.component';

describe('BoardDevComponent', () => {
  let component: BoardDevComponent;
  let fixture: ComponentFixture<BoardDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
