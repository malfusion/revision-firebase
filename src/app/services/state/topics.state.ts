import { State, Action, StateContext, Selector, createSelector } from '@ngxs/store';

export class TopicsStateModel {
  filter: {
    [s: string]: string;
  };
}

export class SetTopicListFilter {
  static readonly type = '[Topics] SetTopicListFilter';
  constructor(public topicId: string, public filter: string) {}
}

@State<TopicsStateModel>({
  name: 'topics',
  defaults: {
    filter: {}
  }
})
export class TopicsState {
  constructor() {}

  static topicFilter(topicId: string) {
    return createSelector(
      [TopicsState.filter],
      (filter: any) => {
        return filter[topicId] || 'revision';
      }
    );
  }

  @Selector()
  static filter(state: TopicsStateModel) {
    return state.filter;
  }

  @Action(SetTopicListFilter)
  setTopicListFilter(ctx: StateContext<TopicsStateModel>, { topicId, filter }: SetTopicListFilter) {
    const state = ctx.getState();
    return ctx.patchState({
      filter: {
        ...state.filter,
        [topicId]: filter
      }
    });
  }

  updateEntity(ctx, entityId, newEntity) {
    const state = ctx.getState();
    ctx.patchState({
      entities: {
        ...state.entities,
        [entityId]: {
          ...state.entities[entityId],
          ...newEntity
        }
      }
    });
  }
}
