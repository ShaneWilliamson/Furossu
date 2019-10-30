import { TestBed } from '@angular/core/testing';

import { MultiplayerGameService } from './multiplayer-game.service';

describe('MultiplayerGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MultiplayerGameService = TestBed.get(MultiplayerGameService);
    expect(service).toBeTruthy();
  });
});
