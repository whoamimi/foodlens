# FoodLens

> AI-powered mobile app for instant food nutrition analysis

An intelligent food analyzer that uses Google Gemini AI to provide comprehensive nutrition insights from photos, gallery images, or text input. Built with React Native and Expo.

---

## Features

- 📸 **Camera Integration** - Capture food photos instantly
- 🖼️ **Gallery Upload** - Analyze existing photos
- ✍️ **Text Input** - Search by food name
- 🤖 **AI-Powered** - Google Gemini AI recognition
- 📊 **Nutrition Facts** - Detailed breakdown of calories, macros, and micronutrients
- 💯 **Health Score** - 0-100 rating system
- 💡 **Smart Insights** - Personalized health recommendations
- 🔄 **Alternatives** - Healthier food suggestions
- 🎨 **Modern UI** - Clean interface with TailwindCSS

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Expo Go](https://expo.dev/client) app on your mobile device
- [Google Gemini API Key](https://ai.google.dev/)

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tejasnasre/foodlens.git
   cd foodlens
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run the app**
   - Scan the QR code with **Expo Go** (Android) or **Camera** app (iOS)
   - Or press `a` for Android emulator / `i` for iOS simulator

---

## Getting Started

### 1. Get Your API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key for app configuration

### 2. Configure the App

On first launch, you'll be prompted to enter your Gemini API key. The key is stored securely on your device.

### 3. Analyze Food

Choose one of three methods:

**📷 Camera**

- Tap "Take Photo"
- Grant camera permissions
- Capture your food
- View instant results

**🖼️ Gallery**

- Tap "Gallery"
- Select a food image
- Wait for AI analysis

**⌨️ Text Input**

- Type the food name
- Tap "Analyze"
- Get nutrition facts

---

## Health Score System

| Score  | Status       | Description                                       |
| ------ | ------------ | ------------------------------------------------- |
| 71-100 | ✅ Healthy   | Rich in nutrients, low in harmful components      |
| 41-70  | ⚠️ Moderate  | Okay in moderation, watch portion sizes           |
| 0-40   | ❌ Unhealthy | High in calories/sugar/fat, consider alternatives |

---

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Styling:** TailwindCSS (NativeWind)
- **AI:** Google Gemini AI
- **Navigation:** Expo Router
- **Storage:** AsyncStorage
- **Image Handling:** Expo Image Picker & Camera

---

## Project Structure

```
foodlens/
├── app/                    # App screens (Expo Router)
│   ├── index.tsx          # Home screen
│   ├── history.tsx        # Analysis history
│   ├── settings.tsx       # App settings
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── services/              # API services (Gemini AI)
├── utils/                 # Helper functions
├── types/                 # TypeScript types
├── config/                # App configuration
└── assets/                # Images and static files
```

---

## Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run on web browser
npm run lint       # Run ESLint checks
```

---

## Troubleshooting

### Failed to Analyze Food

- ✓ Check internet connection
- ✓ Verify API key is valid
- ✓ Ensure image is clear and contains food

### Camera Issues

- ✓ Grant camera permissions in device settings
- ✓ Restart the app
- ✓ Check device camera functionality

### API Key Errors

- ✓ Get a new key from [Google AI Studio](https://ai.google.dev/)
- ✓ Ensure the entire key is copied correctly
- ✓ Check for extra spaces or characters

---

## Privacy & Security

- 🔒 API keys stored locally on device
- 🚫 No external servers except Google Gemini
- 🖼️ Images processed securely and not stored
- 📱 All data remains on your device

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

## Author

**Tejas Nasre**

- GitHub: [@tejasnasre](https://github.com/tejasnasre)

---

## Acknowledgments

Built with [Google Gemini AI](https://ai.google.dev/) ✨
