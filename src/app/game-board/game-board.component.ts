import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Code } from '../common/code';
import { Observable } from 'rxjs';
import { CmService } from '../cm.service';

@Component({
  selector: 'code-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
	public codes$: Observable<Code[]>;
	public score$: Observable<number>;

  constructor(private gameService: GameService) {
		this.score$ = this.gameService.score$;
	}

  ngOnInit(): void {
		this.codes$ = this.gameService.getCodes();
	}

	start(): void {
		this.gameService.start();
	}

}
