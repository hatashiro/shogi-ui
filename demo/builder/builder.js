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
      $minusButtons: $('#sente_minus_buttons'),
    },
    gote: {
      $div: Shogi.mochigomasDiv(),
      $container: $('#gote_mochigomas'),
      $minusButtons: $('#gote_minus_buttons'),
    },
  },
  buttons: {
    $reset: $('#reset_button'),
    $viewer: $('#viewer_button'),
  },
  overlay: {
    $overlay: $('#overlay'),
    $scrim: $('#overlay .scrim'),
    $modal: $('#overlay .modal'),
    $control: $('#overlay .modal__control'),
    control: {
      radio: {
        $sente: $('#radio_sente'),
        $gote: $('#radio_gote'),
      },
      $nari: $('#checkbox_nari'),
      $removeKoma: $('#remove_koma'),
    },
    $modalKomas: $('#overlay .modal__komas'),
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
      Model.mochigoma[player],
      {sente: player === 'sente'},
    );
  },

  showOverlay({nearBottom}) {
    DOM.overlay.$overlay.classList.add('overlay--show');
    if (nearBottom) {
      DOM.overlay.$modal.classList.add('modal--near_bottom');
    } else {
      DOM.overlay.$modal.classList.remove('modal--near_bottom');
    }
  },

  hideOverlay() {
    DOM.clearCellSelection();
    DOM.overlay.$overlay.classList.remove('overlay--show');
  },

  updateOverlayKomas() {
    // Clear existing komas.
    DOM.overlay.$modalKomas.innerHTML = '';

    const sente = DOM.overlay.control.radio.$sente.checked;
    const nari = DOM.overlay.control.$nari.checked;

    const komas = nari ?
      ['王', '龍', '馬', '金', '全', '圭', '杏', 'と'] :
      ['王', '飛', '角', '金', '銀', '桂', '香', '歩'];
    if (!sente) komas.splice(0, 1, '玉');

    for (const type of komas) {
      const $koma = Shogi.komaDiv(type, {sente});
      $koma.addEventListener('click', () => {
        DOM.putKomaAtCurrentPosition(type, {sente});
        DOM.hideOverlay();
      });
      DOM.overlay.$modalKomas.appendChild($koma);
    }
  },

  selectCell($cell) {
    DOM.clearCellSelection();
    Shogi.highlightCell($cell);
    Model.selectedPosition = Shogi.cellPosition($cell);
  },

  clearCellSelection() {
    if (!Model.selectedPosition) return;
    Shogi.unhighlightCellAt(DOM.board.$div, Model.selectedPosition);
    Model.selectedPosition = null;
  },

  putKomaAtCurrentPosition(type, {sente}) {
    if (!Model.selectedPosition) return;

    $newKoma = Shogi.komaDiv(type, {sente});
    Shogi.putKomaAt(DOM.board.$div, $newKoma, Model.selectedPosition);
    Model.addKomaAt(type, {sente}, Model.selectedPosition);
    Hash.update();
  },

  removeKomaAtCurrentPosition() {
    if (!Model.selectedPosition) return;

    Shogi.removeKomaAt(DOM.board.$div, Model.selectedPosition);
    Model.removeKomaAt(Model.selectedPosition);
    Hash.update();
  },
};

// Initializes board.
DOM.appendDiv(DOM.board);
DOM.board.$div.querySelectorAll('.shogi__cell').forEach($cell => {
  $cell.addEventListener('click', e => {
    DOM.selectCell($cell);

    const totalHeight = document.documentElement.clientHeight;
    const nearBottom = (e.clientY / totalHeight) < 0.5;
    DOM.showOverlay({nearBottom});
  });
});
DOM.loadInitialKomas();

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
  DOM.loadInitialKomas();
  Utility.callForBothPlayers(DOM.updateMochigoma);
  Hash.update();
});

// Init overlay.
DOM.overlay.$scrim.addEventListener('click', DOM.hideOverlay);
DOM.updateOverlayKomas();
DOM.overlay.$control.addEventListener('change', DOM.updateOverlayKomas);
DOM.overlay.control.$removeKoma.addEventListener('click', () => {
  DOM.removeKomaAtCurrentPosition();
  DOM.hideOverlay();
});

// Viewer.
DOM.buttons.$viewer.addEventListener('click', () => {
  location.href = 'viewer.html' + location.hash;
});
