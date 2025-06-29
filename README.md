# Resume Parser Frontend

A modern web application built with React, TypeScript, and Ant Design that provides resume parsing and analysis capabilities. The application connects to a WebSocket backend for real-time processing of resumes.

## Features

- **Parse Resume**: Upload and parse PDF resumes with real-time feedback
- **Match Job**: Compare resumes against job descriptions (Coming soon)
- **Analyse Resume**: Detailed analysis of resume content with different parsing modes
- Real-time processing status updates
- Support for multiple parsing modes (OpenAI/Local LLM)
- Responsive design that works on all devices
- WebSocket integration for real-time updates

## Tech Stack

- React
- TypeScript
- Ant Design (UI Framework)
- React Router (Navigation)
- WebSocket (Real-time communication)

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── ParsedResponseCard.tsx
│   └── SelectMode.tsx
├── pages/            # Page components
│   ├── ParseResumeScreen.tsx
│   ├── MatchJobScreen.tsx
│   └── AnalyseResumeScreen.tsx
├── utils/            # Utility functions
│   └── file.ts
└── App.tsx          # Main application component
```

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd resume-parser-fe
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

```bash
   npm run dev
```

4. The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Environment Setup

Make sure you have:

- Node.js (v16 or higher)
- npm (v7 or higher)
- A backend server running at `ws://localhost:8000` (or update the WebSocket URL in the code)

## Features by Screen

### Parse Resume

- Upload PDF resumes
- Choose between OpenAI and Local LLM processing
- Real-time parsing status updates
- Formatted JSON output display

### Match Job (Coming Soon)

- Compare resumes against job descriptions
- Get matching scores and recommendations

### Analyse Resume

- Detailed resume analysis
- Multiple analysis modes
- Structured feedback on resume content

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI Components from [Ant Design](https://ant.design/)
- Routing by [React Router](https://reactrouter.com/)

```

```
