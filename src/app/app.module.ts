import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { DocsPageComponent } from './docs-page/docs-page.component';
import { LeaderboardPageComponent } from './leaderboard-page/leaderboard-page.component';
import { MultiplayerPageComponent } from './multiplayer-page/multiplayer-page.component';

@NgModule({
	declarations: [
		AppComponent,
		HomePageComponent,
		GameBoardComponent,
		DocsPageComponent,
		LeaderboardPageComponent,
		MultiplayerPageComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatCardModule,
		MatDividerModule,
		MatToolbarModule,
		AppRoutingModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
