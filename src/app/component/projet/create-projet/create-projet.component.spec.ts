import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjetComponent } from './create-projet.component';

describe('CreateProjetComponent', () => {
  let component: CreateProjetComponent;
  let fixture: ComponentFixture<CreateProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProjetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
