import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { ProfilePage } from './profile.page';
import { SimulationPage } from './simulation.page';
import { LearningPage } from './learning.page';
import { CareerExplorerPage } from './career-explorer.page';
import { CareerDetailPage } from './career-detail.page';
import { CareerLabPage } from './career-lab.page';
import { AppShellComponent } from './app-shell.component';
import { AssessmentPage } from './assessment.page';
import { ResultsPage } from './results.page';

const routes: Routes = [
  { path: 'overview', component: DashboardPage },
  { path: 'profile', component: ProfilePage },
  { path: 'assessment', component: AssessmentPage },
  { path: 'career-explorer', component: CareerExplorerPage },
  { path: 'career-explorer/:slug', component: CareerDetailPage },
  { path: 'career-lab', component: CareerLabPage },
  { path: 'simulation', component: SimulationPage },
  { path: 'results', component: ResultsPage },
  { path: 'learning', component: LearningPage },
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    DashboardPage, ProfilePage, CareerExplorerPage, CareerDetailPage, CareerLabPage, SimulationPage, LearningPage,
    AppShellComponent, AssessmentPage, ResultsPage,
  ],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
})
export class DashboardModule {}
