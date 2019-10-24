import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { words } from '../game.service';

@Component({
  selector: 'code-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
	public words: string[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
		for(var i = 0; i < 10; i++) {
			// Add another word with index random between 0 and 99
			this.words.push(words[Math.floor(Math.random() * (99 + 1))]);
		}
  }

}
