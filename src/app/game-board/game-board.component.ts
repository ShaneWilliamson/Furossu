import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Code } from '../common/code';

@Component({
  selector: 'code-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
	public codes: Code[] = [];
	public score: number = 0;

  constructor(private gameService: GameService) { }

  ngOnInit() {
		this.codes = this.gameService.getCodes();
	}

}
