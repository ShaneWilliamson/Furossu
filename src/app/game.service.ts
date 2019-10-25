import { Injectable } from '@angular/core';
import { Guess } from './common/guess';
import { Code } from './common/code';
import { Observable, BehaviorSubject } from 'rxjs';

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
	private guesses$$: BehaviorSubject<Guess[]> = new BehaviorSubject([]);
	private guesses$: Observable<Guess[]> = this.guesses$$.asObservable();
	private codes$$: BehaviorSubject<Code[]> = new BehaviorSubject([]);
	private codes$: Observable<Code[]> = this.codes$$.asObservable();

	private answerIdx: number;
	private isGameOver: boolean;

	private score: number;

	constructor() {
		this.resetState();
		var placeholders = [];
		for(var i = 0; i < CODE_COUNT; i++) {
			placeholders.push({code: "*****", "guesses": 0});
		}
		this.codes$$.next(placeholders);
	}

	private resetState(): void {
		this.guesses$$.next([]);
		this.codes$$.next([]);
		this.score = 0;
		this.isGameOver = false;
	}

	private randomIdx(maxIdx: number): number {
		return Math.floor(Math.random() * (maxIdx + 1))
	}

	public getGuesses(): Observable<Guess[]> {
		return this.guesses$;
	}

	public getGuessesValue(): Guess[] {
		return this.guesses$$.getValue();
	}

	public getCodes(): Observable<Code[]> {
		return this.codes$;
	}

	public startGame(): void {
		this.initializeCodes();
	}

	private initializeCodes(): void {
		var codes = [];
		var selectedCodes = {};
		for (var i = 0; i < CODE_COUNT; i++) {
			// Add another word with index random between 0 and 99
			let word = words[this.randomIdx(99)];
			if (word in selectedCodes) {
				i--;
				continue;
			}
			selectedCodes[word] = true;
			codes.push({ code: word, guesses: 0 });
		}
		this.answerIdx = this.randomIdx(CODE_COUNT - 1);
		this.codes$$.next(codes);
	}

	public getScore(): number {
		return this.score;
	}

	// Submits a guess, returns true if game is over (correctly guessed) or false otherwise
	public submitGuess(guess: Guess): boolean {
		if (this.isGameOver) {
			return;
		}
		let guesses = [...this.guesses$$.getValue(), guess];
		this.guesses$$.next([...this.guesses$$.getValue(), guess]);
		if (this.codes$$.getValue()[this.answerIdx].code === guess.value) {
			this.isGameOver = true;
			this.addScore(CORRECT_GUESS_VALUE);
		} else {
			this.addScore(INCORRECT_GUESS_VALUE);
		}
		return this.isGameOver;
	}

	private addScore(value: number): void {
		this.score += value;
	}
}
