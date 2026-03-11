import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, Loader2, Mail, Cloud, File } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { motion, AnimatePresence } from "motion/react";

type UploadState = "idle" | "loading" | "success" | "error";

interface FileUploadResult {
  fileName: string;
  email: string;
  timestamp: string;
}

export function FileUploader() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successResult, setSuccessResult] = useState<FileUploadResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const validExtensions = [".csv", ".xlsx"];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExtension) {
      return { valid: false, error: "Please upload a .csv or .xlsx file" };
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: "File size must be less than 10MB" };
    }

    return { valid: true };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid file");
      setUploadState("error");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setUploadState("idle");
    setErrorMessage("");
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const simulateUpload = async (): Promise<void> => {
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setProgress(i);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload");
      setUploadState("error");
      return;
    }

    if (!email) {
      setErrorMessage("Please enter a recipient email");
      setUploadState("error");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      setUploadState("error");
      return;
    }

    setUploadState("loading");
    setErrorMessage("");

    try {
      await simulateUpload();
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSuccessResult({
        fileName: selectedFile.name,
        email: email,
        timestamp: new Date().toLocaleString(),
      });
      setUploadState("success");

      setTimeout(() => {
        resetForm();
      }, 4000);
    } catch (error) {
      setErrorMessage("Failed to upload file. Please try again.");
      setUploadState("error");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setEmail("");
    setUploadState("idle");
    setErrorMessage("");
    setSuccessResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Cloud className="w-6 h-6" />
                </div>
                <CardTitle className="text-3xl">File Transfer Portal</CardTitle>
              </div>
              <CardDescription className="text-blue-100 mt-2">
                Securely upload spreadsheet files and deliver them via email
              </CardDescription>
            </motion.div>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Drag & Drop Zone */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label className="text-base mb-3 block">Upload File</Label>
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                  ${isDragging 
                    ? "border-blue-500 bg-blue-50 scale-[1.02]" 
                    : selectedFile 
                      ? "border-green-400 bg-green-50" 
                      : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
                  }
                  ${uploadState === "loading" ? "pointer-events-none opacity-60" : ""}
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileSelect}
                  disabled={uploadState === "loading"}
                  className="hidden"
                />

                <AnimatePresence mode="wait">
                  {selectedFile ? (
                    <motion.div
                      key="selected"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="p-4 bg-green-100 rounded-full">
                        <FileSpreadsheet className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="p-4 bg-blue-100 rounded-full">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {isDragging ? "Drop your file here" : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          .CSV or .XLSX files only (Max 10MB)
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Email Input with icon */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Label htmlFor="email" className="text-base">Recipient Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="recipient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={uploadState === "loading"}
                  className="pl-11 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </motion.div>

            {/* Progress Bar */}
            <AnimatePresence>
              {uploadState === "loading" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Uploading file...</span>
                    <span className="font-semibold text-blue-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing and sending to {email}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Alert */}
            <AnimatePresence>
              {uploadState === "error" && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert variant="destructive" className="border-red-300 bg-red-50">
                    <XCircle className="h-5 w-5" />
                    <AlertDescription className="text-red-900 font-medium">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Alert */}
            <AnimatePresence>
              {uploadState === "success" && successResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Alert className="border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertDescription>
                      <div className="font-semibold text-green-900 text-base">
                        Success! File sent successfully
                      </div>
                      <div className="text-sm text-green-800 mt-2">
                        <strong>{successResult.fileName}</strong> has been delivered to{" "}
                        <strong>{successResult.email}</strong>
                      </div>
                      <div className="text-xs text-green-700 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {successResult.timestamp}
                      </div>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3 pt-2"
            >
              {uploadState === "success" || uploadState === "error" ? (
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="w-full h-12 text-base border-2 hover:bg-gray-50"
                >
                  <File className="mr-2 h-5 w-5" />
                  Upload Another File
                </Button>
              ) : (
                <Button
                  onClick={handleUpload}
                  disabled={uploadState === "loading" || !selectedFile || !email}
                  className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadState === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Upload & Send Email
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 px-1"
        >
          <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Supported Formats</h4>
              <p className="text-xs text-gray-600 mt-1">CSV & XLSX files up to 10MB</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Secure Transfer</h4>
              <p className="text-xs text-gray-600 mt-1">Encrypted file delivery</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Instant Delivery</h4>
              <p className="text-xs text-gray-600 mt-1">Files sent immediately</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
