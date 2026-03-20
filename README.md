# Concierge AI — The Digital Curator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

**Concierge AI** is a professional-grade, AI-powered interview management and scheduling system. It transforms the complex, manual process of coordinating panels and candidates into a seamless, automated experience with a premium "Digital Curator" aesthetic.

---

## ✨ Key Features

### 📅 Intelligent Scheduling Engine
- **Conflict Resolution**: Automatically detects overlaps between candidate and interviewer availability.
- **Availability Heatmap**: A sophisticated visual density analysis tool to identify optimal windows.
- **Curated Recommendations**: Recommends the top 3 ranked slots based on panel alignment and candidate preference.

### 📊 Dynamic Kanban Pipeline
- **Recruitment Cycle Tracking**: Manage candidates through **New Applications**, **Screening**, and **Interview Scheduled** stages.
- **Real-time Status Sync**: Candidate cards automatically update with confirmed interview details upon scheduling.
- **AI Match Confidence**: Visual badges showing the AI-calculated fit for each role.

### 🔒 Workspace Integration
- **Google Workspace Ready**: Native integration with **Google Calendar** for event creation and **Gmail** for automated invite delivery.
- **Meet Links**: Automatically generates and attaches Google Meet links to all interview invites.
- **OAuth 2.0 Secure Auth**: Enterprise-standard authentication flow.

### 🎨 Premium Recruiter Experience
- **Digital Curator UI**: A sleek, high-fidelity dark mode with glassmorphism, smooth animations, and interactive state management.
- **Workspace Settings**: Centralized management for account profile, team roles, and API configuration.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, CSS Glassmorphism
- **Animations**: Framer Motion
- **APIs**: Google Calendar API, Gmail API, Google Identity Services (OAuth2)
- **Utilities**: `clsx`, `tailwind-merge`, `material-symbols`

---

## ⚙️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/interview-scheduler.git
cd interview-scheduler
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_google_api_key
```

### 3. Google API Setup
- Enable **Google Calendar API** and **Gmail API** in your Google Cloud Console.
- Configure the **OAuth Consent Screen** and add your testing emails as "Test Users".
- Set authorized redirect URIs to `http://localhost:5173`.

### 4. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📸 Screenshots

| Candidate Pipeline | Scheduling Intelligence |
| :---: | :---: |
| ![Pipeline](file:///C:/Users/adrde/.gemini/antigravity/brain/c5b2d4de-5ced-466d-a965-a1feb0ab8934/pipelines_page_initial_1774041973418.png) | ![Heatmap](file:///C:/Users/adrde/.gemini/antigravity/brain/c5b2d4de-5ced-466d-a965-a1feb0ab8934/media__1774041535139.png) |

---

## 📄 License
Distributed under the MIT License.

---
*Created with ❤️ by Concierge AI Development Team*

