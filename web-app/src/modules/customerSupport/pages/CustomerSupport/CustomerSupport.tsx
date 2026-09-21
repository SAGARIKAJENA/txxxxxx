import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  ChatWindow,
  ExecutiveList,
  SecurityNotice,
  SupportContactInfo,
} from '../../components'
import { useCustomerSupportChat } from '../../hooks/useCustomerSupportChat'
import { useCustomerSupportExecutives } from '../../hooks/useCustomerSupportExecutives'
import { customerSupportService } from '../../services/customerSupportService'
import type { SupportExecutive } from '../../types/customerSupport.types'
import './CustomerSupport.css'

export const CustomerSupport = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const appId = searchParams.get('appId') || undefined
  const executiveId = searchParams.get('executiveId') || undefined

  const {
    conversation,
    isLoading: isChatLoading,
    isSending,
    sendMessage,
  } = useCustomerSupportChat(appId, executiveId)

  const {
    executives,
  } = useCustomerSupportExecutives()

  const contactMethods = useMemo(() => customerSupportService.getContactMethods(), [])
  const securityNotice = useMemo(() => customerSupportService.getSecurityNotice(), [])

  const handleSelectExecutive = (exec: SupportExecutive) => {
    const nextParams: Record<string, string> = {
      executiveId: exec.id,
    }
    if (exec.assignedAppId) {
      nextParams.appId = exec.assignedAppId
    }
    setSearchParams(nextParams)
  }

  return (
    <div className="cs-view">
      {/* Breadcrumb Navigation */}
      <nav className="cs-view__breadcrumb" aria-label="Breadcrumb">
        <span className="cs-view__breadcrumb-parent">My Account</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cs-view__breadcrumb-arrow"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="cs-view__breadcrumb-current">Support</span>
      </nav>

      {/* Page Header */}
      <header className="cs-view__header">
        <h1 className="cs-view__title">Support</h1>
        <p className="cs-view__subtitle">
          Talk to the executive handling your application — not a general queue.
        </p>
      </header>

      {/* Main Grid Layout */}
      <div className="cs-view__grid">
        {/* Left: Chat Window Panel */}
        <div className="cs-view__chat-col">
          <ChatWindow
            conversation={conversation}
            isLoading={isChatLoading}
            isSending={isSending}
            onSendMessage={sendMessage}
          />
        </div>

        {/* Right: Sidebar with Executives, Contacts, and Security Card */}
        <aside className="cs-view__sidebar-col">
          <ExecutiveList
            executives={executives}
            activeExecutiveId={conversation?.executive.id}
            onSelectExecutive={handleSelectExecutive}
          />

          <SupportContactInfo contacts={contactMethods} />

          <SecurityNotice
            title={securityNotice.title}
            body={securityNotice.body}
          />
        </aside>
      </div>
    </div>
  )
}

export default CustomerSupport
