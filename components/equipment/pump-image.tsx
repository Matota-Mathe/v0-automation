"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ZoomIn } from "lucide-react"

interface PumpImageProps {
  src: string
  alt: string
  title?: string
  description?: string
}

export function PumpImage({ src, alt, title, description }: PumpImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative group">
      <div className="relative h-24 w-full overflow-hidden rounded-md border bg-background">
        <Image src={src || "/placeholder.svg"} alt={alt} fill style={{ objectFit: "contain" }} className="p-2" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsOpen(true)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{title || alt}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="relative h-[400px] w-full">
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              fill
              style={{ objectFit: "contain" }}
              className="p-2"
              quality={100}
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
