import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { words } from '../common/guess';

@Component({
  selector: 'code-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
	public words: string[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
		for(var i = 0; i < 100; i++) {
			const idx = Math.floor(Math.random() * (370102 + 1));
			const word = words[idx];
			if(word.length !== 5) {
				i--;
			} else {
				this.words.push(word);
			}
		}
  }

}
