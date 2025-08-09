# Psicóloga Em Outra Dimensão - Astral Chart Generator

## Overview

This is a web application that generates astral charts (birth charts) in SVG format along with detailed PDF reports. The application allows users to input their birth data (name, date, time, and location) and generates a complete astrological reading without requiring user registration. Built as a full-stack application with React frontend and Express backend, it integrates with the RapidAPI Astrologer service to calculate planetary positions and generate accurate astrological charts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Built with React 18 using TypeScript for type safety
- **UI Framework**: Utilizes shadcn/ui components built on top of Radix UI primitives
- **Styling**: TailwindCSS with custom CSS variables for theming and responsive design
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Express.js Server**: RESTful API server handling chart generation requests
- **Storage Layer**: Abstracted storage interface with in-memory implementation (MemStorage class)
- **API Integration**: Server-side integration with RapidAPI Astrologer service for astrological calculations
- **File Generation**: SVG chart rendering and PDF report generation capabilities
- **Middleware**: Request logging, JSON parsing, and error handling

### Data Storage Solutions
- **Database**: PostgreSQL configured with Drizzle ORM for type-safe database operations
- **Schema Design**: Two main entities - birth_data and astral_chart tables with proper relationships
- **Connection**: Neon Database serverless connection for cloud-based PostgreSQL
- **Migrations**: Drizzle Kit for database schema management and migrations

### Authentication and Authorization
- **No Authentication Required**: Application designed for anonymous usage without user registration
- **Session-less**: Each chart generation is independent, no persistent user sessions

### External Dependencies
- **RapidAPI Astrologer**: Primary service for calculating planetary positions and astrological data
- **Neon Database**: Serverless PostgreSQL database hosting
- **Geocoding Service**: For converting city names to latitude/longitude coordinates (implementation referenced but not fully implemented)
- **PDF Generation**: Server-side PDF creation for detailed astrological reports
- **SVG Rendering**: Custom SVG generation for visual birth chart representation

The architecture follows a clean separation of concerns with the frontend handling user interaction and presentation, while the backend manages data processing, external API integration, and file generation. The application is designed for high performance with sub-5-second chart generation times and aims for 85% completion rate among users.