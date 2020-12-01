// WIP

const $app = document.querySelector('#app');

const $board = Shogi.boardDiv();
$app.appendChild($board);

// Create a full board with Komas.
function putKoma($board, komaTypeIdx, {suji, dan, sentei}) {
  suji = sentei ? suji : 10 - suji;
  dan = sentei ? dan : 10 - dan;
  const $koma = Shogi.komaSVG(Shogi.komaTypes[komaTypeIdx], {sentei});
  Shogi.putKomaAt($board, $koma, {suji, dan});

  $koma.addEventListener('click', () => {
    if (Shogi.komaSelected($koma)) {
      Shogi.unselectKoma($koma);
    } else {
      Shogi.selectKoma($koma);
    }
  });
}
function putKomas($board, {sentei}) {
  putKoma($board, sentei ? 0 : 1, {suji: 5, dan: 9, sentei});
  putKoma($board, 2, {suji: 2, dan: 8, sentei});
  putKoma($board, 4, {suji: 8, dan: 8, sentei});
  putKoma($board, 6, {suji: 4, dan: 9, sentei});
  putKoma($board, 6, {suji: 6, dan: 9, sentei});
  putKoma($board, 7, {suji: 3, dan: 9, sentei});
  putKoma($board, 7, {suji: 7, dan: 9, sentei});
  putKoma($board, 9, {suji: 2, dan: 9, sentei});
  putKoma($board, 9, {suji: 8, dan: 9, sentei});
  putKoma($board, 11, {suji: 1, dan: 9, sentei});
  putKoma($board, 11, {suji: 9, dan: 9, sentei});
  for (let suji = 1; suji <= 9; suji++) {
    const dan = 7;
    putKoma($board, 13, {suji, dan, sentei});
  }
}
putKomas($board, {sentei: true});
putKomas($board, {sentei: false});

// Board without Suji/Dan texts.
const $board2 = Shogi.boardDiv();
$board2.classList.add('shogi__board--no_text');
$app.appendChild($board2);

const $koma = Shogi.komaSVG(Shogi.komaTypes[14], {sentei: true});
Shogi.putKomaAt($board2, $koma, {suji: 6, dan: 6});

// Highlights.
Shogi.highlightCellAt($board2, {suji: 5, dan: 5});
Shogi.highlightCellAt($board2, {suji: 6, dan: 5});
Shogi.highlightCellAt($board2, {suji: 7, dan: 5});
Shogi.highlightCellAt($board2, {suji: 5, dan: 6});
Shogi.highlightCellAt($board2, {suji: 7, dan: 6});
Shogi.highlightCellAt($board2, {suji: 6, dan: 7});