'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  message: string
  type: ToastType
}

type ToastContextValue = {
  toasts: Toast[]
  show: (message: string, type?: ToastType, durationMs?: number) => void
  remove: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const show = useCallback((message: string, type: ToastType = 'info', durationMs = 2200) => {
    const id = Math.random().toString(36).slice(2)
    const toast: Toast = { id, message, type }
    setToasts(prev => [...prev, toast])
    window.setTimeout(() => remove(id), durationMs)
  }, [remove])

  const value = useMemo<ToastContextValue>(() => ({ toasts, show, remove }), [toasts, show, remove])

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}


