const initialBoard = () => [null, [], [], [], [], [], [], [], [], []];

const mochigomaTypes = ['飛', '角', '金', '銀', '桂', '香', '歩'];

const initialMochigomas = () => mochigomaTypes.map(type => ({type, count: 0}));

const Model = {
  // Board data.
  board: initialBoard(),
  mochigoma: {
    sente: initialMochigomas(),
    gote: initialMochigomas(),
  },
  selectedPosition: null,

  reset(player) {
    Model.koma[player] = [];
  },

  resetAll() {
    Model.board = initialBoard();
    Utility.callForBothPlayers(player => {
      Model.mochigoma[player] = initialMochigomas();
    });
  },

  // Board methods.
  serializeBoard() {
    const result = [];
    for (let suji = 1; suji <= 9; suji++) {
      for (let dan = 1; dan <= 9; dan++) {
        const koma = Model.board[suji][dan];
        if (!koma) continue;
        const prefix = koma.sente ? '☗' : '☖';
        result.push(prefix + suji + dan + koma.type);
      }
    }
    return result.join(',');
  },

  deserializeBoard(str) {
    Model.board = initialBoard();
    for (const token of str.split(',')) {
      const sente = token.charAt(0) == '☗';
      const suji = parseInt(token.charAt(1), 10);
      const dan = parseInt(token.charAt(2), 10);
      const type = token.charAt(3);
      if (Number.isInteger(suji) && Number.isInteger(dan) && type) {
        Model.board[suji][dan] = {type, sente};
      }
    }
  },

  addKomaAt(type, {sente}, {suji, dan}) {
    Model.board[suji][dan] = {type, sente};
  },

  removeKomaAt({suji, dan}) {
    Model.board[suji][dan] = null;
  },

  // Mochigoma methods.
  updateMochigoma(player, type, updateFunc) {
    const koma = Model.mochigoma[player].find(koma => koma.type == type);
    koma.count = updateFunc(koma.count);
  },

  serializeMochigomas(player) {
    return Model.mochigoma[player]
      .filter(koma => koma.count > 0)
      .map(koma => koma.type + koma.count)
      .join(',');
  },

  deserializeMochigomas(player, str) {
    for (const token of str.split(',')) {
      const type = token.charAt(0);
      const count = parseInt(token.charAt(1), 10);
      if (type && Number.isInteger(count)) {
        Model.updateMochigoma(player, type, () => count);
      }
    }
  },
};
