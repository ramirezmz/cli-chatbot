# CLI Chatbot

A versatile command-line interface chatbot with observability capabilities for querying public APIs.

## Purpose

This CLI Chatbot is designed to:

- Provide a friendly command-line interface for interacting with external APIs.
- Demostrate state machine concepts with user-driven transitions.
- Showcase observability patterns in a Node.js application.
- Offer multiple utility features like weather forecasting, and address lookups.

## What you need to run this project?

Prerequisites:

- Node.js v23.11.0 or later
- Internet connection for API access
- Terminal/command prompt

Environment Setup:

1. Clone the repository:

```bash
git clone https://github.com/ramirezmz/cli-chatbot.git
cd cli-chatbot
```

2. Install dependencies:

```bash
npm install
# or with yarn
yarn install
```

## How to run?

1. Start the application:

```bash
npm start
# or with yarn
yarn start
```

The chat will present a menu where you can:

- Check weather forecast by city name
- Look up address information by ZIP code
- Search for ZIP codes by address in Brazil

## ⚒️ Tools and Technologies

Core Libraries

- Typescript: Strongly-typed Javascript for better development experience.
- Inquirer: Interactive command-line prompts.
- Axios: HTTP client for API requests.
- Chalk-animation: Terminal text styling and animations.

External APIs

- ViaCEP: Brazilian postal code lookup service.
- Open-Meteo: Weather forecast data provider.
- Nominatim: Location search and geocoding API.
- IBGE: Brazilian geographic data API.

Observability Stack

- Winston: Strucutred logging to files and console.
- Perfomance Metrics: Custom implementation for operation timing.
- API Monitoring: Axios interceptors for tracking API health.
- User analytics: Session tracking of command usage.
- Error Handling: Comprehensive error tracking and reporting.

## 🏛️ Project Structure

```bash
src/
├── api/                  # API clients
├── commands/             # CLI command implementations
├── observability/        # Monitoring and logging
│   ├── interceptors.ts   # API call monitoring
│   ├── logger.ts         # Winston logger configuration
│   ├── metrics.ts        # API metrics collection
│   ├── performance.ts    # Function execution timing
│   └── sessions.ts       # User session tracking
├── types/                # TypeScript type definitions
├── utils/                # Helper utilities
└── index.ts              # Application entry point
```

## 🔮 Next Steps

Internationalization (i18n)

- Implement multi-language support.
- Extract all text strings to localization files.
- Add language selection to settings.

API Caching

- Implement local caching for API responses.
- Add TTL (time-to-live) for cached data.
- Develop offline mode using cached data.

Enhanced user experience

- Add autocomplete for location searches
- Implement fuzzy search for partial matches.
- Create command history for quick access to previous queries.
- Add data visualization for weather patterns.

Technical Improvements

- Implement unit tests for API clients and utilities.
- Add CI/CD pipeline for automated testing.
- Create Docker container for easier deployment.
- Expand observability with distributed tracing.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
