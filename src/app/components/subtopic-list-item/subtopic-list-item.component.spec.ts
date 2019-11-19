import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtopicListItemComponent } from './subtopic-list-item.component';

describe('SubtopicListItemComponent', () => {
  let component: SubtopicListItemComponent;
  let fixture: ComponentFixture<SubtopicListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtopicListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtopicListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
