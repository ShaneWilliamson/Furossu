import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GuessResult } from './common/guessresult';
import { Code } from './common/code';
import { GameState, Game } from './common/gamestate';
import { SandboxService } from './sandbox.service';
import { FirestoreService, UserDoc } from './firestore.service';
import { words, CORRECT_GUESS_VALUE, INCORRECT_GUESS_VALUE, CODE_COUNT } from './game.service';
import { take, takeUntil, shareReplay } from 'rxjs/operators';

export class MpGameSet {
  speed: number;
  games: MpGame[];
  score$$: BehaviorSubject<number> = new BehaviorSubject(0);
  score$: Observable<number> = this.score$$.asObservable();
  guessResults$$: BehaviorSubject<GuessResult[]> = new BehaviorSubject([]);
  guessResults$: Observable<GuessResult[]> = this.guessResults$$.asObservable();
  isOver: boolean;
  shouldStartNext$$: BehaviorSubject<number> = new BehaviorSubject(0);
  shouldStartNext$: Observable<number> = this.shouldStartNext$$.asObservable().pipe(shareReplay(1));
  destroy$$ = new Subject();

  player: UserDoc;
}

export class MpGame {
  guessResults$$: BehaviorSubject<GuessResult[]> = new BehaviorSubject([]);
  guessResults$: Observable<GuessResult[]> = this.guessResults$$.asObservable();
  codes$$: BehaviorSubject<Code[]> = new BehaviorSubject([]);
  codes$: Observable<Code[]> = this.codes$$.asObservable();
  score$$: BehaviorSubject<number> = new BehaviorSubject(0);
  score$: Observable<number> = this.score$$.asObservable();
  answerIdx: number;
  isGameOver: boolean;
  gameState: GameState;
  intervalTimer: NodeJS.Timer;
  sandbox: any;

  gameSet: MpGameSet;

  public getCodes(): Observable<Code[]> {
    return this.codes$;
  }

  public getCodesValue(): Code[] {
    return this.codes$$.getValue();
  }

  public addScore(value: number): number {
    const newScore = this.score$$.getValue() + value
    this.score$$.next(newScore);
    const newTotalScore = this.gameSet.score$$.getValue() + value;
    this.gameSet.score$$.next(newTotalScore);
    return newScore;
  }

  public getLikeness(guess: string): number {
    let likeness = 0;
    let answer = this.gameState.codes[this.answerIdx].code;
    for (var i = 0; i < answer.length; i++) {
      if (guess[i] === answer[i]) {
        likeness++;
      }
    }
    return likeness;
  }

  public resetState(): void {
    this.guessResults$$.next([]);
    this.codes$$.next([]);
    this.score$$.next(0);
    this.isGameOver = true;
    this.gameState = new GameState();
  }

  public initializeCodes(): void {
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
      codes.push({ code: word, isGuessed: false, likeness: -1 });
    }
    this.answerIdx = this.randomIdx(CODE_COUNT - 1);
    this.codes$$.next(codes);
  }

  private randomIdx(maxIdx: number): number {
    return Math.floor(Math.random() * (maxIdx + 1))
  }
}

@Injectable({
  providedIn: 'root'
})
export class MultiplayerGameService {
  private games$$: BehaviorSubject<MpGameSet[]> = new BehaviorSubject([]);
  public games$: Observable<MpGameSet[]> = this.games$$.asObservable();

  constructor(private sandboxService: SandboxService, private fireService: FirestoreService) { }

  private gameLoop(game: MpGame): void {
    if (!game.isGameOver) {
      var gameState = this.backupGameState(game.gameState);
      try {  // Wrapped in try-catch since getGuess is user code
        var guess = game.sandbox.runner.getGuess();
      } finally {
        this.restoreGameState(game, gameState);
      }

      let newCodes = this.doGuess(game, guess);
      if (game.isGameOver) {
        clearInterval(game.intervalTimer);
      }
      game.gameState.codes = newCodes;
    }
  }

