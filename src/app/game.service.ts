import { Injectable } from '@angular/core';
import { Guess } from './common/guess';

@Injectable({
  providedIn: 'root'
})
export class GameService {
	private _guesses: Guess[];
	private _codes: string[];
	private _answerIdx: number;

	constructor() {
		this._guesses = [];
		// TODO: Generate random codes for our list of possible codes
		this._codes = [];
	}
	
	public getGuesses(): Guess[] {
		return this._guesses;
	}
}
