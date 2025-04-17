"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface PdfUploaderProps {
  onFilesAdded: (files: File[]) => void
}

export function PdfUploader({ onFilesAdded }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === "application/pdf")

    if (droppedFiles.length > 0) {
      onFilesAdded(droppedFiles)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter((file) => file.type === "application/pdf")

      if (selectedFiles.length > 0) {
        onFilesAdded(selectedFiles)
      }

      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div>
      <div
        className={`cyber-dropzone ${isDragging ? "cyber-dropzone-active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-yellow-400 mb-2 font-mono">ARRASTRA Y SUELTA ARCHIVOS PDF</p>
        <div className="cyber-separator">
          <span>O</span>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" multiple className="hidden" />
        <Button onClick={handleButtonClick} variant="outline" className="cyber-button-alt mt-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-white" />
          <span>SELECCIONAR ARCHIVOS</span>
        </Button>
      </div>
      <div className="mt-4">
        <p className="text-xs text-red-500/70 font-mono">* SOLO SE ACEPTAN ARCHIVOS PDF</p>
      </div>
    </div>
  )
}
