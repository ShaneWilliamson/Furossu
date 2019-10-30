import { Injectable } from '@angular/core';
import { Player } from './common/player';
import { FirestoreService, UserDoc } from './firestore.service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

interface MultiplayerGame {
  numgames: number;
  players: Player[];
}

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {
  private game: MultiplayerGame;
  private playersSnapshot: UserDoc[];
  public players$: Observable<UserDoc[]>;

  constructor(private fs: FirestoreService) {
    this.players$ = this.fs.getPlayers();
    this.players$.subscribe(players => {
      console.log(players);
      this.playersSnapshot = players;
    });
  }

  public start() {
    this.game = {numgames: 10, players: this.playersSnapshot};
  }

  public initialize() {
    // try to load all scripts if logged in
    
    // catch if can't/forbidden, display message saying so

    // 
  }

}
