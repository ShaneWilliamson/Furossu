import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LeaderboardPageComponent } from './leaderboard-page/leaderboard-page.component';
import { MultiplayerPageComponent } from './multiplayer-page/multiplayer-page.component';
import { DocsPageComponent } from './docs-page/docs-page.component';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
	canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
	providedIn: 'root',
})
export class SavedScriptGuard implements CanDeactivate<CanComponentDeactivate> {
	canDeactivate(component: CanComponentDeactivate) {
		return component.canDeactivate ? component.canDeactivate() : true;
	}
}

const routes: Routes = [
	{
		path: '',
		component: HomePageComponent,
		canDeactivate: [SavedScriptGuard],
	},
	{
		path: 'docs',
		component: DocsPageComponent,
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
