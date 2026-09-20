import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { ProfilePage } from './profile.page';
import { SimulationPage } from './simulation.page';
import { LearningPage } from './learning.page';

const routes: Routes = [
  { path: 'overview', component: DashboardPage },
  { path: 'profile', component: ProfilePage },
  { path: 'simulation', component: SimulationPage },
  { path: 'learning', component: LearningPage },
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
];

@NgModule({
  declarations: [DashboardPage, ProfilePage, SimulationPage, LearningPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class DashboardModule {}
