import { State, Action, StateContext, Selector } from '@ngxs/store';

export class AppStateModel {
  currentSubject?: string;
}

export class SetCurrentSubject {
  static readonly type = '[App] SetCurrentSubject';
  constructor(public payload: string) {}
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    currentSubject: undefined
  }
})
export class AppState {
  constructor() {}

  @Selector()
  static currentSubject(state: AppStateModel) {
    return state.currentSubject;
  }

  @Action(SetCurrentSubject)
  setCurrentSubject({ patchState }: StateContext<AppStateModel>, { payload }: SetCurrentSubject) {
    patchState({
      currentSubject: payload
    });
  }
}
