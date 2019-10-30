import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../game.service';
import { Code } from '../common/code';
import { Observable } from 'rxjs';
import { GuessResult } from '../common/guessresult';

@Component({
	selector: 'code-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
	public guessResults$: Observable<GuessResult[]>;
	public codes$: Observable<Code[]>;
	public score$: Observable<number>;
	@Input() isSinglePlayer: boolean = true;

	constructor(private gameService: GameService) {
		this.score$ = this.gameService.score$;
		this.guessResults$ = this.gameService.guessResults$;
	}

	ngOnInit(): void {
		this.codes$ = this.gameService.getCodes();
	}

	start(): void {
		this.gameService.startSinglePlayerGame();
	}

	setScript(): void {
		this.gameService.setScript();
	}

}
