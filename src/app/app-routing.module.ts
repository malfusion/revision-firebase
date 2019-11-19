import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, NavigationEnd } from '@angular/router';
import { StartupComponent } from './pages/startup/startup.component';
import { HomeComponent } from './pages/home/home.component';
import { SubjectDetailComponent } from './pages/subject-detail/subject-detail.component';
import { filter } from 'rxjs/operators';
import { TodayComponent } from './pages/today/today.component';
const routes: Routes = [
  {
    path: '',
    component: StartupComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'subject/:subjectId',
        component: SubjectDetailComponent
      },
      {
        path: 'today',
        component: TodayComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {}
}
