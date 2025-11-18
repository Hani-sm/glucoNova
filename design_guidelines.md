# GlucoNova Design Guidelines

## Visual Theme & Color System

**Background Treatment:**
- Dark navy gradient from #040815 to #071627
- Subtle floating circular particles (low opacity, teal/light blue) as absolutely positioned divs

**Card Styling:**
- Background: dark bluish gray (#121826 to #1b2436)
- Border radius: 18-24px
- Soft drop shadows: shadow-xl with low opacity
- Glassmorphism for login/register cards: semi-transparent dark (bg-slate-900/70), border border-white/10, backdrop-blur

**Accent Colors:**
- Success/Primary: #16a34a (green)
- Highlights: #10b981 (teal/emerald)
- CTA buttons: #f97316 (orange - e.g., "Log Meal")
- Logout/destructive: red

## Typography

- System font stack or Tailwind's default
- Headings: semibold/bold
- Body text: normal weight
- Color: white/light for dark background

## Layout Structure

**MainLayout (Logged-in):**
- Left sidebar with navigation
- Right content area for dashboard cards and graphs
- Responsive: sidebar collapses/content stacks on smaller screens

**PublicLayout (Login/Register/Role):**
- Dark gradient background with floating dots
- Centered card/panel (width ~420px for forms)

**Sidebar Navigation:**
- Top: round avatar with initials in green circle + "GlucoNova" app name
- User card showing name and status (e.g., "Diabetes in Range: 85%")
- Vertical navigation list with icons: Dashboard, My Details, My Doctors, Glucose, Insulin, Food AI, Medications, Voice AI, Records, Reports, Settings
- Bottom: red "Logout"

## Page Components

**Login Page:**
- Centered glassmorphism card (420px width)
- Title "GlucoNova" (large, white, centered)
- Subtitle in teal/green
- Email/password inputs with labels above
- "Remember me" checkbox + teal "Forgot password?" link
- Green "Sign In" button
- "Don't have an account? Create one" link
- Footer: "© 2025 GlucoNova. All rights reserved."

**Role Selection:**
- Large centered transparent card with blurred background
- Title + subheading
- Two big role cards in row (Patient Account, Healthcare Provider)
- Each card: icon circle on top, badge, title, description, teal link at bottom
- Hover effect: slightly raise and brighten
- "← Back to Login" link below

**Register Page:**
- Similar narrow card as login
- Email, password, confirm password fields
- Role toggle: two side-by-side pill buttons (selected = green fill, other = outlined)
- Info box card with light border
- Green "Create Account" button
- "Already have an account? Log in" link

**Dashboard Page:**
- Welcome section with user name and date overview
- Row of 4 metric cards with: large number, unit, status label (rounded pill in green), icon top-right
- Glucose Trends card with segmented control (6h/24h/7d/30d buttons - selected green, others dark)
- Line chart with light green line, round dots, subtle area fill
- Summary row below chart showing current status with badge
- Voice Assistant card: microphone icon in circle, subtext, orange/green button, recognized text area
- Streak/goals card: progress bars in teal
- Quick Actions grid (2-3 per row): icon on left, title and description

## Spacing & Layout

- Generous padding in cards
- Consistent spacing between sections
- Metric cards span full width in row
- Responsive grid for quick actions
- Voice + Stats cards stack vertically on right or below main content

## Interactive Elements

- Buttons: filled green/orange with appropriate hover states
- Pill buttons for toggles (filled when selected)
- Segmented controls with active state in green
- Cards with subtle hover effects (raise and brighten)
- Progress bars in teal with percentage indicators

## Images

No hero images required - this is a dashboard application focused on data visualization and functionality. All visual impact comes from the dark theme, glassmorphism effects, charts, and metrics.