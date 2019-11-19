import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { StartupComponent } from './pages/startup/startup.component';
import { HomeComponent } from './pages/home/home.component';
import { SubjectNavComponent, NewSubjectDialogComponent } from './components/subject-nav/subject-nav.component';
import { TopicTreeComponent, NewTopicDialogComponent } from './components/topic-tree/topic-tree.component';
import { SubjectDetailComponent } from './pages/subject-detail/subject-detail.component';
import {
  SubtopicListItemComponent,
  EditSubtopicLinkDialogComponent
} from './components/subtopic-list-item/subtopic-list-item.component';

import { NewSubtopicDialogComponent } from './components/subtopic-list/subtopic-list.component';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AppState } from './services/state/app.state';
import { TopicsState } from './services/state/topics.state';
import { TopicListItemComponent } from './components/topic-list-item/topic-list-item.component';
import { SubtopicPriorityPipe } from './components/subtopic-list/subtopic-priority.pipe';
import { SubtopicListComponent } from './components/subtopic-list/subtopic-list.component';
import { TodayComponent } from './pages/today/today.component';

@NgModule({
  declarations: [
    AppComponent,
    StartupComponent,
    HomeComponent,
    SubjectNavComponent,
    TopicTreeComponent,
    SubjectDetailComponent,
    SubtopicListItemComponent,
    NewSubjectDialogComponent,
    NewTopicDialogComponent,
    NewSubtopicDialogComponent,
    EditSubtopicLinkDialogComponent,
    TopicListItemComponent,
    SubtopicPriorityPipe,
    SubtopicListComponent,
    TodayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    AppRoutingModule,
    NgxsModule.forRoot([AppState, TopicsState], {
      developmentMode: true
    }),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    NewSubjectDialogComponent,
    NewTopicDialogComponent,
    NewSubtopicDialogComponent,
    EditSubtopicLinkDialogComponent
  ]
})
export class AppModule {}
