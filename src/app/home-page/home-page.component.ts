import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { CmService, DEFAULT_SCRIPT } from '../cm.service';
import * as cm from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/search/match-highlighter.js';
import { Router } from '@angular/router';
import { Observable, merge, of } from 'rxjs';
import { GameService } from '../game.service';
import { GuessResult } from '../common/guessresult';

@Component({
	selector: 'code-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements AfterViewInit {
	saved$: Observable<boolean>;
	public guessResults$: Observable<GuessResult[]>;
	public score$: Observable<number>;

	constructor(private renderer: Renderer2, private cmService: CmService, private router: Router, private gameService: GameService) {
		(<any>window).JSHINT = require('jshint').JSHINT;
		this.saved$ = this.gameService.savedScript$;
		this.score$ = this.gameService.score$;
		this.guessResults$ = this.gameService.guessResults$;
	}

	ngAfterViewInit(): void {
		this.cmService.setCM(cm.fromTextArea(
			this.renderer.selectRootElement('[codeEditor]'),
			{
				lineNumbers: true,
				mode: "javascript",
				gutters: ["CodeMirror-lint-markers"],
				lint: true,
				autoCloseBrackets: true,
				matchBrackets: true,
				highlightSelectionMatches: { showToken: /\w/ },
				viewportMargin: Infinity
			}
		));
		let script = localStorage.getItem('code') ? localStorage.getItem('code') : DEFAULT_SCRIPT;
		this.cmService.setScript(script);
	}

	canDeactivate(): Observable<boolean> {
		// kinda hacky
		const answer = this.gameService.savedScript$$.getValue() ? true : window.confirm('Leave without saving script?');
		if (answer) {
			this.gameService.savedScript$$.next(true);
		}
		return of(answer);
	};

}
