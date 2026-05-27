function complex(re, im) {
  return { re, im };
}

function cis(theta) {
  return {
    re: Math.cos(theta),
    im: Math.sin(theta)
  };
}

function add(a, b) {
  return {
    re: a.re + b.re,
    im: a.im + b.im
  };
}

function multiply(a, b) {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re
  };
}

function probability(a) {
  return a.re * a.re + a.im * a.im;
}

const SQRT2 = Math.sqrt(2);

const singleQubitGates = {

  I: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(1, 0)]
  ],

  X: [
    [complex(0, 0), complex(1, 0)],
    [complex(1, 0), complex(0, 0)]
  ],

  Y: [
    [complex(0, 0), complex(0, -1)],
    [complex(0, 1), complex(0, 0)]
  ],

  Z: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(-1, 0)]
  ],

  H: [
    [complex(1 / SQRT2, 0), complex(1 / SQRT2, 0)],
    [complex(1 / SQRT2, 0), complex(-1 / SQRT2, 0)]
  ],

  S: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(0, 1)]
  ],

  T: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), cis(Math.PI / 4)]
  ]
};

function cloneState(state) {
  return state.map(v => complex(v.re, v.im));
}

function applySingleQubitGate(state, gate, targetQubit) {

  const m = singleQubitGates[gate];
  const result = cloneState(state);

  for (let i = 0; i < 4; i++) {

    if (((i >> (1 - targetQubit)) & 1) === 0) {
      
      const j = i | (1 << (1 - targetQubit));

      const a = state[i];
      const b = state[j];

      result[i] = add(
        multiply(m[0][0], a),
        multiply(m[0][1], b)
      );

      result[j] = add(
        multiply(m[1][0], a),
        multiply(m[1][1], b)
      );
    }
  }

  return result;
}

function applyCNOT(state) {

  const result = cloneState(state);

  result[0] = state[0];
  result[1] = state[1];
  result[2] = state[3];
  result[3] = state[2];

  return result;
}

function measure(state) {

  const probs = state.map(probability);

  const rnd = Math.random();

  let accum = 0;
  let measured = 0;

  for (let i = 0; i < probs.length; i++) {
    accum += probs[i];

    if (rnd < accum) {
      measured = i;
      break;
    }
  }

  const collapsed = [
    complex(0, 0),
    complex(0, 0),
    complex(0, 0),
    complex(0, 0)
  ];

  collapsed[measured] = complex(1, 0);

  return {
    measured,
    state: collapsed
  };
}

self.onmessage = (e) => {

  const {
    type,
    gate,
    state,
    targetQubit
  } = e.data;

  if (type === 'gate') {

    const result = applySingleQubitGate(
      state,
      gate,
      targetQubit
    );

    self.postMessage({
      type: 'state',
      state: result
    });
  }

  if (type === 'cnot') {

    const result = applyCNOT(state);

    self.postMessage({
      type: 'state',
      state: result
    });
  }

  if (type === 'measure') {

    const result = measure(state);

    self.postMessage({
      type: 'measurement',
      measured: result.measured,
      state: result.state
    });
  }
};
