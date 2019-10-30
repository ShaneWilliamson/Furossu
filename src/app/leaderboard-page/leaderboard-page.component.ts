import { Component, OnInit } from '@angular/core';
import { FirestoreService, Leader } from '../firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'code-leaderboard-page',
  templateUrl: './leaderboard-page.component.html',
  styleUrls: ['./leaderboard-page.component.scss']
})
export class LeaderboardPageComponent implements OnInit {

  displayedColumns: string[] = ['score', 'displayName'];
  dataSource: Observable<Leader[]>;
  constructor(private fs: FirestoreService) { }

  ngOnInit() {
    this.dataSource = this.fs.getLeaders();
  }

}
