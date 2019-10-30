import { Code } from './code';
import { UserDoc } from '../firestore.service';

export class GameState {
	codes: Code[];
	script: any;
}

export interface Game {
	player: UserDoc;
	score: number;
	isOver: boolean;
	gameState: GameState;
	sandbox: any;
}
