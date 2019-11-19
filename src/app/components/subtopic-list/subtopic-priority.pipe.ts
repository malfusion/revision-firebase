import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { TopicsState } from 'src/app/services/state/topics.state';
import { take } from 'rxjs/operators';

@Pipe({
  name: 'subtopicPriority'
})
export class SubtopicPriorityPipe implements PipeTransform {
  constructor(private store: Store) {}

  transform(value: any, filter: string, ...args: any[]): any {
    if (filter === 'revision') {
      value = value.filter(subtopic => {
        return this.needsRevision(subtopic);
      });
    } else if (filter === 'unattended') {
      value = value.filter(subtopic => {
        return this.needsFirstRead(subtopic);
      });
    }

    return value;
  }

  needsRevision(subtopic) {
    if (
      subtopic.num_revisions > 0 &&
      subtopic.revision_deadline &&
      new Date() > new Date(subtopic.revision_deadline.seconds * 1000)
    ) {
      return true;
    }
    return false;
  }

  needsFirstRead(subtopic) {
    return subtopic.num_revisions === 0;
  }
}
