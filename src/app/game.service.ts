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

const CODE_COUNT = 10;

@Injectable({
	providedIn: 'root'
})
export class GameService {
	private _guesses: Guess[];
	private _codes: Code[];
	private _answerIdx: number;

	constructor() {
		this._guesses = [];
		this._codes = [];
	}

	public getGuesses(): Guess[] {
		return this._guesses;
	}

	private randomIdx(maxIdx: number): number {
		return Math.floor(Math.random() * (maxIdx + 1))
	}

	public getCodes(): Code[] {
		if (!!this._codes && this._codes.length !== 0) {
			return this._codes;
		}
		this._codes = [];
		for (var i = 0; i < CODE_COUNT; i++) {
			// Add another word with index random between 0 and 99
			this._codes.push({code: words[this.randomIdx(99)], guesses: 0});
		}
		this._answerIdx = this.randomIdx(CODE_COUNT - 1);
		return this._codes;
	}
}
