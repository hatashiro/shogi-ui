(function (window) {

/**
 * @public
 * @const {Array<string>}
 */
const komaTypes = [
  '王', '金', '銀', '桂', '香', '角', '飛', '歩',
  '玉',       '全', '圭', '杏', '馬', '龍', 'と',
];

/** @enum {string} */
const classes = {
  board: 'shogi__board',
  sujiTextRow: 'shogi__suji_text_row',
  sujiText: 'shogi__suji_text',
  danText: 'shogi__dan_text',
  danRow: 'shogi__dan_row',
  boardDot: 'shogi__board__dot',
  cell: 'shogi__cell',
  cellHighlighted: 'shogi__cell--highlighted',
  koma: 'shogi__koma',
  komaSelected: 'shogi__koma--selected',
  mochigomas: 'shogi__mochigomas',
  mochigomasKoutei: 'shogi__mochigomas--koutei',
  mochigoma: 'shogi__mochigoma',
  mochigomaKoma: 'shogi__mochigoma__koma',
  mochigomaCount: 'shogi__mochigoma__count',
};

/**
 * @typedef {Array<!Object<string, string>>}
 *
 * The Array type is actually a binary tuple, the first element of which is for
 * Sentei and the other is for Koutei.
 */
var PlayerDependentAttributes;

/** @enum {number} */
const player = {
  sentei: 0,
  koutei: 1,
};

/**
 * @param {!Object<string, (string|!Array<string>)>} attributes
 * @return {!PlayerDependentAttributes}
 */
function playerDependentAttributes(attributes) {
  const sentei = {};
  const koutei = {};
  for (const key in attributes) {
    const value = attributes[key];
    if (Array.isArray(value)) {
      sentei[key] = value[player.sentei];
      koutei[key] = value[player.koutei];
    } else {
      sentei[key] = value;
      koutei[key] = value;
    }
  }
  return [sentei, koutei];
}

/**
 * @const {{
 *   root: !PlayerDependentAttributes,
 *   koma: !PlayerDependentAttributes,
 *   komaSide: !PlayerDependentAttributes,
 *   komaType: !PlayerDependentAttributes,
 * }}
 */
const svg = {
  root: playerDependentAttributes({
    'class': classes.koma,
    'viewBox': '0 0 250 250',
  }),

  koma: playerDependentAttributes({
    'points': [
      '125,0 195,30 235,238 15,238 55,30',
      '125,238 195,208 235,0 15,0 55,208',
    ],
    'fill': 'rgb(221,190,138)',
  }),

  komaSide: playerDependentAttributes({
    'points': [
      '15,238 235,238 232,250 18,250',
      '125,238 195,208 192,220 125,250 58,220 55,208',
    ],
    'fill': 'rgb(133,111,83)',
  }),

  komaType: playerDependentAttributes({
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    'font-size': '120px',
    'x': '125',
    'y': ['145', '93'],
    'transform': ['', 'rotate(180,125,93)'],
  }),
};

/**
 * @public
 * @typedef {{sentei: boolean}}
 */
var SenteiOption;

/**
 * @public
 * @param {string} type
 * @param {SenteiOption} options
 * @return {!Element}
 */
function komaSVG(type, options) {
  const playerIndex = options['sentei'] ? player.sentei : player.koutei;

  const $svg = $('svg', svg.root[playerIndex]);

  const $koma = $('polygon', svg.koma[playerIndex]);
  const $komaSide = $('polygon', svg.komaSide[playerIndex]);
  const $komaType = $('text', svg.komaType[playerIndex]);
  $komaType.textContent = type;

  $svg.appendChild($koma);
  $svg.appendChild($komaSide);
  $svg.appendChild($komaType);

  return $svg;
}

/**
 * @public
 * @return {!Element}
 */
function boardDiv() {
  const $board = $('div', {'class': classes.board});

  const $sujiTextRow = $('div', {'class': classes.sujiTextRow});
  for (let suji = 9; suji >= 1; suji--) {
    const $sujiText = $('div', {'class': classes.sujiText});
    $sujiText.textContent = suji;
    $sujiTextRow.appendChild($sujiText);
  }
  $sujiTextRow.appendChild($('div', {'class': classes.danText}));
  $board.appendChild($sujiTextRow);

  for (let dan = 1; dan <= 9; dan++) {
    const $danRow = $('div', {'class': classes.danRow});

    for (let suji = 9; suji >= 1; suji--) {
      if ((suji == 3 || suji == 6) && (dan == 3 || dan == 6)) {
        const $dot = $('div', {'class': classes.boardDot});
        $danRow.appendChild($dot);
      }

      const $cell = $('div', {'class': classes.cell});
      $danRow.appendChild($cell);
    }

    const $danText = $('div', {'class': classes.danText});
    const $danTextSpan = $('span');
    $danTextSpan.textContent = kanjiFromNumber(dan);
    $danText.appendChild($danTextSpan);
    $danRow.appendChild($danText);

    $board.appendChild($danRow);
  }

  return $board;
}

/**
 * @public
 * @return {!Element}
 */
function mochigomasDiv() {
  const $mochigomas = $('div', {'class': classes.mochigomas});
  for (let i = 0; i < 7; i++) {
    const $mochigoma = $('div', {'class': classes.mochigoma});
    $mochigoma.appendChild($('div', {'class': classes.mochigomaKoma}));
    $mochigoma.appendChild($('div', {'class': classes.mochigomaCount}));
    $mochigomas.appendChild($mochigoma);
  }
  return $mochigomas;
}

/**
 * @public
 * @typedef {{suji: number, dan: number}}
 */
var Position;

/**
 * @public
 * @param {!Element} $board
 * @param {!Position} position
 * @return {!Element}
 */
function cellAt($board, position) {
  const sujiIdx = 9 - position['suji'];
  const danRowIdx = position['dan'] - 1;

  const $danRow = queryClassAll($board, classes.danRow)[danRowIdx];
  return queryClassAll($danRow, classes.cell)[sujiIdx];
}

/**
 * @public
 * @param {!Element} $board
 * @param {!Position} position
 */
function highlightCellAt($board, position) {
  const $cell = cellAt($board, position);
  $cell.classList.add(classes.cellHighlighted);
}

/**
 * @public
 * @param {!Element} $board
 * @param {!Position} position
 */
function unhighlightCellAt($board, position) {
  const $cell = cellAt($board, position);
  $cell.classList.remove(classes.cellHighlighted);
}

/**
 * @public
 * @param {!Element} $cell
 * @return {boolean}
 */
function cellHighlighted($cell) {
  return $cell.classList.contains(classes.cellHighlighted);
}

/**
 * @public
 * @param {!Element} $board
 * @param {!Position} position
 * @return {boolean}
 */
function cellHighlightedAt($board, position) {
  return cellHighlighted(cellAt($board, position));
}

/**
 * @public
 * @param {!Element} $board
 * @param {!Position} position
 * @return {Element}
 */
function komaAt($board, position) {
  return komaIn(cellAt($board, position));
}

/**
 * @public
 * @param {!Element} $cell
 * @return {?Element}
 */
function komaIn($cell) {
  const $koma = queryClass($cell, classes.koma);
  return $koma || null;
}

/**
 * @public
 * @param {!Element} $koma
 */
function selectKoma($koma) {
  $koma.classList.add(classes.komaSelected);
}

/**
 * @public
 * @param {!Element} $koma
 */
function unselectKoma($koma) {
  $koma.classList.remove(classes.komaSelected);
}

/**
 * @public
 * @param {!Element} $koma
 * @return {boolean}
 */
function komaSelected($koma) {
  return $koma.classList.contains(classes.komaSelected);
}

/**
 * @public
 * @param {!Element} $board
 * @param {!Element} $koma
 * @param {!Position} position
 */
function putKomaAt($board, $koma, position) {
  removeKomaAt($board, position);
  const $cell = cellAt($board, position);
  $cell.appendChild($koma);
}

/**
 * @public
 * @param {!Element} $board
 * @param {!Position} position
 */
function removeKomaAt($board, position) {
  const $cell = cellAt($board, position);
  const $existingKoma = komaIn($cell);
  if ($existingKoma) {
    $cell.removeChild($existingKoma);
  }
}

/**
 * @public
 * @param {!Element} $board
 * @param {!Position} position
 */
function selectKomaAt($board, position) {
  const $koma = komaAt($board, position);
  $koma && selectKoma($koma);
}

/**
 * @public
 * @param {!Element} $board
 * @param {!Position} position
 */
function unselectKomaAt($board, position) {
  const $koma = komaAt($board, position);
  $koma && unselectKoma($koma);
}

/**
 * @public
 * @param {!Element} $board
 * @param {!Position} position
 * @return {?boolean}
 */
function komaSelectedAt($board, position) {
  const $koma = komaAt($board, position);
  return $koma && komaSelected($koma);
}

/**
 * @public
 * @param {!Element} $koma
 * @return {string}
 */
function komaType($koma) {
  return $koma.textContent.trim();
}

/**
 * @public
 * @param {!Element} $cell
 * @return {?string}
 */
function komaTypeIn($cell) {
  const $koma = komaIn($cell)
  return $koma && komaType($koma);
}

/**
 * @public
 * @param {!Element} $board
 * @param {!Position} position
 * @return {?string}
 */
function komaTypeAt($board, position) {
  return komaTypeIn(cellAt($board, position));
}

/**
 * @public
 * @typedef {{'type': string, 'count': number}}
 */
var Mochigoma;

/**
 * @public
 * @param {!Element} $mochigomas
 * @param {!Array<!Mochigoma>} mochigomas
 * @param {SenteiOption} options
 */
function setMochigomas($mochigomas, mochigomas, options) {
  if (options['sentei']) {
    $mochigomas.classList.remove(classes.mochigomasKoutei);
  } else {
    $mochigomas.classList.add(classes.mochigomasKoutei);
  }

  const all$mochigoma = queryClassAll($mochigomas, classes.mochigoma);
  for (let i = 0; i < 7; i++) {
    const $mochigoma = all$mochigoma[i];
    const $koma = /** @type {!Element} */ (
      queryClass($mochigoma, classes.mochigomaKoma));
    const $count = queryClass($mochigoma, classes.mochigomaCount);

    // Clear existing contents.
    const $existingKomaSVG = komaIn($koma);
    $existingKomaSVG && $koma.removeChild($existingKomaSVG);
    $count.textContent = '';

    const {type, count} = mochigomas[i] || {};
    if (type) {
      $koma.appendChild(komaSVG(type, options));
      $count.textContent = count;
    }
  }
}

/**
 * @public
 * @param {!Element} $mochigomas
 * @return {!Array<!Mochigoma>}
 */
function getMochigomas($mochigomas) {
  const all$mochigoma = queryClassAll($mochigomas, classes.mochigoma);
  const mochigomas = [];
  for (let i = 0; i < 7; i++) {
    const $mochigoma = all$mochigoma[i];
    const $koma = /** @type {!Element} */ (
      queryClass($mochigoma, classes.mochigomaKoma));
    const $count = queryClass($mochigoma, classes.mochigomaCount);

    const type = komaTypeIn($koma);
    const count = parseInt($count.textContent, 10);

    if (type) {
      mochigomas[i] = {type, count};
    }
  }
  return mochigomas;
}

// Utility Functions

/**
 * @const {Set<string>}
 *
 * Note that this is not the exhaustive list of the SVG tag names, but a list
 * used in this module.
 */
const svgTagNames = new Set(['svg', 'polygon', 'text']);

/**
 * @param {string} tagName
 * @param {!Object<string, string>=} attributes
 * @return {!Element}
 */
function $(tagName, attributes={}) {
  const $el = svgTagNames.has(tagName)
    ? document.createElementNS('http://www.w3.org/2000/svg', tagName)
    : document.createElement(tagName);
  for (const key in attributes) {
    $el.setAttribute(key, attributes[key]);
  }
  return $el;
}

/** @const {Array<string>} */
const numberKanjis = [
  '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

/**
 * @param {number} number
 * @return {string}
 */
function kanjiFromNumber(number) {
  return numberKanjis[number - 1];
}

/**
 * @param {string} kanji
 * @return {number}
 */
function numberFromKanji(kanji) {
  return numberKanjis.indexOf(kanji) + 1;
}

/**
 * @param {!Element} $container
 * @param {string} className
 * @return {?Element}
 */
function queryClass($container, className) {
  return $container.querySelector('.' + className);
}

/**
 * @param {!Element} $container
 * @param {string} className
 * @return {!NodeList<!Element>}
 */
function queryClassAll($container, className) {
  return $container.querySelectorAll('.' + className);
}

/// Export

window['Shogi'] = {
  // Constants
  'komaTypes': komaTypes,

  // Factories
  'komaSVG': komaSVG,
  'boardDiv': boardDiv,
  'mochigomasDiv': mochigomasDiv,

  // Setters/Getters
  'cellAt': cellAt,
  'highlightCellAt': highlightCellAt,
  'unhighlightCellAt': unhighlightCellAt,
  'cellHighlighted': cellHighlighted,
  'cellHighlightedAt': cellHighlightedAt,
  'komaAt': komaAt,
  'komaIn': komaIn,
  'selectKoma': selectKoma,
  'unselectKoma': unselectKoma,
  'komaSelected': komaSelected,
  'putKomaAt': putKomaAt,
  'removeKomaAt': removeKomaAt,
  'selectKomaAt': selectKomaAt,
  'unselectKomaAt': unselectKomaAt,
  'komaSelectedAt': komaSelectedAt,
  'komaType': komaType,
  'komaTypeAt': komaTypeAt,
  'komaTypeIn': komaTypeIn,
  'setMochigomas': setMochigomas,
  'getMochigomas': getMochigomas,
};

})(window);
