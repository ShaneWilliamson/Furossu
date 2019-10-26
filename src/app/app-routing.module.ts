import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LeaderboardPageComponent } from './leaderboard-page/leaderboard-page.component';
import { MultiplayerPageComponent } from './multiplayer-page/multiplayer-page.component';


const routes: Routes = [
	{
		path: '',
		component: HomePageComponent,
	},
	{
		path: 'leaderboard',
		component: LeaderboardPageComponent,
	},
	{
		path: 'multiplayer',
		component: MultiplayerPageComponent,
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
