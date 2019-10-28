import { Injectable } from '@angular/core';
import { GameState } from './common/gamestate';
import { DEFAULT_SCRIPT } from './cm.service';
import { Observable } from 'rxjs';

// class Sandbox{
// 	sandbox = function () {
// 		// API
// 		var getCodes = function (): Code[] {
// 			return this.gameState.codes;
// 		}
// 	}
// }

function Sandbox(gameState: GameState) {
	this.codes = gameState.codes;
	this.script = gameState.script;

	this.getGuess = function () { };
	this.setScript = function (script) {
		let priorScript = this.script;
		try {
			debugger;
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
	public sandbox: any;

	constructor() {
		this.gameState = new GameState();
		this.gameState.script = DEFAULT_SCRIPT;
	}

	public initializeGame(gameState: GameState): void {
		var gs = Object.freeze(gameState);
		this.sandbox = new Sandbox(gs); // todo
	}
}
