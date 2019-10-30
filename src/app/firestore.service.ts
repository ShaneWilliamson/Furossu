import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface User {
  email: string;
  displayName: string;
  script: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private userDataDoc: AngularFirestoreDocument<User>;
  public userData$: Observable<User>;

  constructor(private db: AngularFirestore) {
    this.userDataDoc = this.db.doc<User>('user/swilliamson@vendasta.com');
    this.userData$ = this.userDataDoc.valueChanges();
  }
}
