import { Injectable } from '@angular/core';
import { Guess } from './common/guess';
import { Code } from './common/code';
import { Observable, BehaviorSubject } from 'rxjs';
import { SandboxService } from './sandbox/sandbox.service';
import { GameState } from './common/gamestate';

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
	private gameState: GameState;
	private score: number;
	private speed: number = 10;

	private intervalTimer: NodeJS.Timer;

	// user code
	private getGuess: any;

	constructor(private sandboxService: SandboxService) {
		this.resetState();
		var placeholders = [];
		for (var i = 0; i < CODE_COUNT; i++) {
			placeholders.push({ code: "*****", "guesses": 0 });
		}
		this.codes$$.next(placeholders);
	}

	private gameLoop(): void {
		if (!this.isGameOver) {
			var gameState = this.backupGameState();
			try {  // Wrapped in try-catch since getMove is user code
				var move = this.getGuess();
			} finally {
				this.restoreGameState(gameState);
			}

			var result = this.doMove(move);
			if (this.isGameOver) {  // so hacky
				clearInterval(this.intervalTimer);
				self.updateHighScore(self.game.score());
			}
		}
	}

	private doMove(guess: string): void {
		try {
			console.log("Guess: " + guess);
		} catch (e) {
			console.error(e);
			this.isGameOver = true;
		}
		let codes = this.getCodesValue();
		let answerCode = codes[this.answerIdx];
		if (guess === answerCode.code) {
			console.log("Correct guess!");
			this.isGameOver = true;
			answerCode.guesses += 1;
			return;
		}
		for (var i = 0; i < this.gameState.codes.length; i++) {
			if (guess === codes[i].code) {
				codes[i].guesses += 1;
			}
		}
	};

	private setIntervalTimer(timer: NodeJS.Timer): void {
		if (this.intervalTimer) {
			clearInterval(this.intervalTimer);
			this.intervalTimer = undefined;
		}
		this.intervalTimer = setInterval(this.gameLoop, 1000 / this.speed);
	}

	private start(): void {
		if(this.isGameOver && this.gameState.script) {
			this.drawGrid();
			this.sandbox = new BattleshipGameSandbox({
					getBoardWidth: function() { return this.boardWidth; },
					getBoardHeight: function() { return this.boardHeight; },
					getMoves: function() { return this.moves() },
					getBoard: this.getBoard,
					getShips: this.getShips
			});
			this.setGetMoveFunction(this.code);
				this.over(false);
				this.setIntervalTimer();
		}
};

	private backupGameState(): GameState {
		var gameState = this.gameState;
		return Object.freeze(gameState);
	}

	private restoreGameState(gameState: GameState): void {
		this.gameState.codes = gameState.codes;
		this.gameState.script = gameState.script;
		this.gameState.self = gameState.self;
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

	public getCodesValue(): Code[] {
		return this.codes$$.getValue();
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
