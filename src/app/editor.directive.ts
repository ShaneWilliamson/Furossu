import { Directive, Renderer2, AfterViewInit } from '@angular/core';
import { CmService, DEFAULT_SCRIPT } from './cm.service';
import * as cm from 'codemirror';
(<any>window).JSHINT = require('jshint').JSHINT;

@Directive({
  selector: '[codeEditor]'
})
export class EditorDirective implements AfterViewInit {

	constructor(private renderer: Renderer2, private cmService: CmService) { }
	
	ngAfterViewInit(): void {
		this.cmService.editor = cm.fromTextArea(
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
		);
		this.cmService.editor.setValue(DEFAULT_SCRIPT);
	}

}
