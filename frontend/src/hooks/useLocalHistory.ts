import { useState, useEffect } from 'react'

export interface HistoryItem {
  jobId: string
  accessToken: string
  action: string
  filename: string
  fileSize?: number
  createdAt: string
  expiresAt: string
  downloadUrl: string
}

const STORAGE_KEY = 'convertinaja_local_history'

export function useLocalHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (e) {
      console.error('Failed to sync local history', e)
    }
  }, [history])

  const addHistoryItem = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev.filter((i) => i.jobId !== item.jobId)].slice(0, 20))
  }

  const removeHistoryItem = (jobId: string) => {
    setHistory((prev) => prev.filter((i) => i.jobId !== jobId))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    history,
    addHistoryItem,
    removeHistoryItem,
    clearHistory,
  }
}
