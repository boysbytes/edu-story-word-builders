# Story Word Builders

This chatbot is used in Project B of AI Toolkit for Students.

The chatbot is for Malaysian Year 1-4 students learning English reading comprehension. Students choose words by category (naming, action, describing) and watch as their choices create a unique story powered by AI.

Vercel page: https://vercel.com/boysbytes-projects/edu-story-word-builders

## Features

- 🤖 **Interactive Chatbot**: Friendly chatbot guides students through word selection
- 📚 **Educational Focus**: Teaches naming words, action words, and describing words
- 🎨 **Story Generation**: AI-powered story creation using student's word choices
- 🔄 **Story Remix**: Students can modify words to create new story versions
- 📱 **Mobile-Friendly**: Designed for tablets and mobile devices
- ♿ **Accessible**: ARIA labels, keyboard navigation, high contrast
- 🌏 **Malaysian Context**: Culturally relevant for Malaysian students

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom animations
- **Deployment**: Vercel (static site + serverless functions)
- **AI**: Google Gemini Pro API

## Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd edu-story-word-builders
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file:
   ```env
   GENERATIVE_API_KEY=your_gemini_api_key_here
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment to Vercel

### Automatic Deployment (Recommended)

1. **Connect to Vercel:**
   - Push your code to GitHub
   - Connect your GitHub repository to Vercel
   - Vercel will auto-detect the Vite framework

2. **Configure Environment Variable:**
   - In Vercel dashboard: Project → Settings → Environment Variables
   - Add: `GENERATIVE_API_KEY` = `your_gemini_api_key_here`
   - Apply to: Production, Preview, and Development

3. **Deploy:**
   - Push to main branch triggers automatic deployment
   - Vercel builds and deploys in ~2 minutes

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Iframe Embedding

The application is configured to allow iframe embedding from any domain. When embedding this educational chatbot, use the following recommended settings:

### Recommended Iframe Configuration
```html
<iframe 
  src="https://your-app-url.vercel.app" 
  width="100%" 
  height="600px" 
  frameborder="0"
  scrolling="auto">
</iframe>
```

### Height Considerations
- **Recommended Height**: 600px
- **Why 600px**: Accommodates the sticky header (~80-100px) plus several chat interactions before requiring scroll
- **Dynamic Content**: The chat interface grows vertically as students progress through 9 word selection questions + story generation
- **Auto-scroll**: The app automatically scrolls to show the latest content within the iframe

### Alternative Approaches
- **Dynamic Height**: For automatic iframe resizing, implement postMessage communication from the app to the parent page
- **Fixed Height**: For controlled environments, 700-800px may accommodate complete conversations without scrolling
- **Responsive Design**: The app adapts well to various iframe heights while maintaining usability

## Project Structure

```
├── api/
│   └── generate-story.js     # Serverless function for AI story generation
├── src/
│   ├── components/
│   │   └── StoryBuilderChatbot.jsx  # Main chatbot component
│   ├── App.jsx               # Root component
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind imports
├── public/                   # Static assets
├── .github/
│   └── copilot-instructions.md  # AI development guidelines
├── UI_DESIGN_SYSTEM.md      # Complete UI design system
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
├── vercel.json               # Vercel deployment config
└── vite.config.js            # Vite configuration
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GENERATIVE_API_KEY` | Google Gemini API key | Yes (server-side only) |

## API Usage

The app uses Google Gemini Pro for story generation:

- **Endpoint**: `/api/generate-story`
- **Method**: POST
- **Body**: `{ "prompt": "story generation prompt" }`
- **Response**: `{ "story": "generated story text" }`

## Educational Design

### Target Audience
- **Age**: 6-10 years (Malaysian Year 1-4)
- **Subject**: English reading comprehension
- **Focus**: Word categorization and sentence structure

### Learning Objectives
- Identify naming words (nouns)
- Identify action words (verbs)  
- Identify describing words (adjectives)
- Understand sentence structure
- Build vocabulary through context

### UI/UX Features
- Large touch targets (72px minimum)
- High contrast colors
- Emoji-based visual cues
- Progress indicators
- Positive reinforcement language
- Auto-scroll for mobile devices

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This project follows the UI Design System documented in `UI_DESIGN_SYSTEM.md`. Please refer to that file for:

- Color palette and gradients
- Typography specifications
- Component patterns
- Animation guidelines
- Accessibility requirements

## License

MIT License - See LICENSE file for details.

## Support

For technical issues or educational feedback, please open an issue in the GitHub repository.