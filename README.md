# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

# AI Product Advisor

A React Native application that serves as an intelligent product recommendation system. Users can describe their needs in natural language, and the application leverages Google's Gemini AI to provide personalized product recommendations.

## Architecture

### Component Structure

- `app/`
  - `_layout.tsx`: Root layout configuration using Expo Router
  - `index.tsx`: Main screen component
- `components/`
  - `InputArea.tsx`: Main chat interface with input and message history
  - `RenderMessage.tsx`: Message bubble component for both user queries and AI responses
  - `AnimatedText.tsx`: Animated title component with gradient effect

### Data Flow

1. User inputs query in `InputArea`
2. Query is sent to `aiSuggestProducts` in `services/ai.ts`
3. AI processes query against product catalog
4. Response is rendered in chat interface using `RenderMessage`
5. History is maintained in `InputArea` state

## Key Design Decisions

### 1. UI/UX Choices

- **Chat Interface**: Implemented a familiar chat-like interface for natural interaction
- **Animated Feedback**: Added loading animations and transitions for better user experience
- **Keyboard Handling**: Used KeyboardAvoidingView for smooth input experience
- **Message Bubbles**: Different styles for user queries and AI responses

### 2. Technical Decisions

- **State Management**: Local React state using useState for this scale of application
- **AI Integration**:
  - Primary: Google Gemini API for intelligent product matching
  - Fallback: Local heuristic matching when API is unavailable
- **Performance**:
  - FlatList for efficient message rendering
  - Optimized re-renders with proper component structure

### 3. Error Handling

- Graceful fallback to local search when AI API fails
- Clear error messages in the UI
- Loading states for better user feedback

## File Structure

```
ProductAdvisor/
├── app/                    # Expo Router setup
│   ├── _layout.tsx        # Router configuration
│   └── index.tsx          # Main screen
├── components/            # React components
│   ├── InputArea.tsx      # Main chat interface
│   ├── RenderMessage.tsx  # Message display
│   └── AnimatedText.tsx   # Animated components
├── services/             # Business logic
│   └── ai.ts            # AI service integration
├── data/                # Data layer
│   └── product_catalog.ts # Product database
└── .env                 # Environment variables
```

## Technical Stack

- React Native with Expo
- Google Gemini AI API
- React Native Reanimated for animations
- TypeScript for type safety

## Features

- Natural language product queries
- AI-powered recommendations
- Real-time chat interface
- Animated loading states
- Graceful error handling
- Local fallback search

## Future Improvements

1. Add product images and detailed views
2. Implement user preferences storage
3. Add filtering and sorting options
4. Enhance AI prompt engineering
5. Add product categories navigation

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Add your Gemini API key to `.env`:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_api_key
   ```
4. Run the app: `npx expo start`

