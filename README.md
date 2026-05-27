# 2 Qubits Quantum Simulator

A minimal client-side quantum computer simulator built with modern browser technologies.

The application demonstrates the fundamental behavior of a 2 qubits quantum computer directly inside the browser without requiring any backend server.

The simulator now includes a Probability Bars to show probabilities for: |00⟩, |01⟩, |10⟩, and |11⟩.

## Live Demo

- Demo: https://bowo-prasetyo.github.io/quantum-2qubits/
- Repository: https://github.com/bowo-prasetyo/quantum-2qubits/

---

## Features

- Vue 3 CDN architecture
- Vue Router multi-page navigation
- Web Worker quantum computation
- True Bloch sphere rendering
- HTML Canvas visualization
- IndexedDB persistence
- GitHub Pages compatible
- Client-only application
- Educational user manual
- Beginner-friendly quantum explanations
- Quantum state persistence across browser refreshes
- Real-time quantum state visualization
- Bell states
- CNOT gate
- Entanglement
- Probability visualization


---

## Supported Quantum Gates

The simulator currently supports the common single-qubit gates:

| Gate | Name | Description |
|---|---|---|
| I | Identity Gate | Leaves the qubit unchanged |
| H | Hadamard Gate | Creates quantum superposition |
| X | Pauli-X Gate | Quantum NOT gate |
| Y | Pauli-Y Gate | Quantum rotation using imaginary phase |
| Z | Pauli-Z Gate | Quantum phase flip |
| S | Phase Gate | 90° quantum phase shift |
| T | π/8 Gate | 45° quantum phase shift |

---

## Bloch Sphere Visualization

The simulator visualizes the qubit using a Bloch sphere representation.

The Bloch sphere provides a geometric interpretation of a single qubit state:

- North pole = |0⟩
- South pole = |1⟩
- Surface points = quantum superpositions
- Rotations = quantum gate operations

The visualization now shows:

- Quantum phase
- Complex amplitudes
- State vector direction
- Gate rotations
- Superposition geometry
- Phase-sensitive transformations

This makes phase gates such as:

- Pauli-Z
- Phase (S)
- π/8 (T)

visually observable through Bloch sphere rotations.

---

## Quantum Concepts Demonstrated

The simulator demonstrates:

- Qubit state representation
- Superposition
- Quantum phase
- Quantum measurement
- Wavefunction collapse
- Reversible quantum operations
- Complex-number amplitudes
- Probability amplitudes
- Quantum gate transformations
- Bloch sphere geometry
- Phase rotations
- Geometric quantum state visualization

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
quantum-1qubit/
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

## Quantum State Representation

The qubit state is represented as:

```text
|ψ⟩ = α|0⟩ + β|1⟩
```

Where:

- α and β are complex probability amplitudes
- The total probability must equal 1

Normalization rule:

```text
|α|² + |β|² = 1
```

---

## Bloch Sphere Mathematics

A single qubit can also be represented geometrically as:

```text
|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩
```

Where:

- θ controls vertical position on the Bloch sphere
- φ controls quantum phase rotation

The simulator converts the quantum state into Bloch sphere coordinates:

```text
x = sin(θ) cos(φ)
y = sin(θ) sin(φ)
z = cos(θ)
```

These coordinates are projected onto the HTML Canvas renderer.

---

## Architecture

### Main Thread

Responsible for:

- Vue UI rendering
- Bloch sphere rendering
- Canvas visualization
- Router navigation
- IndexedDB persistence
- User interaction

### Web Worker

Responsible for:

- Quantum gate computation
- Matrix-vector multiplication
- Quantum measurement
- State collapse

This separation keeps the UI responsive while performing quantum calculations.

---

## Persistence

The simulator automatically saves the latest qubit state using IndexedDB.

Refreshing the browser restores the previous quantum state automatically.

---

## Educational Use Cases

The included User Manual demonstrates:

1. Classical bit flipping
2. Quantum superposition
3. Quantum collapse
4. Double Hadamard reversibility
5. Quantum phase manipulation
6. Identity operations
7. Complex quantum rotation
8. 90° phase shifting
9. π/8 fine phase control
10. Browser persistence

---

## Future Improvements

Possible future enhancements:

- Animated gate transitions
- Interactive camera rotation
- Full 3D WebGL Bloch sphere
- Multi-qubit simulation
- Entanglement visualization
- Quantum circuit editor
- Quantum Fourier Transform
- Bell state demonstrations
- WebGPU acceleration
- WASM math backend
- OPFS binary snapshots
- Noise and decoherence simulation
- Probability histograms
- Quantum algorithm playground

---

## License

MIT License

## Assisted By

[ChatGPT](https://chatgpt.com)
