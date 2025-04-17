"use client"

import { useState, useCallback } from "react"
import { PdfUploader } from "@/components/pdf-uploader"
import { PdfList } from "@/components/pdf-list"
import { Button } from "@/components/ui/button"
import { mergePdfs } from "@/lib/pdf-utils"
import { Cpu, FileDown, FilePlus2, Layers, PresentationIcon, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PptToPdfConverter } from "@/components/ppt-to-pdf-converter"
import { CyberGlitch } from "@/components/cyber-glitch"

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleReorder = useCallback((reorderedFiles: File[]) => {
    setFiles(reorderedFiles)
  }, [])

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleMerge = async () => {
    if (files.length < 2) return

    setIsProcessing(true)
    try {
      const mergedPdf = await mergePdfs(files)

      // Create a download link
      const url = URL.createObjectURL(mergedPdf)
      const link = document.createElement("a")
      link.href = url
      link.download = "merged-document.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error merging PDFs:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white cyberpunk-bg">
      <div className="scanlines"></div>
      <div className="noise"></div>
      <div className="vignette"></div>

      {/* Cyberpunk Header */}
      <div className="relative overflow-hidden border-b border-yellow-500/30">
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-cyan-900/20"></div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="flex flex-col items-center md:items-start">
            <div className="cyber-header mb-2 relative">
              <CyberGlitch text="CYBER//PDF" />
            </div>

            <div className="cyber-box w-full max-w-md mt-4 mb-6">
              <div className="cyber-box-header">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>SYSTEM STATUS: ONLINE</span>
              </div>
              <p className="text-cyan-400 text-sm px-4 py-2 border-t border-cyan-500/30 bg-cyan-900/10">
                DOCUMENT FUSION SYSTEM v2.0.77 // READY FOR INPUT
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="merge" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-transparent">
            <TabsTrigger value="merge" className="cyber-tab data-[state=active]:cyber-tab-active">
              <Layers className="h-4 w-4 mr-2" />
              UNIR PDFs
            </TabsTrigger>
            <TabsTrigger value="convert" className="cyber-tab data-[state=active]:cyber-tab-active">
              <PresentationIcon className="h-4 w-4 mr-2" />
              PPT A PDF
            </TabsTrigger>
          </TabsList>

          <TabsContent value="merge">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Section */}
              <div className="lg:col-span-1 cyber-panel">
                <div className="cyber-panel-header">
                  <Cpu className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-xl font-bold text-yellow-500">CARGAR ARCHIVOS</h2>
                </div>
                <PdfUploader onFilesAdded={handleFilesAdded} />

                <div className="mt-8">
                  <Button
                    onClick={handleMerge}
                    disabled={files.length < 2 || isProcessing}
                    className="w-full cyber-button"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-pulse">PROCESANDO...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FileDown className="h-5 w-5" />
                        UNIR Y DESCARGAR
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* PDF List Section */}
              <div className="lg:col-span-2 cyber-panel">
                <div className="cyber-panel-header">
                  <FilePlus2 className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-xl font-bold text-cyan-400">ORDENAR ARCHIVOS</h2>
                </div>
                <PdfList files={files} onReorder={handleReorder} onRemove={handleRemove} />

                {files.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-yellow-900/50 rounded-lg bg-yellow-900/5">
                    <p className="text-yellow-500/70">CARGA ARCHIVOS PDF PARA COMENZAR</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="convert">
            <PptToPdfConverter />
          </TabsContent>
        </Tabs>
      </div>

      {/* Cyberpunk Footer */}
      <footer className="mt-16 border-t border-red-500/20 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center text-xs text-yellow-500/70">
              <p>
                <span className="text-red-500">[</span> CYBER//PDF © {new Date().getFullYear()}{" "}
                <span className="text-red-500">]</span>
                <span className="ml-2 text-cyan-500/70">// NIGHT CITY DOCUMENT SYSTEMS</span>
              </p>
              <p className="mt-1">
                <span className="text-pink-500/80">crafted by</span>{" "}
                <a
                  href="https://github.com/ImaaValenzuela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  ImaaValenzuela
                </a>
              </p>
            </div>
            <p className="text-xs text-red-500/70 mt-2 md:mt-0">
              &lt;UNAUTHORIZED ACCESS WILL BE TRACED AND PROSECUTED&gt;
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
