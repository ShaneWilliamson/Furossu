import { Directive, Renderer2, AfterViewInit } from '@angular/core';
var cm = require('codemirror');

@Directive({
  selector: '[codeEditor]'
})
export class EditorDirective implements AfterViewInit {

	constructor(private renderer: Renderer2) { }
	
	ngAfterViewInit(): void {
		cm.fromTextArea(
			this.renderer.selectRootElement('[codeEditor]'),
			{
				lineNumbers: true,
				mode: {
					name: "javascript"
				}
			}
		);
	}

}
