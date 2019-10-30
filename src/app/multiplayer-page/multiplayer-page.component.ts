import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MultiplayerGameService, MpGameSet } from '../multiplayer-game.service';

@Component({
  selector: 'code-multiplayer-page',
  templateUrl: './multiplayer-page.component.html',
  styleUrls: ['./multiplayer-page.component.scss']
})
export class MultiplayerPageComponent {
  public games$: Observable<MpGameSet[]>;
  
  speed: number = 5;
  numGames: number = 1;

  constructor(private ms: MultiplayerGameService) {
    this.games$ = this.ms.games$;
    this.games$.subscribe(game => {
      game[0].score$.subscribe(res => {
        debugger;
      });
    });
  }
  
  start(): void {
    this.ms.startAllSets(this.speed, this.numGames);
  }

}
