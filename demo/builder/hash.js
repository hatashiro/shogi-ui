const Hash = {
  update() {
    let hash = [
      Model.serializeKomas('sentei'),
      Model.serializeKomas('koutei'),
      Model.serializeMochigomas('sentei'),
      Model.serializeMochigomas('koutei'),
    ].join('|');
    hash = hash == '|||' ? '' : hash;
    history.replaceState(null, '', location.pathname + '#' + hash);
  },

  parse(hash) {
    if (!hash) return;

    const tokens = hash.split('|');

    Model.deserializeKomas('sentei', tokens[0]);
    Model.deserializeKomas('koutei', tokens[1]);
    Model.deserializeMochigomas('sentei', tokens[2]);
    Model.deserializeMochigomas('koutei', tokens[3]);
  },
};

try {
  Hash.parse(decodeURIComponent(location.hash).slice(1));
} catch (_) {
  // Ignore
}
