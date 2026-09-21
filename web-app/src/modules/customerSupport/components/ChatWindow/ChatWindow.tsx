import { useEffect, useRef } from 'react'
import type { SupportAttachment, SupportConversation } from '../../types/customerSupport.types'
import { ChatMessageItem } from '../ChatMessageItem/ChatMessageItem'
import { ChatMessageInput } from '../ChatMessageInput/ChatMessageInput'
import { QuickPrompts } from '../QuickPrompts/QuickPrompts'
import './ChatWindow.css'

interface ChatWindowProps {
  conversation: SupportConversation | null
  isLoading?: boolean
  isSending?: boolean
  onSendMessage: (text: string, attachments?: SupportAttachment[]) => void
}

export const ChatWindow = ({
  conversation,
  isLoading = false,
  isSending = false,
  onSendMessage,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  if (isLoading || !conversation) {
    return (
      <div className="cs-window cs-window--loading">
        <div className="cs-window__skeleton-header" />
        <div className="cs-window__skeleton-body" />
      </div>
    )
  }

  const { executive, messages, applicationRef, dateLabel } = conversation

  return (
    <div className="cs-window">
      {/* Header with Executive Details & Status */}
      <header className="cs-window__header">
        <div className="cs-window__header-left">
          <div
            className="cs-window__avatar"
            style={{ backgroundColor: executive.avatarColor || '#059669' }}
          >
            {executive.avatarInitials}
          </div>
          <div className="cs-window__executive-info">
            <div className="cs-window__name-row">
              <h2 className="cs-window__executive-name">{executive.name}</h2>
              <span
                className={`cs-window__status-pill cs-window__status-pill--${executive.status.toLowerCase()}`}
              >
                ● {executive.status}
              </span>
            </div>
            <div className="cs-window__role-row">
              <span>{executive.role}</span>
              <span className="cs-window__dot-sep">·</span>
              <span className="cs-window__dept">{executive.department}</span>
              {executive.responseTime && (
                <>
                  <span className="cs-window__dot-sep">·</span>
                  <span className="cs-window__resp-time">⚡ {executive.responseTime}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="cs-window__header-right">
          {executive.phone && (
            <a
              href={`tel:${executive.phone.replace(/\s/g, '')}`}
              className="cs-window__quick-btn"
              title={`Call ${executive.name}`}
            >
              📞
            </a>
          )}
          {executive.email && (
            <a
              href={`mailto:${executive.email}`}
              className="cs-window__quick-btn"
              title={`Email ${executive.name}`}
            >
              ✉️
            </a>
          )}
          <span className="cs-window__app-badge" title="Active Application Reference">
            {applicationRef}
          </span>
        </div>
      </header>

      {/* Messages Thread */}
      <div className="cs-window__body">
        {dateLabel && (
          <div className="cs-window__date-divider">
            <span className="cs-window__date-pill">{dateLabel}</span>
          </div>
        )}

        <div className="cs-window__messages-list">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts Suggestions */}
      <QuickPrompts onSelectPrompt={(prompt) => onSendMessage(prompt)} />

      {/* Message Input Bar */}
      <footer className="cs-window__footer">
        <ChatMessageInput
          onSendMessage={onSendMessage}
          disabled={isSending}
          placeholder="Ask a question or upload notice/documents..."
        />
      </footer>
    </div>
  )
}
