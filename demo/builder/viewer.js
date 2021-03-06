const $ = (query) => document.querySelector(query);

const DOM = {
  board: {
    $div: Shogi.boardDiv(),
    $container: $('#board'),
  },
  mochigoma: {
    sente: {
      $div: Shogi.mochigomasDiv(),
      $container: $('#sente_mochigomas'),
    },
    gote: {
      $div: Shogi.mochigomasDiv(),
      $container: $('#gote_mochigomas'),
    },
  },
  buttons: {
    $edit: $('#edit_button'),
    $urlCopy: $('#url_copy_button'),
  },
  inputs: {
    $url: $('#url_input'),
  },

  appendDiv({$div, $container}) {
    $container.appendChild($div);
  },

  loadInitialKomas() {
    for (let suji = 1; suji <= 9; suji++) {
      for (let dan = 1; dan <= 9; dan++) {
        const position = {suji, dan};
        const koma = Model.board[suji][dan];
        if (koma) {
          const $koma = Shogi.komaDiv(koma.type, {sente: koma.sente});
          Shogi.putKomaAt(DOM.board.$div, $koma, position);
        } else {
          Shogi.removeKomaAt(DOM.board.$div, position);
        }
      }
    }
  },

  updateMochigoma(player) {
    Shogi.setMochigomas(
      DOM.mochigoma[player].$div,
      Model.mochigoma[player].filter(koma => koma.count > 0),
      {sente: player === 'sente'},
    );
  },
};

// Initializes board.
DOM.appendDiv(DOM.board);
DOM.loadInitialKomas();

// Initializes Mochigoma divs.
Utility.callForBothPlayers(player => {
  DOM.appendDiv(DOM.mochigoma[player]);
  DOM.updateMochigoma(player);
});

DOM.buttons.$edit.addEventListener('click', () => {
  location.href = 'index.html' + location.hash, '_blank';
});

DOM.inputs.$url.value = decodeURI(location.href);
DOM.buttons.$urlCopy.addEventListener('click', async () => {
  DOM.inputs.$url.focus();
  DOM.inputs.$url.setSelectionRange(0, DOM.inputs.$url.value.length);
  document.execCommand("copy");
});
