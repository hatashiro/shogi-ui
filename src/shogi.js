;(function (window) {

const komaTexts = [
  '王',
  '金',
  '銀', '全',
  '桂', '圭',
  '香', '杏',
  '角', '馬',
  '飛', '龍',
  '歩', 'と',
];

const svg = {
  root: {
    class: 'koma',
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

/// Utility Functions

function $(tagName, attrs={}) {
  $el = document.createElementNS('http://www.w3.org/2000/svg', tagName);
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

/// Export

window.Shogi = {
  komaTexts,
  komaSVG,
};

})(window);
