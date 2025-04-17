"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileDown, AlertCircle, CheckCircle2, PresentationIcon, Zap, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { convertPptToPdf } from "@/lib/ppt-utils"

export function PptToPdfConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setSuccess(false)

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]

      // Check if file is a PowerPoint file
      if (
        selectedFile.type === "application/vnd.ms-powerpoint" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        setFile(selectedFile)
      } else {
        setError("ERROR: FORMATO NO VÁLIDO. SELECCIONA UN ARCHIVO .PPT O .PPTX")
      }

      // Reset the input
      e.target.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]

      // Check if file is a PowerPoint file
      if (
        droppedFile.type === "application/vnd.ms-powerpoint" ||
        droppedFile.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        setFile(droppedFile)
      } else {
        setError("ERROR: FORMATO NO VÁLIDO. SELECCIONA UN ARCHIVO .PPT O .PPTX")
      }
    }
  }

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress < 90 ? newProgress : prev
        })
      }, 300)

      // Convert PPT to PDF
      const pdfBlob = await convertPptToPdf(file, (p) => {
        setProgress(p * 100)
      })

      clearInterval(progressInterval)
      setProgress(100)

      // Create a download link
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${file.name.split(".").slice(0, -1).join(".")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setSuccess(true)
    } catch (err) {
      setError("ERROR DE CONVERSIÓN: ARCHIVO CORRUPTO O NO COMPATIBLE")
      console.error("Conversion error:", err)
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="cyber-panel">
        <div className="cyber-panel-header">
          <PresentationIcon className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-bold text-yellow-500">CONVERTIR PPT A PDF</h2>
        </div>

        <div className="cyber-dropzone" onDragOver={handleDragOver} onDrop={handleDrop}>
          <Upload className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <p className="text-yellow-400 mb-2 font-mono">ARRASTRA Y SUELTA UN ARCHIVO POWERPOINT</p>
          <div className="cyber-separator">
            <span>O</span>
          </div>
          <input
            type="file"
            id="ppt-file"
            onChange={handleFileChange}
            accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            className="hidden"
          />
          <Button
            onClick={() => document.getElementById("ppt-file")?.click()}
            variant="outline"
            className="cyber-button-alt mt-4 flex items-center gap-2"
          >
            <Upload className="h-5 w-5 text-white" />
            <span>SELECCIONAR ARCHIVO</span>
          </Button>
        </div>

        <div className="mt-4">
          <p className="text-xs text-red-500/70 font-mono">* SOLO SE ACEPTAN ARCHIVOS POWERPOINT (.PPT, .PPTX)</p>
        </div>
      </div>

      <div className="cyber-panel">
        <div className="cyber-panel-header">
          <FileDown className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-400">ARCHIVO A CONVERTIR</h2>
        </div>

        {file ? (
          <div className="space-y-4">
            <div className="cyber-list-item">
              <div className="flex items-center flex-1">
                <div className="cyber-icon-container mr-3">
                  <PresentationIcon className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-mono font-medium truncate">{file.name}</p>
                  <p className="text-xs text-cyan-500/70 font-mono">
                    {file.size < 1024
                      ? `${file.size} bytes`
                      : file.size < 1048576
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / 1048576).toFixed(1)} MB`}
                  </p>
                </div>
              </div>
              <div className="cyber-badge">
                <Shield className="h-3 w-3 mr-1" />
                PPT
              </div>
            </div>

            {isConverting && (
              <div className="space-y-2">
                <div className="cyber-progress-container">
                  <Progress value={progress} className="h-2 bg-black" indicatorClassName="cyber-progress-indicator" />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-cyan-400 font-mono">CONVIRTIENDO...</p>
                  <p className="text-xs text-yellow-500 font-mono">{Math.round(progress)}%</p>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="cyber-alert-error">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>ERROR</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="cyber-alert-success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>ÉXITO</AlertTitle>
                <AlertDescription>ARCHIVO CONVERTIDO Y DESCARGADO CORRECTAMENTE.</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleConvert} disabled={isConverting} className="w-full cyber-button">
              {isConverting ? (
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5 animate-pulse" />
                  <span>CONVIRTIENDO...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FileDown className="h-5 w-5" />
                  CONVERTIR A PDF
                </span>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-yellow-900/50 rounded-lg bg-yellow-900/5">
            <p className="text-yellow-500/70 font-mono">SELECCIONA UN ARCHIVO POWERPOINT PARA COMENZAR</p>
          </div>
        )}
      </div>
    </div>
  )
}
