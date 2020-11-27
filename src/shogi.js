;(function (window) {

const komaTexts = [
  '王', '金', '銀', '桂', '香', '角', '飛', '歩',
  '玉',       '全', '圭', '杏', '馬', '龍', 'と',
];

const svg = {
  root: {
    class: 'shogi__koma',
    viewBox: '0 0 250 250',
  },

  koma: {
    points: [
      '125,0 195,30 235,238 15,238 55,30',
      '125,238 195,208 235,0 15,0 55,208',
    ],
    fill: 'rgb(221,190,138)',
  },

  komaSide: {
    points: [
      '15,238 235,238 232,250 18,250',
      '125,238 195,208 192,220 125,250 58,220 55,208',
    ],
    fill: 'rgb(133,111,83)',
  },

  komaText: {
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    'font-size': '120px',
    x: 125,
    y: [145, 93],
    transform: ['', 'rotate(180,125,93)'],
  },
};

function komaSVG(komaText, {sentei}) {
  const $svg = $('svg', svg.root);

  const $koma = $('polygon', attrs('koma', {sentei}));
  const $komaSide = $('polygon', attrs('komaSide', {sentei}));
  const $komaText = $('text', attrs('komaText', {sentei}));
  $komaText.textContent = komaText;

  $svg.appendChild($koma);
  $svg.appendChild($komaSide);
  $svg.appendChild($komaText);

  return $svg;
}

function boardDiv() {
  const $board = $('div', {class: 'shogi__board'});

  const $sujiTextRow = $('div', {class: 'shogi__suji_text_row'});
  for (let suji = 9; suji >= 1; suji--) {
    const $sujiText = $('div', {class: 'shogi__suji_text'});
    $sujiText.textContent = suji;
    $sujiTextRow.appendChild($sujiText);
  }
  $sujiTextRow.appendChild($('div', {class: 'shogi__dan_text'}));
  $board.appendChild($sujiTextRow);

  for (let dan = 1; dan <= 9; dan++) {
    const $danRow = $('div', {class: 'shogi__dan_row'});

    for (let suji = 9; suji >= 1; suji--) {
      if ((suji == 3 || suji == 6) && (dan == 3 || dan == 6)) {
        const $dot = $('div', {class: 'shogi__board__dot'});
        $danRow.appendChild($dot);
      }

      const $cell = $('div', {class: 'shogi__cell'});
      $danRow.appendChild($cell);
    }

    const $danText = $('div', {class: 'shogi__dan_text'});
    const $danTextSpan = $('span');
    $danTextSpan.textContent = kanjiFromNumber(dan);
    $danText.appendChild($danTextSpan);
    $danRow.appendChild($danText);

    $board.appendChild($danRow);
  }

  return $board;
}

function cellAt($board, {suji, dan}) {
  const sujiIdx = 9 - suji;
  const danRowIdx = dan - 1;

  $danRow = $board.querySelectorAll('.shogi__dan_row')[danRowIdx];
  return $danRow.querySelectorAll('.shogi__cell')[sujiIdx];
}

const cellHighlightedClass = 'shogi__cell--highlighted';

function highlightCellAt($board, {suji, dan}) {
  const $cell = cellAt($board, {suji, dan});
  $cell.classList.add(cellHighlightedClass);
}

function unhighlightCellAt($board, {suji, dan}) {
  const $cell = cellAt($board, {suji, dan});
  $cell.classList.remove(cellHighlightedClass);
}

function cellHighlighted($cell) {
  return $cell.classList.contains(cellHighlightedClass);
}

function cellHighlightedAt($board, {suji, dan}) {
  cellHighlighted(cellAt($board, {suji, dan}));
}

function komaAt($board, {suji, dan}) {
  return komaIn(cellAt($board, {suji, dan}));
}

function komaIn($cell) {
  const $koma = $cell.querySelector('.shogi__koma');
  return $koma || null;
}

const komaSelectedClass = 'shogi__koma--selected';

function selectKoma($koma) {
  $koma.classList.add(komaSelectedClass);
}

function unselectKoma($koma) {
  $koma.classList.remove(komaSelectedClass);
}

function komaSelected($koma) {
  return $koma.classList.contains(komaSelectedClass);
}

function putKomaAt($board, $koma, {suji, dan}) {
  removeKomaAt($board, {suji, dan});
  const $cell = cellAt($board, {suji, dan});
  $cell.appendChild($koma);
}

function removeKomaAt($board, {suji, dan}) {
  const $cell = cellAt($board, {suji, dan});
  const $existingKoma = komaIn($cell);
  if ($existingKoma) {
    $cell.removeChild($existingKoma);
  }
}

function selectKomaAt($board, {suji, dan}) {
  const $koma = komaAt($board, {suji, dan});
  $koma && selectKoma($koma);
}

function unselectKomaAt($board, {suji, dan}) {
  const $koma = komaAt($board, {suji, dan});
  $koma && unselectKoma($koma);
}

function komaSelectedAt($board, {suji, dan}) {
  const $koma = komaAt($board, {suji, dan});
  return $koma && komaSelected($koma);
}

/// Utility Functions

// Note that this is not the exhaustive list of the SVG tag names, but a list
// used in this module.
const svgTagNames = new Set(['svg', 'polygon', 'text']);

function $(tagName, attrs={}) {
  $el = svgTagNames.has(tagName)
    ? document.createElementNS('http://www.w3.org/2000/svg', tagName)
    : document.createElement(tagName);
  for (const key in attrs) {
    $el.setAttribute(key, attrs[key]);
  }
  return $el;
}

const attrsCache = {};
function attrs(svgKey, {sentei}) {
  const player = sentei ? 0 : 1;

  // Check the cache first.
  const cache = attrsCache[svgKey];
  if (cache && cache[player]) {
    return cache[player];
  }

  const attrs = svg[svgKey];
  const result = {};
  for (const key in attrs) {
    const value = attrs[key];
    result[key] = Array.isArray(value) ? value[player] : value;
  }

  attrsCache[svgKey] = cache || [];
  attrsCache[svgKey][player] = result;
  return result;
}

const numberKanjis = [
  '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function kanjiFromNumber(number) {
  return numberKanjis[number - 1];
}

function numberFromKanji(kanji) {
  return numberKanjis.indexOf(kanji) + 1;
}

/// Export

window.Shogi = {
  komaTexts,
  komaSVG,
  boardDiv,
  cellAt,
  highlightCellAt,
  unhighlightCellAt,
  cellHighlighted,
  cellHighlightedAt,
  komaAt,
  komaIn,
  selectKoma,
  unselectKoma,
  komaSelected,
  putKomaAt,
  removeKomaAt,
  selectKomaAt,
  unselectKomaAt,
  komaSelectedAt,
};

})(window);
