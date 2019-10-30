import { Injectable } from '@angular/core';
import { GameState } from './common/gamestate';
import { DEFAULT_SCRIPT } from './cm.service';

export class Sandbox {
	runner: any;
}

function SandboxRunner(gameState: GameState) {
	this.codes = gameState.codes;
	this.script = gameState.script;

	this.getGuess = function () { };
	this.setScript = function (script) {
		let priorScript = this.script;
		try {
			this.script = script;
			eval('this.getGuess = ' + script + ';');
			console.log('Script has been set.');
		} catch (e) {
			this.script = priorScript;
			console.log();
		}
	};
	this.getCodes = function() {
		return this.codes;
	};
}

@Injectable({
	providedIn: 'root'
})
export class SandboxService {
	private gameState: GameState;

	constructor() {
		this.gameState = new GameState();
		this.gameState.script = DEFAULT_SCRIPT;
	}

	public initializeGame(gameState: GameState): Sandbox {
		var gs = Object.freeze(gameState);
		let sb = new Sandbox();
		sb.runner = new SandboxRunner(gs);
		return sb;
	}
}
