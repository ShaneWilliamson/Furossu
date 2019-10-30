import { Component } from '@angular/core';
import { MultiplayerService } from '../multiplayer.service';
import { Observable } from 'rxjs';
import { UserDoc } from '../firestore.service';

@Component({
  selector: 'code-multiplayer-page',
  templateUrl: './multiplayer-page.component.html',
  styleUrls: ['./multiplayer-page.component.scss']
})
export class MultiplayerPageComponent {
  public players$: Observable<UserDoc[]>;
  speed: number = 5;
  numGames: number = 1;

  constructor(private ms: MultiplayerService) {
    this.players$ = ms.players$;
  }
  
  start(): void {
    
  }

}
