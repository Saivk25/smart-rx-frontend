# Smart Rx Tracker - Complete Project Structure

A modern, production-ready medication tracking application built with React, Vite, Tailwind CSS, and Supabase.

## Project Structure

```
smart-rx-tracker/
├── src/
│   ├── components/
│   │   ├── ProfileForm.jsx         # User onboarding form
│   │   ├── Dashboard.jsx           # Main dashboard with medication grid
│   │   ├── MedCard.jsx             # Detailed medication card view
│   │   ├── AddMedModal.jsx         # Add medication modal with AI safety check
│   │   ├── ScannerModal.jsx        # Prescription scanning with AI extraction
│   │   └── AISafetyBadge.jsx       # Safety status indicator component
│   ├── lib/
│   │   └── supabase.js             # Supabase client configuration
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles with Tailwind directives
├── public/                         # Static assets
├── dist/                           # Production build output
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── eslint.config.js                # ESLint configuration
└── .env                            # Environment variables (Supabase)
```

## Features

### 1. ProfileForm Component
- User onboarding with personal information
- Responsive form validation
- Icons from lucide-react
- Smooth animations and transitions

### 2. Dashboard Component
- Medication grid with status indicators
- Statistics cards (Taken Today, Upcoming)
- Floating action button for adding medications
- Real-time medication status updates

### 3. MedCard Component
- Detailed medication view
- Mark as taken functionality
- AI-powered translation (Spanish, French, Chinese, Arabic)
- Safety status badges
- Instructions display

### 4. AddMedModal Component
- Two-step medication addition process
- AI safety check simulation
- Drug interaction warnings
- Comprehensive form validation
- Medication summary review

### 5. ScannerModal Component
- Camera capture for prescription scanning
- File upload support
- AI-powered text extraction simulation
- Confidence scoring
- Editable extracted data
- Preview of scanned images

### 6. AISafetyBadge Component
- Visual safety status indicators (Safe, Warning, Danger)
- Expandable details panel
- Interaction warnings list
- Contextual messaging

## Design System

### Colors
- **Primary**: #1d4ed8 (Blue 700)
- **Success**: #10b981 (Green 500)
- **Danger**: #ef4444 (Red 500)
- **Background**: Gradient from blue-50 to blue-100

### Typography
- Font: System default
- Headings: Bold, various sizes
- Body: Regular, gray-700

### Components
- Rounded corners: 2xl (16px)
- Shadows: lg and xl for elevation
- Transitions: 200ms duration
- Icons: lucide-react

## Database Schema

### Users Table
- `id` (uuid) - Primary key
- `name` (text) - User's full name
- `email` (text) - Unique email address
- `phone` (text) - Phone number
- `date_of_birth` (date) - Date of birth
- `created_at` (timestamp) - Creation timestamp

### Medications Table
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to users
- `name` (text) - Medication name
- `dosage` (text) - Dosage (e.g., "10mg")
- `frequency` (text) - Frequency (e.g., "Once daily")
- `instructions` (text) - Detailed instructions
- `next_dose` (text) - Next scheduled dose
- `taken` (boolean) - Taken today status
- `safety_status` (text) - 'safe', 'warning', or 'danger'
- `translated_instructions` (text) - Optional translations
- `last_taken_at` (timestamp) - Last taken timestamp
- `created_at` (timestamp) - Creation timestamp

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Dependencies

### Core
- `react` ^18.3.1
- `react-dom` ^18.3.1

### Data & API
- `@supabase/supabase-js` ^2.57.4
- `axios` ^1.13.0

### UI & UX
- `lucide-react` ^0.344.0
- `react-hot-toast` ^2.6.0
- `tailwindcss` ^3.4.1

### Build Tools
- `vite` ^5.4.2
- `@vitejs/plugin-react` ^4.3.1

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Features

1. **User Onboarding**: Seamless profile creation flow
2. **Medication Management**: Add, view, and track medications
3. **Safety Checks**: AI-powered drug interaction warnings
4. **Prescription Scanning**: OCR-based medication data extraction
5. **Multi-language Support**: Translate instructions to 4+ languages
6. **Responsive Design**: Mobile-first, works on all devices
7. **Real-time Updates**: Instant synchronization with Supabase
8. **Toast Notifications**: User-friendly feedback system

## Security

- Row Level Security (RLS) enabled on all tables
- Anonymous user support for MVP (can be restricted later)
- Data isolation per user
- Secure API key management via environment variables

## Performance

- Vite for lightning-fast development
- Lazy loading where appropriate
- Optimized bundle size
- Efficient state management
- Indexed database queries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
