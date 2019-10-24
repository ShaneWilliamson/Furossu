import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { words } from '../game.service';

@Component({
  selector: 'code-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
	public words: string[];

  constructor(private gameService: GameService) { }

  ngOnInit() {
		this.words = this.gameService.getCodes();
  }

}
