const Home = {
  template: `
    <div class="container">
      <div class="card">
        <button @click="$router.push('/')">Simulator</button>
        <button @click="$router.push('/manual')">User Manual</button>
      </div>
      
      <div class="card">
        <h1>2 Qubits Quantum Simulator</h1>

        <p>
          Minimal quantum computer simulator that demonstrates the basic behavior of 2 quantum bits (qubits).
        </p>
      </div>

      <div class="card">
        <canvas ref="canvas" width="400" height="400"></canvas>
      </div>

      <div class="card">
      
        <h3>Qubit 0</h3>
      
        <button @click="applyGate('H', 0)">H</button>
        <button @click="applyGate('X', 0)">X</button>
        <button @click="applyGate('Y', 0)">Y</button>
        <button @click="applyGate('Z', 0)">Z</button>
        <button @click="applyGate('S', 0)">S</button>
        <button @click="applyGate('T', 0)">T</button>
      
        <h3>Qubit 1</h3>
      
        <button @click="applyGate('H', 1)">H</button>
        <button @click="applyGate('X', 1)">X</button>
        <button @click="applyGate('Y', 1)">Y</button>
        <button @click="applyGate('Z', 1)">Z</button>
        <button @click="applyGate('S', 1)">S</button>
        <button @click="applyGate('T', 1)">T</button>
      
        <hr>
      
        <button @click="applyCNOT">
          CNOT
        </button>
      
        <button @click="createBellState">
          Bell State
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
          The current mathematical state of the quantum system.
          In a 2-qubit system, the state may contain combinations of:
          |00⟩, |01⟩, |10⟩, and |11⟩ simultaneously.
        </p>
      
        <p>
          <strong>Superposition</strong><br>
          A quantum system can exist in multiple basis states at the same time.
          Measuring the system collapses it into one classical result.
        </p>
      
        <p>
          <strong>Entanglement</strong><br>
          Two qubits can become correlated in a way that classical systems cannot reproduce.
          Measuring one qubit can instantly determine the other.
        </p>
      
        <p>
          <strong>Bell State</strong><br>
          A famous entangled quantum state.
          The simulator can generate:
          (|00⟩ + |11⟩) / √2
          using a Hadamard gate followed by a CNOT gate.
        </p>
      
        <p>
          <strong>Identity Gate (I)</strong><br>
          Does nothing to the selected qubit.
          The quantum state remains unchanged.
        </p>
      
        <p>
          <strong>Hadamard Gate (H)</strong><br>
          Creates superposition.
          It transforms a definite classical state into a quantum mixture.
        </p>
      
        <p>
          <strong>Pauli-X Gate (X)</strong><br>
          Similar to a classical NOT gate.
          It flips |0⟩ into |1⟩ and vice versa.
        </p>
      
        <p>
          <strong>Pauli-Y Gate (Y)</strong><br>
          Rotates the qubit using complex quantum phase.
          It flips the state while introducing imaginary-number amplitudes.
        </p>
      
        <p>
          <strong>Pauli-Z Gate (Z)</strong><br>
          Changes the quantum phase without directly flipping probabilities.
          This affects interference behavior in later operations.
        </p>
      
        <p>
          <strong>Phase Gate (S)</strong><br>
          Applies a 90-degree quantum phase rotation.
          It is commonly used in interference and phase-control operations.
        </p>
      
        <p>
          <strong>π/8 Gate (T)</strong><br>
          Applies a smaller 45-degree phase rotation.
          This gate is important in universal and fault-tolerant quantum computing.
        </p>
      
        <p>
          <strong>CNOT Gate</strong><br>
          A two-qubit gate that conditionally flips the target qubit.
          It is one of the most important gates for creating entanglement.
        </p>
      
        <p>
          <strong>Probability Bars</strong><br>
          The visualization shows probabilities for:
          |00⟩, |01⟩, |10⟩, and |11⟩.
          Taller bars indicate higher measurement probability.
        </p>
      
        <p>
          <strong>Measure</strong><br>
          Observes the quantum system.
          Superposition collapses into one classical basis state.
        </p>
      
        <p>
          <strong>Measurement</strong><br>
          Shows the latest observed classical result such as:
          |00⟩, |01⟩, |10⟩, or |11⟩.
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
    },
    probabilities() {
      return this.state.map(v => {
        return (
          v.re * v.re +
          v.im * v.im
        );
      });
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
    createBellState() {
    
      this.applyGate('H', 0);
    
      setTimeout(() => {
        this.applyCNOT();
      }, 50);
    },

    applyCNOT() {
    
      const plainState = structuredClone(
        Vue.toRaw(this.state)
      );
    
      this.worker.postMessage({
        type: 'cnot',
        state: plainState
      });
    },
    
    applyGate(gate, targetQubit) {
    
      const plainState = structuredClone(
        Vue.toRaw(this.state)
      );
    
      this.worker.postMessage({
        type: 'gate',
        gate,
        targetQubit,
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
          { re: 0, im: 0 },
          { re: 0, im: 0 },
          { re: 0, im: 0 }
        ];
      
        this.measurement = '-';
      
        await window.db.saveState(this.state);
      
        this.draw();

    },

    draw() {
    
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
    
      const W = canvas.width;
      const H = canvas.height;
    
      ctx.clearRect(0, 0, W, H);
    
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
    
      const labels = [
        '|00⟩',
        '|01⟩',
        '|10⟩',
        '|11⟩'
      ];
    
      const probs = this.probabilities;
    
      const barWidth = 60;
      const spacing = 30;
    
      const totalWidth =
        4 * barWidth +
        3 * spacing;
    
      const startX =
        (W - totalWidth) / 2;
    
      for (let i = 0; i < 4; i++) {
    
        const x =
          startX +
          i * (barWidth + spacing);
    
        const h = probs[i] * 250;
    
        ctx.fillStyle = '#2f6fed';
    
        ctx.fillRect(
          x,
          H - h - 60,
          barWidth,
          h
        );
    
        ctx.fillStyle = 'white';
    
        ctx.fillText(
          labels[i],
          x,
          H - 30
        );
    
        ctx.fillText(
          probs[i].toFixed(3),
          x,
          H - h - 70
        );
      }
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
          This simulator demonstrates the basic behavior of 2 quantum bits (qubits).
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
