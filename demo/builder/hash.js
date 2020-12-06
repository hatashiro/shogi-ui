const Hash = {
  update() {
    const tokens = [
      Model.serializeBoard(),
      Model.serializeMochigomas('sente'),
      Model.serializeMochigomas('gote'),
    ];
    const hash =
      tokens.some(token => token.length > 0) ? '#' + tokens.join('|') : '';
    history.replaceState(null, '', location.pathname + hash);
  },

  parse(hash) {
    if (!hash) return;

    const tokens = hash.split('|');

    Model.deserializeBoard(tokens[0]);
    Model.deserializeMochigomas('sente', tokens[1]);
    Model.deserializeMochigomas('gote', tokens[2]);
  },
};

try {
  Hash.parse(decodeURIComponent(location.hash).slice(1));
} catch (_) {
  // Ignore
}
