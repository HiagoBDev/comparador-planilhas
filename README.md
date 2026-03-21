# Spreadsheet Comparator

A frontend-only web application designed to compare multiple spreadsheets (.xlsx, .xls, .csv) and manual CPF entries. It processes data client-side, identifying records that are present across all files, missing in certain documents, or duplicated within individual spreadsheets.

## Architecture & Technology Stack

This application was developed using React (v19) with TypeScript and Vite as the build tool. It follows principles of Clean Architecture to ensure separation of concerns, scalability, and maintainability:

- **Domain Layer**: Contains core business rules and entities, such as `Person` and `Comparison`. It strictly defines the data structures and normalization logic (e.g., CPF formatting) without depending on external libraries.
- **Application Layer**: Encapsulates use cases such as the `comparePeople` algorithm. This layer dictates how the data from various sources is cross-referenced to produce actionable comparison results.
- **Infrastructure Layer**: Handles external integrations. For instance, the `spreadsheet-reader` relies on the `xlsx` library to parse physical files and convert them into the internal domain format.
- **Presentation Layer**: The user interface, built with React, React Router for navigation, and TailwindCSS for styling. State management is handled by `zustand`, persisting active comparisons to `localStorage` for continuity across sessions. UI components are structured using `shadcn` concepts and dynamic styling utilities (`clsx`, `tailwind-merge`).

Testing is implemented across all layers using `vitest` and `@testing-library/react` to guarantee coverage and accuracy in data parsing and domain logic validation.

## Key Features

- **Multi-Format Support**: Upload and read multiple formats including `.xlsx`, `.xls`, and `.csv`.
- **Manual Data Input**: Input raw text containing CPFs to be validated and matched against uploaded spreadsheets.
- **Precision Matching**: Data comparison heavily relies on CPF matching to prevent false positives that can arise from name variations or typos.
- **Client-Side Processing**: All file parsing, data extraction, and comparison logic happens entirely in the browser, ensuring data privacy. No data is sent to external servers.
- **Persistent State**: The current working comparison is automatically saved in `localStorage`, preventing data loss on page refresh.
- **Responsive UI & Theming**: Integrated support for dark and light modes, accessible interface elements, and full mobile responsiveness.

## Prerequisites

- Node.js (v18 or higher recommended)
- `npm` (or `pnpm`/`yarn`)

## Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:

```bash
npm install
```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be accessible at the local URL provided in your terminal output (typically `http://localhost:5173`).

## Usage Guide

1. **Upload Data**: On the home page, select and upload the spreadsheets you wish to compare.
2. **Manual Input** (Optional): Provide additional CPFs manually in the designated text area.
3. **Compare**: Submit the data. The application will compute the differences and route you to the comparison results page.
4. **Analyze Results**: Review the categorized output:
   - Records present in all sources.
   - Records missing in one or more sources.
   - Any duplicate entries found within the same spreadsheet.
   - Status of manually inserted CPFs (found or not found).
5. **Start Over**: Simply return to the home page or clear the current context to begin a new comparison.

## Testing

The project uses Vitest for running the test suite. To execute all unit and integration tests:

```bash
npm run test
```
