const Hash = {
  update() {
    let hash = [
      Model.serializeKomas('sente'),
      Model.serializeKomas('gote'),
      Model.serializeMochigomas('sente'),
      Model.serializeMochigomas('gote'),
    ].join('|');
    hash = hash == '|||' ? '' : hash;
    history.replaceState(null, '', location.pathname + '#' + hash);
  },

  parse(hash) {
    if (!hash) return;

    const tokens = hash.split('|');

    Model.deserializeKomas('sente', tokens[0]);
    Model.deserializeKomas('gote', tokens[1]);
    Model.deserializeMochigomas('sente', tokens[2]);
    Model.deserializeMochigomas('gote', tokens[3]);
  },
};

try {
  Hash.parse(decodeURIComponent(location.hash).slice(1));
} catch (_) {
  // Ignore
}
