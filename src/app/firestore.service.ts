import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { take, filter, map, switchMap } from 'rxjs/operators';

export interface UserDoc {
  email: string;
  displayName: string;
  script: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private userDataDoc$: Observable<AngularFirestoreDocument<UserDoc>>;
  public userData$: Observable<UserDoc>;
  private user$: Observable<User | null>;
  private hasUser: boolean;

  constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.user;
    this.user$.subscribe(user => {
      this.hasUser = !!user;
    });
    this.userDataDoc$ = this.user$.pipe(
      filter(user => !!user),
      map(user => {
        // this.db.firestore.collection('user').doc(user.uid)
        //   .get()
        //   .then(snapshot => {
        //     if (!snapshot.data()) {
        //       this.db.firestore.collection('user').doc(user.uid).set({
        //         email: user.email, displayName: user.displayName, script: ''
        //       });
        //     };
        //   });
        return this.db.doc<UserDoc>(`user/${user.uid}`);
      })
    );
    this.userData$ = this.userDataDoc$.pipe(
      filter(doc => !!doc),
      switchMap(doc => {
        console.log('Loaded data from db');
        return doc.valueChanges();
      })
    );
  }

  updateScript(script: string): void {
    if (!this.hasUser) {
      return;
    }
    // a bit of a race but w/e
    combineLatest([this.userDataDoc$, this.user$]).pipe(
      take(1),
      filter(([doc, _]: [AngularFirestoreDocument<UserDoc>, User]) => !!doc),
    ).subscribe(([doc, user]: [AngularFirestoreDocument<UserDoc>, User]) => {
      console.log('Set script on document data');
      doc.set({
        email: user.email,
        displayName: user.displayName,
        script: script
      });
    });
  }
}
