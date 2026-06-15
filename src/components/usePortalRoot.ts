import { useEffect, useState } from 'react'

/** Resolves an overlay portal target after the frame has mounted. */
export function usePortalRoot(id = 'phone-overlay-root'): HTMLElement | null {
  const [node, setNode] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setNode(document.getElementById(id))
  }, [id])
  return node
}
