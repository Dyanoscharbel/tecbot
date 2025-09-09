# TEKBOT Robotics Challenge 2025 - Documentation Site

## Project Overview
This is a static documentation website for the IFRI team's TEKBOT Robotics Challenge 2025 project. The site provides comprehensive documentation covering electronics, IT, and mechanical aspects of their robotics projects across multiple weeks of technical challenges.

## Technical Architecture
- **Frontend**: Static HTML/CSS/JavaScript site with dynamic markdown loading
- **Server**: Python HTTP server serving static files from the docs/ directory
- **Libraries**: 
  - marked.js for markdown parsing
  - mermaid.js for diagram rendering
  - Font Awesome for icons
  - Google Fonts (Inter) for typography

## Project Structure
- `docs/` - Contains all static website files
  - `index.html` - Main HTML file with navigation and layout
  - `styles.css` - Complete styling with light/dark theme support
  - `script.js` - JavaScript for navigation, markdown loading, and interactivity
  - `Documentation/` - All markdown documentation files organized by week
- `server.py` - Python HTTP server with CORS and proper markdown serving
- `replit.md` - Project documentation (this file)

## Development Setup
The site runs on a Python HTTP server configured to:
- Serve files from the docs/ directory
- Handle CORS headers for cross-origin requests
- Disable caching for development
- Serve markdown files with proper content-type headers
- Bind to 0.0.0.0:5000 for Replit environment

## Features
- Responsive design with mobile support
- Dark/light theme toggle
- Dynamic markdown file loading
- Collapsible navigation sections
- Back-to-top functionality
- Mermaid diagram support
- Search functionality (basic)
- Professional documentation layout

## Recent Changes
- Set up Python HTTP server with proper CORS and caching headers
- Configured workflow to serve on port 5000 with webview output
- Tested markdown file loading and site functionality
- All navigation and dynamic content loading working correctly

## User Preferences
- Site optimized for documentation viewing
- No build system required - uses static HTML with dynamic content loading
- Minimal dependencies - only requires Python for local development