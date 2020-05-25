import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponentComponent } from './list-component.component';

describe('ListComponentComponent', () => {
  let component: ListComponentComponent;
  let fixture: ComponentFixture<ListComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
