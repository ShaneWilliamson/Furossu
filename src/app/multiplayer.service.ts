import { Injectable } from '@angular/core';
import { Player } from './common/player';

interface MultiplayerGame {
  numgames: number;
  players: Player[];
}

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {
  private game: MultiplayerGame;
  private database: any;

  public start() {

  }

  public initialize() {
    // self.database.ref('/users-open-house').orderByChild('sortableHighScore').limitToFirst(8).once('value').then(function (snapshot) {
    //   self.users = snapshot.val();
    //   $.each(self.users, function (uid, user) {
    //     var multiplayerGame = new BattleshipMultiplayerUserViewModel(user, self.games().length, self.gridSize(), self.numShips());
    //     self.games.push(multiplayerGame);
    //   });
    // });

    // // Workaround for Webkit bug: force scroll height to be recomputed after the transition ends, not only when it starts
    // $('#game-boards').on("webkitTransitionEnd", function () {
    //   $(this).hide().offset();
    //   $(this).show();
    // });
    // var gameBoardsWidth = $('#game-boards').width();
    // var columns = Math.floor(gameBoardsWidth / 334);
    // function createListStyles(rulePattern, rows, cols) {
    //   var rules = [], index = 0;
    //   for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
    //     for (var colIndex = 0; colIndex < cols; colIndex++) {
    //       var x = (colIndex * 100) + "%",
    //         y = (rowIndex * 100) + "%",
    //         transforms = "{ -webkit-transform: translate3d(" + x + ", " + y + ", 0); transform: translate3d(" + x + ", " + y + ", 0); }";
    //       rules.push(rulePattern.replace("{0}", ++index) + transforms);
    //     }
    //   }
    //   var headElem = document.getElementsByTagName("head")[0],
    //     styleElem = $("<style>").attr("type", "text/css").appendTo(headElem)[0];
    //   if (styleElem.styleSheet) {
    //     styleElem.styleSheet.cssText = rules.join("\n");
    //   } else {
    //     styleElem.textContent = rules.join("\n");
    //   }
    // }

    // createListStyles("#game-boards li:nth-child({0})", 8, columns);

    // // Snapshotting utils
    // (function () {
    //   var stylesToSnapshot = ["transform", "-webkit-transform"];

    //   $.fn.snapshotStyles = function () {
    //     if (window.getComputedStyle) {
    //       $(this).each(function () {
    //         for (var i = 0; i < stylesToSnapshot.length; i++)
    //           this.style[stylesToSnapshot[i]] = getComputedStyle(this)[stylesToSnapshot[i]];
    //       });
    //     }
    //     return this;
    //   };

    //   $.fn.releaseSnapshot = function () {
    //     $(this).each(function () {
    //       this.offsetHeight; // Force position to be recomputed before transition starts
    //       for (var i = 0; i < stylesToSnapshot.length; i++)
    //         this.style[stylesToSnapshot[i]] = "";
    //     });
    //   };
    // })();
  }
}
