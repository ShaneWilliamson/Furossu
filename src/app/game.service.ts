import { Injectable } from '@angular/core';
import { Guess } from './common/guess';
import { Code } from './common/code';

export const words = [
	"koila",
	"carga",
	"linne",
	"lazes",
	"chiru",
	"iulus",
	"bugan",
	"crank",
	"relet",
	"stump",
	"jarvy",
	"cadie",
	"hosea",
	"exter",
	"codes",
	"sensu",
	"salty",
	"beice",
	"decks",
	"maize",
	"impot",
	"imago",
	"chaws",
	"rheen",
	"shave",
	"todea",
	"saros",
	"primi",
	"awake",
	"zocco",
	"kakis",
	"suine",
	"couch",
	"nache",
	"strig",
	"vocat",
	"trone",
	"carid",
	"korin",
	"clips",
	"hided",
	"lings",
	"ineye",
	"bhava",
	"arroz",
	"stare",
	"phpht",
	"boras",
	"ghees",
	"devex",
	"boras",
	"crack",
	"widen",
	"lines",
	"sutor",
	"troot",
	"quail",
	"uglis",
	"sizer",
	"styli",
	"pongo",
	"nahum",
	"laeti",
	"argid",
	"guess",
	"diose",
	"razed",
	"bumfs",
	"crypt",
	"wheal",
	"barid",
	"mogos",
	"doria",
	"murph",
	"anils",
	"alite",
	"riser",
	"mauby",
	"weird",
	"marse",
	"vined",
	"gonzo",
	"salus",
	"guise",
	"dowel",
	"saite",
	"bijou",
	"spicy",
	"gruff",
	"owlet",
	"mooed",
	"aided",
	"stime",
	"light",
	"tabus",
	"neume",
	"ostic",
	"cahot",
	"unwit",
	"gusts",
]

const CODE_COUNT = 15;
const CORRECT_GUESS_VALUE = 200;
const INCORRECT_GUESS_VALUE = -25;

@Injectable({
	providedIn: 'root'
})
export class GameService {
	private _guesses: Guess[];
	private _codes: Code[];
	private _answerIdx: number;
	private _isGameOver: boolean;

	private _score: number;

	constructor() {
		this._guesses = [];
		this._codes = [];
		this._score = 0;
		this._isGameOver = false;
	}

	private randomIdx(maxIdx: number): number {
		return Math.floor(Math.random() * (maxIdx + 1))
	}

	public getGuesses(): Guess[] {
		return this._guesses;
	}

	public getCodes(): Code[] {
		if (!!this._codes && this._codes.length !== 0) {
			return this._codes;
		}
		this._codes = [];
		var selectedCodes = {};
		for (var i = 0; i < CODE_COUNT; i++) {
			// Add another word with index random between 0 and 99
			let word = words[this.randomIdx(99)]
			if (word in selectedCodes) {
				i--;
				continue;
			}
			selectedCodes[word] = true;
			this._codes.push({ code: word, guesses: 0 });
		}
		this._answerIdx = this.randomIdx(CODE_COUNT - 1);
		return this._codes;
	}

	public submitGuess(guess: Guess): void {
		this._guesses.push(guess);
		if (this._guesses[this._answerIdx].value === guess.value) {
			this._isGameOver = true;
			this.addScore(CORRECT_GUESS_VALUE);
		} else {
			this.addScore(INCORRECT_GUESS_VALUE);
		}
	}

	private addScore(value: number): void {
		this._score += value;
	}
}
