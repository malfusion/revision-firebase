import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtopicListComponent } from './subtopic-list.component';

describe('SubtopicListComponent', () => {
  let component: SubtopicListComponent;
  let fixture: ComponentFixture<SubtopicListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtopicListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtopicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
