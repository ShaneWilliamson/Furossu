import { Injectable } from '@angular/core';
import { GameState } from '../common/gamestate';
import { Code } from '../common/code';

@Injectable({
	providedIn: 'root'
})
export class SandboxService {
	public self: any;
	private gameState: GameState;
	private getGuess: any;

	constructor() {
		this.getGuess = function() {};
	}

	public newGame(gameState: GameState): void {
		self;
	}

	public setScript(script: string): void {
		let priorScript = this.gameState.script;
		try {
			this.gameState.script = eval('self.getMove = ' + script + ';');
			console.log('Script has been set.');
		} catch (e) {
			this.gameState.script = priorScript;
			console.log();
		}
	}
}
