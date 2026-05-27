function cis(theta) {
  return {
    re: Math.cos(theta),
    im: Math.sin(theta)
  };
}

function complex(re, im) {
  return { re, im };
}

function multiplyMatrixVector(m, v) {
  return [
    {
      re: m[0][0].re * v[0].re - m[0][0].im * v[0].im +
          m[0][1].re * v[1].re - m[0][1].im * v[1].im,
      im: m[0][0].re * v[0].im + m[0][0].im * v[0].re +
          m[0][1].re * v[1].im + m[0][1].im * v[1].re
    },
    {
      re: m[1][0].re * v[0].re - m[1][0].im * v[0].im +
          m[1][1].re * v[1].re - m[1][1].im * v[1].im,
      im: m[1][0].re * v[0].im + m[1][0].im * v[0].re +
          m[1][1].re * v[1].im + m[1][1].im * v[1].re
    }
  ];
}

const SQRT2 = Math.sqrt(2);

const gates = {

  // Identity Gate
  I: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(1, 0)]
  ],

  // Pauli-X Gate
  X: [
    [complex(0, 0), complex(1, 0)],
    [complex(1, 0), complex(0, 0)]
  ],

  // Pauli-Y Gate
  Y: [
    [complex(0, 0), complex(0, -1)],
    [complex(0, 1), complex(0, 0)]
  ],

  // Pauli-Z Gate
  Z: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(-1, 0)]
  ],

  // Hadamard Gate
  H: [
    [complex(1 / SQRT2, 0), complex(1 / SQRT2, 0)],
    [complex(1 / SQRT2, 0), complex(-1 / SQRT2, 0)]
  ],

  // Phase Gate
  S: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(0, 1)]
  ],

  // pi/8 Gate
  T: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), cis(Math.PI / 4)]
  ]
};

function probability(a) {
  return a.re * a.re + a.im * a.im;
}

self.onmessage = (e) => {
  const { type, gate, state } = e.data;

  if (type === 'gate') {
    const result = multiplyMatrixVector(gates[gate], state);

    self.postMessage({
      type: 'state',
      state: result
    });
  }

  if (type === 'measure') {
    const p0 = probability(state[0]);
    const rnd = Math.random();

    const measured = rnd < p0 ? 0 : 1;

    const collapsed = measured === 0
      ? [complex(1, 0), complex(0, 0)]
      : [complex(0, 0), complex(1, 0)];

    self.postMessage({
      type: 'measurement',
      measured,
      state: collapsed
    });
  }
};
