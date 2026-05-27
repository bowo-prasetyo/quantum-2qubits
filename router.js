const Home = {
  template: `
    <div class="container">
      <div class="card">
        <button @click="$router.push('/')">Simulator</button>
        <button @click="$router.push('/manual')">User Manual</button>
      </div>
      
      <div class="card">
        <h1>1 Qubit Quantum Simulator</h1>

        <p>
          Minimal quantum computer simulator that demonstrates the basic behavior of a single quantum bit (qubit).
        </p>
      </div>

      <div class="card">
        <canvas ref="canvas" width="400" height="400"></canvas>
      </div>

      <div class="card">
      
        <button @click="applyGate('I')">
          Identity (I)
        </button>
      
        <button @click="applyGate('H')">
          Hadamard (H)
        </button>
      
        <button @click="applyGate('X')">
          Pauli-X (X)
        </button>
      
        <button @click="applyGate('Y')">
          Pauli-Y (Y)
        </button>
      
        <button @click="applyGate('Z')">
          Pauli-Z (Z)
        </button>
      
        <button @click="applyGate('S')">
          Phase (S)
        </button>
      
        <button @click="applyGate('T')">
          π/8 (T)
        </button>
      
        <button @click="measure">
          Measure
        </button>
      
        <button @click="reset">
          Reset
        </button>
      
      </div>

      <div class="card">
        <h3>Quantum State</h3>

        <pre>{{ prettyState }}</pre>

        <p>Measurement: {{ measurement }}</p>
      </div>

      <div class="card">
        <h2>Quantum Concepts</h2>
      
        <p>
          <strong>Quantum State</strong><br>
          The current mathematical state of the qubit.
          A qubit can exist in a combination of |0⟩ and |1⟩ simultaneously.
        </p>
      
        <p>
          <strong>Identity Gate (I)</strong><br>
          Does nothing to the qubit.
          It leaves the quantum state unchanged.
        </p>
      
        <p>
          <strong>Hadamard Gate (H)</strong><br>
          Creates superposition.
          It transforms a definite state into a 50/50 quantum mixture.
        </p>
      
        <p>
          <strong>Pauli-X Gate (X)</strong><br>
          Similar to a classical NOT gate.
          It flips |0⟩ into |1⟩ and vice versa.
        </p>
      
        <p>
          <strong>Pauli-Y Gate (Y)</strong><br>
          Rotates the qubit using complex quantum phase.
          It flips the state while also introducing imaginary components.
        </p>
      
        <p>
          <strong>Pauli-Z Gate (Z)</strong><br>
          Changes the quantum phase.
          Unlike Pauli-X, it does not flip probabilities directly.
        </p>
      
        <p>
          <strong>Phase Gate (S)</strong><br>
          Applies a 90-degree quantum phase shift.
          It is commonly used in quantum interference operations.
        </p>
      
        <p>
          <strong>π/8 Gate (T)</strong><br>
          Applies a smaller 45-degree quantum phase shift.
          This gate is very important in universal quantum computing.
        </p>
      
        <p>
          <strong>Measure</strong><br>
          Observes the qubit.
          Superposition collapses into either |0⟩ or |1⟩.
        </p>
      
        <p>
          <strong>Measurement</strong><br>
          Shows the latest observed classical result after measurement.
        </p>
      </div>
    </div>
  `,

  data() {
    return {
      state: [
        { re: 1, im: 0 },
        { re: 0, im: 0 }
      ],
      measurement: '-',
      worker: null
    };
  },

  computed: {
    prettyState() {
      return JSON.stringify(this.state, null, 2);
    }
  },

  async mounted() {
    this.worker = new Worker('./worker.js');

    this.worker.onmessage = async (e) => {
      const msg = e.data;

      if (msg.type === 'state') {
        this.state = msg.state;
      }

      if (msg.type === 'measurement') {
        this.measurement = msg.measured;
        this.state = msg.state;
      }

      await window.db.saveState(this.state);
      this.draw();
    };

    const saved = await window.db.loadState();

    if (saved) {
      this.state = saved;
    }

    this.draw();
  },

  methods: {
    applyGate(gate) {
      const plainState = structuredClone(Vue.toRaw(this.state));
    
      this.worker.postMessage({
        type: 'gate',
        gate,
        state: plainState
      });
    },
    
    measure() {
      const plainState = structuredClone(Vue.toRaw(this.state));
    
      this.worker.postMessage({
        type: 'measure',
        state: plainState
      });
    },
        
    async reset() {
      this.state = [
        { re: 1, im: 0 },
        { re: 0, im: 0 }
      ];

      this.measurement = '-';

      await window.db.saveState(this.state);

      this.draw();
    },

    draw() {
    
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      const W = canvas.width;
      const H = canvas.height;
    
      const cx = W / 2;
      const cy = H / 2;
    
      const radius = 140;
      const perspective = 0.35;

      function project(x, y, z) {
        return {
          x: cx + (x + y * perspective) * radius,
          y: cy - (z + y * perspective) * radius
        };
      }
    
      //
      // BACKGROUND
      //
    
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
    
      //
      // SPHERE
      //
    
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
    
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    
      //
      // EQUATOR
      //
    
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
    
      //
      // Z AXIS
      //
    
      ctx.strokeStyle = '#444';

      {
        const p1 = project(0, 0, 1);
        const p2 = project(0, 0, -1);
      
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      //
      // Y AXIS
      //
      
      ctx.strokeStyle = '#888';
      
      {
        const p1 = project(0, -1, 0);
        const p2 = project(0, 1, 0);
      
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    
      //
      // X AXIS
      //
      {
        const p1 = project(-1, 0, 0);
        const p2 = project(1, 0, 0);
      
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    
      //
      // LABELS
      //
      
      ctx.fillStyle = 'white';
      
      {
        const p0 = project(0, 0, 1);
        const p1 = project(0, 0, -1);
      
        ctx.fillText('|0⟩', p0.x - 10, p0.y - 10);
        ctx.fillText('|1⟩', p1.x - 10, p1.y + 20);
      }
      
      {
        const px1 = project(1, 0, 0);
        const px2 = project(-1, 0, 0);
      
        ctx.fillText('X', px1.x + 10, px1.y);
        ctx.fillText('-X', px2.x - 25, px2.y);
      }
      
      {
        const py1 = project(0, 1, 0);
        const py2 = project(0, -1, 0);
      
        ctx.fillText('Y', py1.x + 10, py1.y);
        ctx.fillText('-Y', py2.x - 25, py2.y);
      }
            
      //
      // CURRENT QUANTUM STATE
      //
    
      const alpha = this.state[0];
      const beta = this.state[1];
    
      //
      // BLOCH SPHERE COORDINATES
      //
    
      const alphaMag =
        alpha.re * alpha.re +
        alpha.im * alpha.im;
    
      const betaMag =
        beta.re * beta.re +
        beta.im * beta.im;
    
      //
      // Relative phase
      //
    
      const phaseAlpha =
        Math.atan2(alpha.im, alpha.re);
    
      const phaseBeta =
        Math.atan2(beta.im, beta.re);
    
      const phi = phaseBeta - phaseAlpha;
    
      //
      // theta
      //
    
      const theta =
        2 * Math.acos(Math.sqrt(alphaMag));
    
      //
      // Bloch coordinates
      //
    
      const x =
        Math.sin(theta) * Math.cos(phi);
    
      const y =
        Math.sin(theta) * Math.sin(phi);
    
      const z =
        Math.cos(theta);
    
      //
      // Simple 3D projection
      //

      const projected = project(x, y, z);
      
      const screenX = projected.x;
      const screenY = projected.y;
      
      //
      // DRAW VECTOR
      //
    
      ctx.strokeStyle = '#2f6fed';
      ctx.lineWidth = 4;
    
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(screenX, screenY);
      ctx.stroke();
    
      //
      // VECTOR TIP
      //
    
      ctx.fillStyle = '#2f6fed';
    
      ctx.beginPath();
      ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
      ctx.fill();
    
      //
      // DEBUG INFO
      //
    
      ctx.fillStyle = '#aaa';
    
      ctx.fillText(
        `x=${x.toFixed(2)}`,
        10,
        20
      );
    
      ctx.fillText(
        `y=${y.toFixed(2)}`,
        10,
        40
      );
    
      ctx.fillText(
        `z=${z.toFixed(2)}`,
        10,
        60
      );
    
    }
  }
};

const Manual = {
  template: `
    <div class="container">
      <div class="card">
        <button @click="$router.push('/')">Simulator</button>
        <button @click="$router.push('/manual')">User Manual</button>
      </div>

      <div class="card">
        <h1>User Manual</h1>

        <p>
          This simulator demonstrates the basic behavior of a single quantum bit (qubit).
        </p>

        <p>
          Unlike a classical bit that is only 0 or 1,
          a qubit can exist in a quantum superposition of both states.
        </p>
      </div>
      
      <div class="card">
        <h2>Use Case 1 — Classical Bit Flip</h2>
      
        <p>
          This demonstrates how some quantum operations can behave similarly
          to ordinary classical logic gates.
        </p>
      
        <p><strong>Objective:</strong></p>
      
        <p>
          Understand how the Pauli-X gate flips the qubit state,
          similar to a classical NOT operation.
        </p>
      
        <p><strong>Why This Matters:</strong></p>
      
        <p>
          Quantum computers still perform operations that resemble classical logic,
          but they do so using quantum mathematics.
        </p>
      
        <p><strong>Steps:</strong></p>
      
        <ol>
          <li>Press Reset</li>
          <li>Press Pauli-X</li>
          <li>Press Measure</li>
        </ol>
      
        <p><strong>Expected Result:</strong></p>
      
        <p>
          The measurement consistently becomes 1 because
          Pauli-X transforms |0⟩ into |1⟩.
        </p>
      </div>
      
      <div class="card">
        <h2>Use Case 2 — Quantum Superposition</h2>
      
        <p>
          This demonstrates one of the most important ideas in quantum computing:
          superposition.
        </p>
      
        <p><strong>Objective:</strong></p>
      
        <p>
          Observe how a qubit can mathematically exist in both |0⟩ and |1⟩ simultaneously.
        </p>
      
        <p><strong>Why This Matters:</strong></p>
      
        <p>
          Superposition allows quantum computers to process information
          differently from classical computers.
        </p>
      
        <p><strong>Steps:</strong></p>
      
        <ol>
          <li>Press Reset</li>
          <li>Press Hadamard (H)</li>
          <li>Press Measure, then repeat 2 &rarr; 3</li>
        </ol>
      
        <p><strong>Expected Result:</strong></p>
      
        <p>
          Measurements randomly become either 0 or 1
          with approximately equal probability.
        </p>
      </div>

      <div class="card">
        <h2>Use Case 3 — Quantum Collapse</h2>
      
        <p>
          This demonstrates how quantum measurement changes the quantum state itself.
        </p>
      
        <p><strong>Objective:</strong></p>
      
        <p>
          Observe wavefunction collapse after measurement.
        </p>
      
        <p><strong>Why This Matters:</strong></p>
      
        <p>
          In quantum mechanics, observation is not passive.
          Measuring a qubit forces it into a definite classical state.
        </p>
      
        <p><strong>Steps:</strong></p>
      
        <ol>
          <li>Press Reset</li>
          <li>Press Hadamard (H)</li>
          <li>Press Measure</li>
          <li>Press Measure again</li>
        </ol>
      
        <p><strong>Expected Result:</strong></p>
      
        <p>
          The second measurement usually matches the first because
          the first measurement already collapsed the quantum state.
        </p>
      </div>

      <div class="card">
        <h2>Use Case 4 — Double Hadamard</h2>
      
        <p>
          This demonstrates reversible quantum operations.
        </p>
      
        <p><strong>Objective:</strong></p>
      
        <p>
          Observe how applying the same quantum gate twice
          can restore the original state.
        </p>
      
        <p><strong>Why This Matters:</strong></p>
      
        <p>
          Many quantum operations are reversible,
          unlike many ordinary classical processes.
        </p>
      
        <p><strong>Steps:</strong></p>
      
        <ol>
          <li>Press Reset</li>
          <li>Press Hadamard (H)</li>
          <li>Press Hadamard (H) again</li>
          <li>Press Measure</li>
        </ol>
      
        <p><strong>Expected Result:</strong></p>
      
        <p>
          The qubit returns to the original |0⟩ state.
        </p>
      </div>

      <div class="card">
        <h2>Use Case 5 — Quantum Phase Change</h2>
      
        <p>
          This demonstrates quantum phase manipulation using the Pauli-Z gate.
        </p>
      
        <p><strong>Objective:</strong></p>
      
        <p>
          Observe how quantum phase can change internally
          without immediately changing measurement probabilities.
        </p>
      
        <p><strong>Why This Matters:</strong></p>
      
        <p>
          Quantum computation depends not only on probabilities,
          but also on hidden phase relationships between amplitudes.
        </p>
      
        <p>
          Phase differences later influence interference effects
          in larger quantum algorithms.
        </p>
      
        <p><strong>Steps:</strong></p>
      
        <ol>
          <li>Press Reset</li>
          <li>Press Hadamard (H)</li>
          <li>Press Pauli-Z</li>
          <li>Press Measure, then repeat 2 &rarr; 3 &rarr; 4</li>
        </ol>
      
        <p><strong>Expected Result:</strong></p>
      
        <p>
          Measurements still appear approximately 50/50,
          even though the internal quantum phase changed.
        </p>
      </div>

      <div class="card">
        <h2>Use Case 6 — Identity Operation</h2>
      
        <p>
          This demonstrates a quantum operation that intentionally changes nothing.
        </p>
      
        <p><strong>Objective:</strong></p>
      
        <p>
          Observe how the Identity gate preserves the current quantum state.
        </p>
      
        <p><strong>Why This Matters:</strong></p>
      
        <p>
          Identity operations are useful in real quantum circuits for timing,
          synchronization, circuit design, and algorithm structure.
        </p>
      
        <p><strong>Steps:</strong></p>
      
        <ol>
          <li>Press Reset</li>
          <li>Press Hadamard (H)</li>
          <li>Press Identity (I)</li>
          <li>Press Measure, then repeat 3 &rarr; 4</li>
        </ol>
      
        <p><strong>Expected Result:</strong></p>
      
        <p>
          The probabilities remain approximately unchanged because
          the Identity gate does not modify the quantum state.
        </p>
      </div>

      <div class="card">
        <h2>Use Case 7 — Complex Quantum Rotation</h2>
      
        <p>
          This demonstrates quantum rotation involving imaginary-number components.
        </p>
      
        <p><strong>Objective:</strong></p>
      
        <p>
          Observe how the Pauli-Y gate combines state flipping
          with complex quantum phase changes.
        </p>
      
        <p><strong>Why This Matters:</strong></p>
      
        <p>
          Quantum mechanics depends heavily on complex numbers.
          Pauli-Y introduces imaginary amplitudes that have no direct classical equivalent.
        </p>
      
        <p><strong>Steps:</strong></p>
      
        <ol>
          <li>Press Reset</li>
          <li>Press Pauli-Y</li>
          <li>Press Measure</li>
        </ol>
      
        <p><strong>Expected Result:</strong></p>
      
        <p>
          The measurement usually becomes 1,
          but the internal quantum state also contains imaginary phase information.
        </p>
      </div>

      <div class="card">
        <h2>Use Case 8 — 90 Degree Phase Shift</h2>
      
        <p>
          This demonstrates controlled quantum phase modification.
        </p>
      
        <p><strong>Objective:</strong></p>
      
        <p>
          Observe how the Phase gate changes the internal phase
          without directly changing measurement probabilities.
        </p>
      
        <p><strong>Why This Matters:</strong></p>
      
        <p>
          Quantum algorithms rely heavily on phase relationships
          to create constructive and destructive interference.
        </p>
      
        <p><strong>Steps:</strong></p>
      
        <ol>
          <li>Press Reset</li>
          <li>Press Hadamard (H)</li>
          <li>Press Phase (S)</li>
          <li>Press Measure, then repeat 2 &rarr; 3 &rarr; 4</li>
        </ol>
      
        <p><strong>Expected Result:</strong></p>
      
        <p>
          Measurements remain approximately 50/50,
          even though the internal quantum phase changes.
        </p>
      </div>

      <div class="card">
        <h2>Use Case 9 — Fine Quantum Phase Control</h2>
      
        <p>
          This demonstrates precise quantum phase manipulation.
        </p>
      
        <p><strong>Objective:</strong></p>
      
        <p>
          Observe how the π/8 gate applies a smaller and more precise phase shift.
        </p>
      
        <p><strong>Why This Matters:</strong></p>
      
        <p>
          The T gate is one of the most important gates in fault-tolerant
          and universal quantum computing systems.
        </p>
      
        <p>
          Many advanced quantum algorithms depend on this gate.
        </p>
      
        <p><strong>Steps:</strong></p>
      
        <ol>
          <li>Press Reset</li>
          <li>Press Hadamard (H)</li>
          <li>Press π/8 (T)</li>
          <li>Press Measure, then repeat 2 &rarr; 3 &rarr; 4</li>
        </ol>
      
        <p><strong>Expected Result:</strong></p>
      
        <p>
          Measurements remain approximately 50/50,
          while the internal quantum phase changes subtly.
        </p>
      </div>
            
      <div class="card">
        <h2>Use Case 10 — Persistence</h2>

        <p><strong>Objective:</strong></p>

        <p>
          Observe browser-based local persistence.
        </p>

        <p><strong>Steps:</strong></p>

        <ol>
          <li>Change the quantum state</li>
          <li>Refresh the browser page</li>
        </ol>

        <p><strong>Expected Result:</strong></p>

        <p>
          The previous quantum state is restored automatically.
        </p>
      </div>

    </div>
  `
};

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/manual',
      component: Manual
    }
  ]
});
