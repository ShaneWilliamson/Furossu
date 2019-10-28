import { Injectable } from '@angular/core';
import { GameState } from './common/gamestate';
import { DEFAULT_SCRIPT } from './cm.service';

class Sandbox{
	sandbox = function () {
		// API
		var getCodes = function (): Code[] {
			return this.gameState.codes;
		}
	}
}

@Injectable({
	providedIn: 'root'
})
export class SandboxService {
	private gameState: GameState;
	public sandbox: any;

	constructor() {
		this.gameState = new GameState();
		this.gameState.script = DEFAULT_SCRIPT;
	}

	// Will be overwritten
	public getGuess(): any { };

	public initializeGame(): void {
		this.getGuess = function () { };
		var self = this;
		this.sandbox = new Sandbox(); // todo
	}

	public setScript(script: string): void {
		let priorScript = this.gameState.script;
		try {
			debugger;
			this.gameState.script = script;
			eval('this.getGuess = ' + script + ';');
			console.log('Script has been set.');
		} catch (e) {
			this.gameState.script = priorScript;
			console.log();
		}
	}
}
