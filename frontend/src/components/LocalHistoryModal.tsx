import { useState } from 'react'
import { Download, Trash2, X, Clock, FileCheck, ShieldCheck } from 'lucide-react'
import type { HistoryItem } from '../hooks/useLocalHistory'
import { useI18n } from '../i18n'

interface LocalHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryItem[]
  onClearHistory: () => void
}

function formatBytes(bytes?: number): string {
  if (!bytes) return ''
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function LocalHistoryModal({
  isOpen,
  onClose,
  history,
  onClearHistory,
}: LocalHistoryModalProps) {
  const { t } = useI18n()
  const [now] = useState(() => Date.now())

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#0F172A] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2563EB]" />
              {t.history.title}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              {t.history.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#64748B]">
                <FileCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[#64748B]">{t.history.empty}</p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Privasi aman: 100% ephemeral tanpa database akun</span>
              </div>
            </div>
          ) : (
            history.map((item) => {
              const isExpired = new Date(item.expiresAt).getTime() < now
              return (
                <div
                  key={item.jobId}
                  className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">
                      {item.filename || item.action}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1">
                      <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#1D4ED8]">
                        {item.action}
                      </span>
                      {item.fileSize && <span>{formatBytes(item.fileSize)}</span>}
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div>
                    {isExpired ? (
                      <span className="text-xs text-[#DC2626] font-medium px-2 py-1 bg-red-50 rounded-lg">
                        {t.history.expired}
                      </span>
                    ) : (
                      <a
                        href={item.downloadUrl}
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.history.download}</span>
                      </a>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-[#E2E8F0] bg-slate-50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DC2626] hover:bg-red-50 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.history.clearAll}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
