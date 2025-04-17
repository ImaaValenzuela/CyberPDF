"use client"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { FileIcon as FilePdf, GripVertical, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState, Ref } from "react"

interface PdfListProps {
  files: File[]
  onReorder: (reorderedFiles: File[]) => void
  onRemove: (index: number) => void
}

export function PdfList({ files, onReorder, onRemove }: PdfListProps) {
  const [items, setItems] = useState<{ file: File; id: string }[]>([])

  useEffect(() => {
    const newItems = files.map((file, index) => ({
      file,
      id: `${file.name}-${file.lastModified}-${index}`,
    }))
    setItems(newItems)
  }, [files])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return
    }

    const newItems = Array.from(items)
    const [movedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, movedItem)

    setItems(newItems)
    onReorder(newItems.map((item) => item.file))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="pdf-list-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="pdf-list" direction="vertical">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef as Ref<HTMLUListElement>}
              className="space-y-3"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`cyber-list-item group ${snapshot.isDragging ? "cyber-list-item-dragging" : ""}`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="mr-3 text-yellow-500 hover:text-cyan-400 cursor-grab"
                      >
                        <GripVertical className="h-5 w-5" />
                      </div>

                      <div className="flex items-center flex-1 min-w-0">
                        <div className="cyber-icon-container mr-3">
                          <FilePdf className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-mono font-medium truncate">{item.file.name}</p>
                          <p className="text-xs text-cyan-500/70 font-mono">{formatFileSize(item.file.size)}</p>
                        </div>
                      </div>

                      <div className="flex items-center ml-2">
                        <div className="cyber-badge">
                          <Shield className="h-3 w-3 mr-1" />
                          {index + 1}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemove(index)}
                          className="ml-2 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
