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
import { Observable, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GameService } from '../game.service';

@Component({
  selector: 'code-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements AfterViewInit {
	saved$: Observable<boolean>;

	constructor(private renderer: Renderer2, private cmService: CmService, private router: Router, private gameService: GameService) {
		(<any>window).JSHINT = require('jshint').JSHINT;
		this.saved$ = merge(
			this.cmService.isScriptChanged$.pipe(map(isChanged => !isChanged)),
			this.gameService.saved$
		).pipe(
			startWith(true)
		);
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
        highlightSelectionMatches: {showToken: /\w/},
        viewportMargin: Infinity
			}
		));
		let script = localStorage.getItem('code') ? localStorage.getItem('code') : DEFAULT_SCRIPT;
		this.cmService.setScript(script);
	}

}
