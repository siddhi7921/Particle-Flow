# 🌌 Particle-Flow

**Particle-Flow** is a real-time, gesture-driven interactive particle system built with modern frontend technologies.
It uses **AI-based gesture analysis** and **dynamic particle themes** to create visually engaging 3D particle effects that respond to user interaction.

This project is designed as an experimental, extensible foundation for **interactive visual experiences**, AI-assisted interfaces, and creative coding projects.

---

## ✨ Features

* 🎥 **Gesture-based interaction**

  * Real-time gesture analysis using **Google GenAI**
* 🎆 **Dynamic particle system**

  * Smooth particle animations and transformations
* 🎨 **Multiple particle themes**

  * Hearts
  * Flowers
  * Saturn / Ring shapes
  * Fireworks
  * Abstract particle flows
* ⚙️ **Config-driven architecture**

  * Easy theme switching via enums and configs
* 🧩 **Modular & scalable codebase**

  * Clean separation of components, services, and types

---

## 🛠️ Tech Stack

* **React / TypeScript**
* **Particle Engine (custom)**
* **Gesture Analysis Service (Google GenAI)**
* **Modern component-based architecture**

---

## 📁 Project Structure

```
Particle-Flow/
│
├── components/
│   └── ParticleEngine.tsx      # Core particle rendering logic
│
├── services/
│   └── gestureAnalysis.ts      # AI-based gesture detection
│
├── types.ts                    # ParticleTheme enum & ParticleConfig interface
│
├── App.tsx                     # Main application logic
├── index.tsx                   # React app bootstrap
├── index.html                  # Base HTML template
├── metadata.json               # Project metadata
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/siddhi7921/Particle-Flow.git
cd Particle-Flow
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the App

```bash
npm start
```

---

## 🧠 Particle Themes

Particle behavior is controlled using the `ParticleTheme` enum:

* `HEART`
* `FLOWER`
* `SATURN`
* `FIREWORK`
* `ABSTRACT`

Each theme is configurable via the `ParticleConfig` interface, making it easy to add new visual styles.

---

## 📌 Use Cases

* Interactive AI-powered UIs
* Creative coding & generative art
* Gesture-controlled applications
* Portfolio / experimental projects
* Future mobile or web visualization apps

---

## 🔮 Future Enhancements

* 📱 Mobile optimization
* 🖐 Advanced gesture recognition
* 🎙 Voice-controlled particle modes
* 🌐 WebGL / Three.js rendering backend
* 🚀 Deployment-ready builds

---

## 👤 Author

**Siddhinath Chakraborty**
GitHub: [@siddhi7921](https://github.com/siddhi7921)

---

## ⭐ Support

If you like this project:

* ⭐ Star the repository
* 🍴 Fork it
* 🧠 Share ideas or improvements

---

> *Particle-Flow is a creative exploration of AI, interaction, and visual computing.*
