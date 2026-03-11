import { FileUploader } from "./components/FileUploader";

export default function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <FileUploader />
    </div>
  );
}