import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { EditorDirective } from './editor.directive';

@NgModule({
	declarations: [
		AppComponent,
		HomePageComponent,
		EditorDirective
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatCardModule,
		MatToolbarModule,
		AppRoutingModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
