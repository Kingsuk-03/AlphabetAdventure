# 🌈 Alphabet Adventure

> An interactive 3D alphabet learning game for kids ages 2–6. Press any letter and watch a detailed 3D friend pop into view, hear its sound, learn a fun fact, and collect achievements along the way.

---

## ✨ Features

### 🎨 26 Detailed 3D Models
Every letter A–Z has its own hand-crafted 3D model with organic shapes, realistic materials, and charming details — whiskers on the cat, stitching on the ball, ice blocks on the igloo, a penguin friend, fret markers on the guitar, and many more.

### 🔊 Multi-Stage Audio Learning
Each letter plays a four-stage audio sequence:
1. **Letter name** — "A"
2. **Phonetic sound** — "ah"
3. **Word** — "Apple"
4. **Full phrase** — "A is for Apple"
5. **Object sound** — a characteristic sound effect (meow, roar, chime, etc.)

### 🎯 Category Filter
Filter letters by category: **Animals**, **Food**, **Music**, **Nature**, or **Things**. Click a category to instantly jump to its first letter.

### 🧠 Quiz Mode
Test your letter knowledge! Match the 3D object to its starting letter. Track your score and build up streaks.

### ❤️ Favorites
Heart any letter to save it to your favorites collection.

### 🏆 Achievements
Unlock 10 different achievements as you progress:
- First Discovery, Getting Started, On a Roll, Halfway Hero, Almost There, Alphabet Master
- Animal Friend, Little Foodie, Music Maker, Nature Explorer

### 🎮 Interactive Controls
- **Drag** the 3D scene to rotate
- **Scroll** to zoom in/out
- **Keyboard A–Z** to select letters
- **Spacebar** for a surprise random letter
- **Escape** to exit quiz or close modals

### 🌓 Day/Night Theme
Toggle between light and dark modes.

### 🎊 Celebration Effects
Confetti bursts, achievement toasts, and a grand finale when you unlock all 26 letters.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18 or newer ([download](https://nodejs.org))
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/alphabet-adventure.git
cd alphabet-adventure

# Install dependencies
npm install
```

### Run Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## 📁 Project Structure

```
alphabet-adventure/
├── public/                  # Static assets
├── src/
│   ├── App.jsx               # Root component
│   ├── AlphabetAdventure.jsx # Main app
│   ├── main.jsx              # React entry point
│   └── index.css             # Global CSS reset
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **Three.js (r128)** | 3D graphics rendering |
| **lucide-react** | Icon library |
| **Web Speech API** | Text-to-speech (letter narration) |
| **Web Audio API** | Synthesized sound effects |
| **Google Fonts** | Fredoka and Nunito typography |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server at `localhost:5173` |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint (if configured) |

---

## 🌐 Deployment

### Deploy to Vercel

The easiest way to deploy is with [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite and configures everything
4. Click **Deploy** — your app is live in about a minute

Every future `git push` to `main` triggers an automatic redeploy.

### Other Platforms

This is a standard Vite + React app and can be deployed anywhere that hosts static sites:

- **Netlify** — drag-and-drop the `dist/` folder or connect your Git repo
- **GitHub Pages** — add `"homepage"` to `package.json` and use `gh-pages`
- **Cloudflare Pages** — connect your Git repo
- **Any static host** — upload the contents of `dist/` after running `npm run build`

---

## 🎨 Customization

### Change the Letters or Words
Edit the `LETTER_DATA` object near the top of `src/AlphabetAdventure.jsx`. Each entry has a `word`, `phonetic`, `fact`, colors, category, emoji, and sound ID.

### Add More Categories
Edit the `CATEGORIES` array. Update `LETTER_DATA.cat` values to match your new category IDs.

### Add More Achievements
Edit the `ACHIEVEMENTS` array. Each achievement has a `check` function that receives the set of unlocked letters and returns `true` when earned.

### Customize the Voice
The app prefers "Samantha" (macOS) → "Google US English" → any en-US voice. To favor a different voice, edit the `pickVoice` function inside the speech setup. On Windows, installing Microsoft's "Aria (Natural)" or "Jenny (Natural)" voices dramatically improves quality.

---

## 🌍 Browser Support

Works in all modern browsers:
- ✅ Chrome / Edge 90+
- ✅ Safari 15+
- ✅ Firefox 88+

**Note:** Speech synthesis quality varies by operating system because the Web Speech API uses your OS's installed voices.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `A`–`Z` | Select a letter |
| `Space` | Surprise me — pick a random letter |
| `Esc` | Exit quiz mode or close a modal |

---

## 🧩 Known Limitations

- **No persistent progress** — favorites, achievements, and unlocked letters reset on page reload. The app uses React state only.
- **Voice depends on the OS** — different operating systems have different built-in voices, so the app sounds different on different devices.
- **Mobile performance** — the 3D scene is demanding; older mobile devices may render at reduced frame rates.

---

## 🤝 Contributing

Contributions welcome! Ideas for improvements:
- More 3D model detail or animations
- Additional languages (Spanish, French, Hindi, etc.)
- Recorded audio instead of Web Speech API
- LocalStorage / cloud sync for persistent progress
- Accessibility improvements (screen reader support, keyboard focus indicators)

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-idea`)
3. Commit your changes (`git commit -m 'Add amazing idea'`)
4. Push to the branch (`git push origin feature/amazing-idea`)
5. Open a Pull Request

---

## 🙏 Credits

- Built with [React](https://react.dev) and [Three.js](https://threejs.org)
- Icons by [Lucide](https://lucide.dev)
- Fonts: [Fredoka](https://fonts.google.com/specimen/Fredoka) and [Nunito](https://fonts.google.com/specimen/Nunito) from Google Fonts
- Made with ❤️ for little learners everywhere

---

<p align="center">
  <strong>Happy learning! 🌟</strong>
</p>
