import { Injectable } from '@angular/core';
import { GameState } from './common/gamestate';
import { DEFAULT_SCRIPT } from './cm.service';
import { Code } from './common/code';

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
	public getGuess(): any {};

	public initializeGame(): void {
		this.getGuess = function() {};
	}

	// API
	private getCodes(): Code[] {
		return this.gameState.codes;
	}

	public setScript(script: string): void {
		let priorScript = this.gameState.script;
		try {
			this.gameState.script = script;
			eval('this.getGuess = ' + script + ';');
			console.log('Script has been set.');
		} catch (e) {
			this.gameState.script = priorScript;
			console.log();
		}
	}

	public setCodes(codes: Code[]): void {
		this.gameState.codes = codes;
	}
}
