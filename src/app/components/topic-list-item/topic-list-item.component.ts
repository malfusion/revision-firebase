import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TopicsState, SetTopicListFilter } from 'src/app/services/state/topics.state';
import { Store } from '@ngxs/store';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-topic-list-item',
  templateUrl: './topic-list-item.component.html',
  styleUrls: ['./topic-list-item.component.scss']
})
export class TopicListItemComponent implements OnInit {
  @Input() subjectId;
  @Input() topic;
  @ViewChild('filterTrigger', { static: false }) filterTrigger: MatMenuTrigger;
  @ViewChild('confidenceTrigger', { static: false }) confidenceTrigger: MatMenuTrigger;

  expanded = false;
  currentTopicFilter$;
  confidenceFilter = undefined;
  statusFilter = 'any';

  constructor(private store: Store) {}

  ngOnInit() {
    this.currentTopicFilter$ = this.store.select(TopicsState.topicFilter(this.topic.id));
  }

  onTopicClicked(topicId) {
    this.expanded = !this.expanded;
  }

  onTopicFilterClicked($event) {
    this.filterTrigger.openMenu();
    $event.stopPropagation();
  }

  openConfidenceFilterMenu($event) {
    this.confidenceTrigger.openMenu();
    $event.stopPropagation();
  }

  getStatusName(filterName) {
    return (
      {
        revision: 'To Revise',
        unattended: 'New Topics',
        aced: 'Healthy',
        any: 'Any',
      }[filterName] || ''
    );
  }

  setConfidenceFilter($event, confidence) {
    if (this.confidenceFilter === confidence) {
      this.confidenceFilter = undefined;
    } else {
      this.confidenceFilter = confidence;
    }
    this.confidenceTrigger.closeMenu();
    $event.stopPropagation();
  }

  setFilter(filter) {
    this.statusFilter = filter;
    this.filterTrigger.closeMenu();
    this.store.dispatch(new SetTopicListFilter(this.topic.id, filter));
  }
}
