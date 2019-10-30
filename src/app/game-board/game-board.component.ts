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
export class GameBoardComponent {
	@Input('results') public guessResults$: Observable<GuessResult[]>;
	@Input('score') public score: number;
	@Input() isSinglePlayer: boolean = true;

	constructor(private gameService: GameService) {
	}

	start(): void {
		this.gameService.startSinglePlayerGame();
	}

	setScript(): void {
		this.gameService.setScript();
	}

}
