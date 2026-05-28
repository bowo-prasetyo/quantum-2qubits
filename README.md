# 2 Qubits Quantum Simulator

A minimal client-side quantum computer simulator built with modern browser technologies.

The application demonstrates the fundamental behavior of a 2-qubit quantum computer directly inside the browser without requiring any backend server.

The simulator supports:

- Single-qubit gates
- Two-qubit operations
- Bell state generation
- Quantum entanglement
- Quantum measurement
- Probability visualization

The application is fully client-side and deployable on GitHub Pages.

---

## Live Demo

- Demo: https://bowo-prasetyo.github.io/quantum-2qubits/
- Repository: https://github.com/bowo-prasetyo/quantum-2qubits/
  
---

## Features

- Vue 3 CDN architecture
- Vue Router multi-page navigation
- Web Worker quantum computation
- HTML Canvas visualization
- IndexedDB persistence
- GitHub Pages compatible
- Client-only application
- Educational user manual
- Beginner-friendly quantum explanations
- Quantum state persistence across browser refreshes
- Real-time probability visualization
- Single-qubit quantum gates
- Two-qubit quantum states
- Bell state generation
- CNOT gate
- Entanglement demonstrations
- Measurement collapse simulation
- Probability bars for:
  - |00⟩
  - |01⟩
  - |10⟩
  - |11⟩

---

## Supported Quantum Gates

### Single-Qubit Gates

| Gate | Name | Description |
|---|---|---|
| I | Identity Gate | Leaves the selected qubit unchanged |
| H | Hadamard Gate | Creates quantum superposition |
| X | Pauli-X Gate | Quantum NOT gate |
| Y | Pauli-Y Gate | Quantum rotation using imaginary phase |
| Z | Pauli-Z Gate | Quantum phase flip |
| S | Phase Gate | 90° quantum phase rotation |
| T | π/8 Gate | 45° quantum phase rotation |

### Two-Qubit Gates

| Gate | Name | Description |
|---|---|---|
| CNOT | Controlled-NOT Gate | Conditionally flips the target qubit |

---

## Quantum State Representation

The simulator represents a 2-qubit quantum system as:

```text
|ψ⟩ = α|00⟩ + β|01⟩ + γ|10⟩ + δ|11⟩
```

Where:

- α, β, γ, and δ are complex probability amplitudes
- The total probability must equal 1

Normalization rule:

```text
|α|² + |β|² + |γ|² + |δ|² = 1
```

---

## Probability Visualization

The simulator visualizes measurement probabilities using probability bars.

The bars represent:

- |00⟩
- |01⟩
- |10⟩
- |11⟩

Taller bars indicate higher probability of measurement.

This visualization helps users understand:

- Superposition
- Probability amplitudes
- Entanglement behavior
- Quantum gate effects
- Measurement collapse

---

## Bell States And Entanglement

The simulator can generate Bell states such as:

```text
(|00⟩ + |11⟩) / √2
```

using:

1. Hadamard gate
2. CNOT gate

This creates quantum entanglement.

Entangled qubits behave as a connected quantum system where measurements become correlated.

Typical Bell-state measurements become:

- |00⟩
- |11⟩

while:

- |01⟩
- |10⟩

rarely appear.

---

## Quantum Concepts Demonstrated

The simulator demonstrates:

- Qubit state representation
- Two-qubit systems
- Superposition
- Quantum phase
- Quantum measurement
- Wavefunction collapse
- Reversible quantum operations
- Complex-number amplitudes
- Probability amplitudes
- Quantum gate transformations
- Bell states
- Entanglement
- Controlled quantum operations
- Conditional logic
- Probability distributions

---

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript ES Modules
- [Vue.js](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
  
### Browser APIs

- Web Workers
- HTML Canvas
- IndexedDB

### Deployment

- [GitHub Pages](https://pages.github.com/)
  
---

## Project Structure

```text
quantum-2qubits/
├── index.html
├── app.js
├── router.js
├── worker.js
├── db.js
├── styles.css
└── README.md
```

---

## Run Locally

Use any static web server.

Example using Python:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

---

## Deploy To GitHub Pages

1. Create a GitHub repository
2. Upload all project files
3. Commit and push to GitHub
4. Open repository settings
5. Go to Pages
6. Select:
   - Branch: `main`
   - Folder: `/root`
7. Save settings

GitHub Pages will automatically deploy the application.

---

## Architecture

### Main Thread

Responsible for:

- Vue UI rendering
- Canvas visualization
- Probability rendering
- Router navigation
- IndexedDB persistence
- User interaction

### Web Worker

Responsible for:

- Quantum gate computation
- Matrix-vector multiplication
- CNOT operations
- Quantum measurement
- State collapse

This separation keeps the UI responsive while performing quantum calculations.

---

## Persistence

The simulator automatically saves the latest quantum state using IndexedDB.

Refreshing the browser restores the previous quantum state automatically.

---

## Educational Use Cases

The included User Manual demonstrates:

1. Classical bit flipping
2. Quantum superposition
3. Quantum collapse
4. Double Hadamard reversibility
5. Quantum phase manipulation
6. Bell state creation
7. Controlled operations using CNOT
8. Probability visualization
9. Entanglement behavior
10. Measurement correlation

---

## Future Improvements

Possible future enhancements:

- Animated gate transitions
- Interactive 3D visualization
- Full WebGL quantum renderer
- 3-qubit simulation
- Entanglement graph visualization
- Quantum circuit editor
- Drag-and-drop gates
- Quantum Fourier Transform
- WebGPU acceleration
- WASM math backend
- OPFS binary snapshots
- Noise and decoherence simulation
- Density matrix visualization
- Quantum algorithm playground

---

## License

MIT License

---

## Assisted By

[ChatGPT](https://chatgpt.com)
