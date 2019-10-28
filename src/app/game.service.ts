import { Injectable } from '@angular/core';
import { Code } from './common/code';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { SandboxService } from './sandbox.service';
import { GameState } from './common/gamestate';
import { CmService } from './cm.service';
import { GuessResult } from './common/guessresult';

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
	private guessResults$$: BehaviorSubject<GuessResult[]> = new BehaviorSubject([]);
	public guessResults$: Observable<GuessResult[]> = this.guessResults$$.asObservable();
	private codes$$: BehaviorSubject<Code[]> = new BehaviorSubject([]);
	private codes$: Observable<Code[]> = this.codes$$.asObservable();
	private score$$: BehaviorSubject<number> = new BehaviorSubject(0);
	public score$: Observable<number> = this.score$$.asObservable();

	private saved$$: ReplaySubject<boolean> = new ReplaySubject(1);
	public saved$: Observable<boolean> = this.saved$$.asObservable();

	private answerIdx: number;
	private isGameOver: boolean;
	private gameState: GameState;
	private speed: number = 10;

	private intervalTimer: NodeJS.Timer;

	// user code

	constructor(private cmService: CmService, private sandboxService: SandboxService) {
		this.resetState();
		var placeholders = [];
		for (var i = 0; i < CODE_COUNT; i++) {
			placeholders.push({ code: "*****", "Is Guessed?": false });
		}
		this.codes$$.next(placeholders);
	}

	private gameLoop(): void {
		if (!this.isGameOver) {
			var gameState = this.backupGameState();
			try {  // Wrapped in try-catch since getGuess is user code
				var guess = this.sandboxService.sandbox.getGuess();
			} finally {
				this.restoreGameState(gameState);
			}

			this.doGuess(guess);
			if (this.isGameOver) {
				clearInterval(this.intervalTimer);
			}
		}
	}

	private doGuess(guess: string): void {
		if (this.isGameOver) {
			return;
		}
		let codes = this.getCodesValue();
		let answerCode = codes[this.answerIdx];
		if (answerCode.code === guess) {
			console.log("Correct guess!");
			this.isGameOver = true;
			answerCode.isGuessed = true;
			const newScore = this.addScore(CORRECT_GUESS_VALUE);
			this.guessResults$$.next([...this.guessResults$$.getValue(), {guess: guess, score: newScore, isAnswer: true}]);
			return;
		} else {
			const newScore = this.addScore(INCORRECT_GUESS_VALUE);
			this.guessResults$$.next([...this.guessResults$$.getValue(), {guess: guess, score: newScore, isAnswer: false}]);
		}
		for (var i = 0; i < this.gameState.codes.length; i++) {
			if (guess === codes[i].code) {
				if (codes[i].isGuessed) {
					console.log("INVALID GUESS! Already guessed: " + guess);
					this.isGameOver = true;
					return;
				}
				codes[i].isGuessed = true;
				return;
			}
		}
		console.log("INVALID GUESS! Code not found");
		this.isGameOver = true;
		return;
	}

	private setIntervalTimer(): void {
		var self = this;
		if (this.intervalTimer) {
			clearInterval(this.intervalTimer);
			this.intervalTimer = undefined;
		}
		this.intervalTimer = setInterval(this.gameLoop.bind(self), 1000 / this.speed);
	}

	public start(): void {
		var script = this.cmService.getScript();
		if (this.isGameOver && script) {
			this.resetState();
			this.initializeCodes();
			this.gameState.script = script;
			this.gameState.codes = this.getCodesValue();
			this.sandboxService.initializeGame(this.gameState);
			this.sandboxService.sandbox.setScript(this.gameState.script);
			this.isGameOver = false;
			this.setIntervalTimer();
		}
	};

	public setScript(): void {
		localStorage.setItem('code', this.cmService.getScript());
		this.saved$$.next(true);
	}

	private backupGameState(): GameState {
		var gameState = this.gameState;
		return Object.freeze(gameState);
	}

	private restoreGameState(gameState: GameState): void {
		this.gameState = new GameState();
		this.gameState.codes = gameState.codes;
		this.gameState.script = gameState.script;
	}

	private resetState(): void {
		this.guessResults$$.next([]);
		this.codes$$.next([]);
		this.score$$.next(0);
		this.isGameOver = true;
		this.gameState = new GameState();
	}

	private randomIdx(maxIdx: number): number {
		return Math.floor(Math.random() * (maxIdx + 1))
	}

	public getCodes(): Observable<Code[]> {
		return this.codes$;
	}

	public getCodesValue(): Code[] {
		return this.codes$$.getValue();
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
			codes.push({ code: word, isGuessed: false });
		}
		this.answerIdx = this.randomIdx(CODE_COUNT - 1);
		this.codes$$.next(codes);
	}

	private addScore(value: number): number {
		const newScore = this.score$$.getValue() + value
		this.score$$.next(newScore);
		return newScore;
	}
}
