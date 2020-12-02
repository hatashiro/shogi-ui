const $ = (query) => document.querySelector(query);

const DOM = {
  board: {
    $div: Shogi.boardDiv(),
    $container: $('#board'),
  },
  mochigoma: {
    sentei: {
      $div: Shogi.mochigomasDiv(),
      $container: $('#sentei_mochigomas'),
      $minusButtons: $('#sentei_minus_buttons'),
    },
    koutei: {
      $div: Shogi.mochigomasDiv(),
      $container: $('#koutei_mochigomas'),
      $minusButtons: $('#koutei_minus_buttons'),
    },
  },
  buttons: {
    $reset: $('#reset_button'),
  },

  appendDiv({$div, $container}) {
    $container.appendChild($div);
  },

  updateMochigoma(player) {
    Shogi.setMochigomas(
      DOM.mochigoma[player].$div,
      Model.mochigoma[player],
      {sentei: player === 'sentei'},
    );
  },
};

// Initializes board.
DOM.appendDiv(DOM.board);

// Initializes Mochigoma divs.
Utility.callForBothPlayers(player => {
  DOM.appendDiv(DOM.mochigoma[player]);
  DOM.updateMochigoma(player);
});

// Sets Mochigoma handlers.

function updateAllForMochigoma(player, type, updateFunc) {
  Model.updateMochigoma(player, type, updateFunc);
  DOM.updateMochigoma(player);
  Hash.update();
}

Utility.callForBothPlayers(player => {
  DOM.mochigoma[player].$div.addEventListener('click', e => {
    const $koma = e.target.closest('.shogi__koma');
    if (!$koma) return;

    const type = Shogi.komaType($koma);
    updateAllForMochigoma(player, type, count => count + 1);
  });

  const $minusButtons =
    DOM.mochigoma[player].$minusButtons.querySelectorAll('button');
  for (let i = 0; i < 7; i++) {
    $minusButtons[i].addEventListener('click', () => {
      const type = Model.mochigoma[player][i].type;
      updateAllForMochigoma(player, type, count => Math.max(0, count - 1));
    });
  }
});

// Reset button.
DOM.buttons.$reset.addEventListener('click', () => {
  if (!confirm('本当にクリアしますか？')) return;

  Model.resetAll();
  Utility.callForBothPlayers(DOM.updateMochigoma);
  Hash.update();
});
