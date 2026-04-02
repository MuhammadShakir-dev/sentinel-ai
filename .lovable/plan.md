

# CyberShield AI — Cybersecurity Platform

## Overview
A dark-themed, cybersecurity-aesthetic web platform with 4 AI-powered security tools, user authentication, and a professional dashboard. All AI analysis will be realistically simulated for polished FYP demonstration.

## Design System
- **Theme**: Dark background (#0a0e1a), neon cyan/green accents, subtle grid/matrix patterns
- **Typography**: Monospace headers (tech feel), clean sans-serif body text
- **Cards**: Glass-morphism style with subtle borders and glow effects
- **Animations**: Scanning/loading effects for AI analysis, pulse animations for threat alerts

## Pages & Features

### 1. Landing Page
- Hero section with animated cybersecurity visuals (shield icon, floating threat icons)
- Platform name, tagline, and feature highlights for each of the 4 tools
- CTA buttons: "Get Started" / "Login"
- Brief stats section (threats detected, users protected — demo numbers)

### 2. Auth Pages (Email & Password)
- Login page with dark theme styling
- Signup page with name, email, password fields
- Managed via Lovable Cloud auth (no external Supabase needed)
- Password reset flow

### 3. Dashboard (Post-Login)
- Sidebar navigation with cybersecurity-styled icons for each tool
- Welcome banner with user's name and quick stats
- 4 tool cards with status indicators and quick-access buttons
- Recent activity feed showing past scans/analyses

### 4. Fake News Detection Tool
- Text input area or URL field for news content
- "Analyze" button triggers simulated AI processing (loading animation with scanning effect)
- Results: credibility score (gauge chart), classification (Real/Fake), confidence %, key indicators highlighted
- History of past analyses in a table

### 5. Phishing Website Detection Tool
- URL input field with "Scan" button
- Simulated analysis showing: SSL check, domain age, suspicious patterns, redirect chains
- Risk score with color-coded severity (Safe/Suspicious/Dangerous)
- Detailed breakdown of detected indicators in expandable cards

### 6. Keylogger Detection Tool
- Simulated system scan interface with progress bar
- List of "detected processes" with risk levels
- Process details: name, behavior type, threat classification
- Toggle to "start monitoring" with live-updating activity log (simulated)

### 7. DDoS Attack Detection Tool
- Real-time network traffic visualization (animated line/area chart with simulated data)
- Traffic stats: requests/sec, bandwidth, connection count
- Alert panel showing detected anomalies with timestamps
- Status indicator: Normal / Warning / Under Attack

### 8. Profile Management
- View/edit profile (name, email, avatar)
- Security settings section
- Scan history across all tools

## Navigation Structure
- **Public**: Landing → Login/Signup
- **Authenticated**: Dashboard → 4 Tools + Profile (sidebar navigation)
- Protected routes redirect to login

## Simulated AI Behavior
- Each tool will have realistic processing delays (1-3 seconds) with animated scanning effects
- Pre-configured response patterns that vary based on input (e.g., certain URLs always flag as phishing)
- Randomized confidence scores within realistic ranges
- Results feel authentic and demonstrate the concept effectively

