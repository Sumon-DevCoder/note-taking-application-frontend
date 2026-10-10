# Secure Note-Taking UI (Frontend)

This is the frontend application for the Secure Note-Taking project, built with **Next.js 15, React 19, and Tailwind CSS**. It features a stunning, modern **Glassmorphism** dark-mode design, prioritizing a premium user experience while maintaining seamless integration with the backend API.

## ✨ Key Features
- **Modern UI/UX**: Premium glassmorphism aesthetics, responsive grids, and smooth micro-interactions.
- **Rich Text Editing**: Integrated `react-quill-new` for full rich-text note creation (Bold, Italic, Code Blocks, etc.), fully compatible with React 19.
- **Role-Based Rendering**: UI adapts based on the logged-in user's role (Admin badges vs. User badges).
- **Secure Authentication**: Seamless login/registration flows with JWT securely stored and managed.
- **Centralized API Management**: All backend communication routes through a centralized, token-injected `fetchApi` wrapper.

## 🛠️ Technology Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Editor**: React-Quill-New
- **Language**: TypeScript (TSX)

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- The Backend server must be running (usually on port 5001).

### Installation
1. Clone the repository and navigate to the frontend folder:
   ```bash
   cd note-taking-application-frontend
   npm install
   ```

2. Create a `.env.local` file in the root of the frontend folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```
   *(Note: Adjust the port if your backend is running on a different port).*

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📖 Usage Guide
- **Register/Login**: Start by creating an account. If you need administrative privileges, use the auto-seeded backend credentials.
- **Dashboard**: View your notes presented in a beautiful grid layout.
- **Create Notes**: Use the *+ New Note* button to open the Rich Text Editor modal and compose formatted secrets.
- **Admin View**: If logged in as an Admin, you will see a badge on every note indicating the role of the original author.
