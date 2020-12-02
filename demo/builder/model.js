const komaTypes = ['飛', '角', '金', '銀', '桂', '香', '歩'];

const initialMochigomas = () => komaTypes.map(type => ({type, count: 0}));

const Model = {
  // Model data.
  koma: {
    sentei: [],
    koutei: [],
  },
  mochigoma: {
    sentei: initialMochigomas(),
    koutei: initialMochigomas(),
  },

  reset(player) {
    Model.koma[player] = [];
    Model.mochigoma[player] = initialMochigomas();
  },

  resetAll() {
    Utility.callForBothPlayers(Model.reset);
  },

  // Koma methods.
  serializeKomas(player) {
    // TODO
    return '';
  },

  deserializeKomas(player, str) {
    // TODO
  },

  // Mochigoma methods.
  updateMochigoma(player, type, updateFunc) {
    const koma = Model.mochigoma[player].find(koma => koma.type == type);
    koma.count = updateFunc(koma.count);
  },

  serializeMochigomas(player) {
    return Model.mochigoma[player]
      .filter(koma => koma.count > 0)
      .map(koma => koma.type + ':' + koma.count)
      .join(',');
  },

  deserializeMochigomas(player, str) {
    for (const token of str.split(',')) {
      const [type, countStr] = token.split(':');
      const count = parseInt(countStr, 10);
      Model.updateMochigoma(player, type, () => count);
    }
  },
};
