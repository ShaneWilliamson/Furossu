import { Injectable } from '@angular/core';

export const DEFAULT_SCRIPT: string = "var foo = \"\";";

@Injectable({
  providedIn: 'root'
})
export class CmService {
	public editor: any;
}
