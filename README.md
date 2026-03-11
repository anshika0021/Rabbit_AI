The Sales Insight Automator
This is a **File Upload Single Page Application (SPA)** built to demonstrate AI-generated sales summaries from CSV/XLSX files. 
The app allows users to:
- Upload CSV or Excel files
- Generate a professional sales summary
- "Send" the summary to a provided email (dummy simulation)
## Live Frontend Demo
Frontend deployed on Vercel: [https://rabbitaianshika.vercel.app](https://rabbitaianshika.vercel.app)
## Folder Structure

Rabbit_AI/
├─ frontend/       ← React/Vite SPA
│   ├─ src/
│   │   ├─ App.tsx
│   │   ├─ main.tsx
│   │   ├─ components/ (UploadForm.tsx)
│   │   └─ assets/
│   ├─ index.html
│   ├─ package.json
│   ├─ vite.config.ts
│   └─ tsconfig.json
├─ backend/       
├─ README.md
├─ .gitignore
└─ .env.example



## Run Locally

1. Navigate to frontend folder:
```bash
cd frontend
npm run dev
