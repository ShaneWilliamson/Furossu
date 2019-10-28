import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export const DEFAULT_SCRIPT: string = `function myfunc() {
  if (this.idx === undefined) {
    this.idx = 0;
  }
  var guess = this.getCodes()[this.idx];
  this.idx++;
  return guess.code;
}`;

@Injectable({
  providedIn: 'root'
})
export class CmService {
	private editor$$: BehaviorSubject<any> = new BehaviorSubject(null);
	public editor$: Observable<any> = this.editor$$.asObservable();

	public setCM(cm: any): void {
		this.editor$$.next(cm);
	}

	public setScript(script: string): void {
		this.editor$$.getValue().setValue(script);
	}

	public getScript(): string {
		// first getvalue for obs, 2nd for cm
		return this.editor$$.getValue().getValue();
	}
}
