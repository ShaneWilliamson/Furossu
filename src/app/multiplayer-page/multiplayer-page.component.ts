import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from '../multiplayer.service';
import { Observable } from 'rxjs';
import { UserDoc } from '../firestore.service';

@Component({
  selector: 'code-multiplayer-page',
  templateUrl: './multiplayer-page.component.html',
  styleUrls: ['./multiplayer-page.component.scss']
})
export class MultiplayerPageComponent implements OnInit {
  public players$: Observable<UserDoc[]>;

  constructor(private ms: MultiplayerService) {
    this.players$ = ms.players$;
  }

  ngOnInit() {
  }

}
