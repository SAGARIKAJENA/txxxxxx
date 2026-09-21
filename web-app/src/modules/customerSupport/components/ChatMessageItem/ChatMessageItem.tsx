import type { SupportMessage } from '../../types/customerSupport.types'
import './ChatMessageItem.css'

interface ChatMessageItemProps {
  message: SupportMessage
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const isUser = message.senderType === 'user'

  return (
    <div
      className={`cs-msg-item ${
        isUser ? 'cs-msg-item--user' : 'cs-msg-item--executive'
      }`}
    >
      <div className="cs-msg-item__bubble">
        {!isUser && (
          <div className="cs-msg-item__sender-name">{message.senderName}</div>
        )}
        <p className="cs-msg-item__text">{message.text}</p>

        {message.attachments && message.attachments.length > 0 && (
          <div className="cs-msg-item__attachments">
            {message.attachments.map((file) => (
              <div key={file.id} className="cs-msg-item__attachment-file">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cs-msg-item__attachment-icon"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="cs-msg-item__attachment-name">{file.name}</span>
                <span className="cs-msg-item__attachment-size">{file.size}</span>
              </div>
            ))}
          </div>
        )}

        <div className="cs-msg-item__meta">
          <span className="cs-msg-item__time">{message.formattedTime}</span>
          {isUser && message.status && (
            <span className="cs-msg-item__status" title={message.status}>
              {message.status === 'read' ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