  private doGuess(game: MpGame, guess: string): Code[] {
    if (game.isGameOver) {
      return;
    }
    let codes = game.getCodesValue();
    let answerCode = codes[game.answerIdx];
    if (answerCode.code === guess) {
      game.isGameOver = true;
      answerCode.isGuessed = true;
      const finalScore = game.gameSet.score$$.getValue() + CORRECT_GUESS_VALUE;
      const newScore = game.addScore(CORRECT_GUESS_VALUE);
      game.guessResults$$.next([...game.guessResults$$.getValue(), { guess: guess, score: newScore, isAnswer: true }]);
      game.gameSet.guessResults$$.next([...game.gameSet.guessResults$$.getValue(), { guess: guess, score: newScore, isAnswer: true }]);
      game.gameSet.shouldStartNext$$.next(game.gameSet.shouldStartNext$$.getValue() + 1);
      this.fireService.putLeader(game.gameSet.player, finalScore);
      return;
    } else {
      const newScore = game.addScore(INCORRECT_GUESS_VALUE);
      game.guessResults$$.next([...game.guessResults$$.getValue(), { guess: guess, score: newScore, isAnswer: false }]);
      game.gameSet.guessResults$$.next([...game.gameSet.guessResults$$.getValue(), { guess: guess, score: newScore, isAnswer: false }]);
    }
    for (var i = 0; i < game.gameState.codes.length; i++) {
      if (guess === codes[i].code) {
        if (codes[i].isGuessed) {
          console.log("INVALID GUESS! Already guessed: " + guess);
          game.isGameOver = true;
          return codes;
        }
        codes[i].isGuessed = true;
        codes[i].likeness = game.getLikeness(guess);
        return codes;
      }
    }
    console.log("INVALID GUESS! Code not found");
    game.isGameOver = true;
    game.gameSet.isOver = true;
    let finalScore = game.gameSet.score$$.getValue() + INCORRECT_GUESS_VALUE * CODE_COUNT;
    game.addScore(INCORRECT_GUESS_VALUE * CODE_COUNT);
    game.gameSet.destroy$$.next();
    this.fireService.putLeader(game.gameSet.player, finalScore);
    return codes;
  }

  private setIntervalTimer(game: MpGame): void {
    var self = this;
    if (game.intervalTimer) {
      clearInterval(game.intervalTimer);
      game.intervalTimer = undefined;
    }
    game.intervalTimer = setInterval(this.gameLoop.bind(self, game), 1000 / game.gameSet.speed);
  }

  // -- the big one --

  public startAllSets(speed: number, numGames: number): void {
    this.fireService.getPlayers().pipe(
      take(1)
    ).subscribe(players => {
      let sets = [];
      players.forEach((player) => {
        if (!player || !player.script) {
          return;
        }
        let gameSet = new MpGameSet();
        gameSet.player = player;
        gameSet.isOver = false;
        gameSet.speed = speed;
        gameSet.games = [];
        // create the games for the set
        for (let i = 0; i < numGames; i++) {
          let g = new MpGame();
          g.isGameOver = true; // games start true...
          g.gameState = new GameState();
          g.gameState.script = player.script;
          g.gameSet = gameSet;
          gameSet.games.push(g);
        };
        sets.push(gameSet);
      });
      this.games$$.next(sets);
      sets.forEach(set => {
        this.startSet(set);
      });
    });
  }

  // -- hoooooo boy --

  public startSet(set: MpGameSet): void {
    if (!set.player || !set.player.script) {
      set.isOver = true;
      set.score$$.next(-10000);
      return;
    }
    var self = this;
    set.shouldStartNext$.pipe(
      takeUntil(set.destroy$$)
    ).subscribe(idx => {
      if (idx >= set.games.length) {
        return;
      }
      self.start(set.games[idx]);
    });
    set.shouldStartNext$$.next(0);
    set.destroy$$.asObservable().subscribe(_ => {
      set.isOver = true;
    });
  }

  public start(game: MpGame): void {
    if (game.isGameOver) {
      game.resetState();
      game.initializeCodes();
      game.gameState.codes = game.getCodesValue();
      game.gameState.script = game.gameSet.player.script;
      game.sandbox = this.sandboxService.initializeGame(game.gameState);
      game.sandbox.runner.setScript(game.gameState.script);
      game.isGameOver = false;
      this.setIntervalTimer(game);
    }
  };

  private backupGameState(gs: GameState): GameState {
    return Object.freeze(gs);
  }

  private restoreGameState(game: MpGame, gameState: GameState): void {
    game.gameState = new GameState();
    game.gameState.codes = gameState.codes;
    game.gameState.script = gameState.script;
  }

}
