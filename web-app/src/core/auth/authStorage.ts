import { STORAGE_KEYS } from '../config/constants'
import { localStore } from '../storage/localStorage'

import type { AuthTokens, AuthUser, RegisteredUserRecord } from './authTypes'

const SCHEMA_VERSION = 'v9_clean_fresh_slate'
try {
  if (localStore.get<string>('taxedge.auth_schema') !== SCHEMA_VERSION) {
    localStore.remove(STORAGE_KEYS.registeredUsers)
    localStore.remove(STORAGE_KEYS.accessToken)
    localStore.remove(STORAGE_KEYS.refreshToken)
    localStore.remove(STORAGE_KEYS.user)
    localStore.remove('taxedge.userApplications')
    localStore.remove('taxedge.applicationDrafts')
    localStore.remove('taxedge.userDeadlines')
    localStore.set('taxedge.auth_schema', SCHEMA_VERSION)
  }
} catch {
  /* Ignore browser storage errors */
}

/** The only place tokens and registered users are read from or written to persistent storage. */
export const authStorage = {
  getTokens(): AuthTokens | null {
    const accessToken = localStore.get<string>(STORAGE_KEYS.accessToken)
    const refreshToken = localStore.get<string>(STORAGE_KEYS.refreshToken)
    if (!accessToken || !refreshToken) return null
    return { accessToken, refreshToken }
  },
  setTokens(tokens: AuthTokens): void {
    localStore.set(STORAGE_KEYS.accessToken, tokens.accessToken)
    localStore.set(STORAGE_KEYS.refreshToken, tokens.refreshToken)
  },
  getUser(): AuthUser | null {
    return localStore.get<AuthUser>(STORAGE_KEYS.user)
  },
  setUser(user: AuthUser): void {
    localStore.set(STORAGE_KEYS.user, user)
  },
  getRegisteredUsers(): Record<string, RegisteredUserRecord> {
    return localStore.get<Record<string, RegisteredUserRecord>>(STORAGE_KEYS.registeredUsers) || {}
  },
  getRegisteredUser(mobile: string): RegisteredUserRecord | null {
    const clean = mobile.replace(/\D/g, '')
    const users = this.getRegisteredUsers()
    return users[clean] || null
  },
  saveRegisteredUser(record: RegisteredUserRecord): void {
    const clean = record.mobile.replace(/\D/g, '')
    const users = this.getRegisteredUsers()
    users[clean] = {
      ...record,
      mobile: clean,
    }
    localStore.set(STORAGE_KEYS.registeredUsers, users)
  },
  isMobileRegistered(mobile: string): boolean {
    const record = this.getRegisteredUser(mobile)
    return Boolean(record && record.isRegistered)
  },
  clear(): void {
    localStore.remove(STORAGE_KEYS.accessToken)
    localStore.remove(STORAGE_KEYS.refreshToken)
    localStore.remove(STORAGE_KEYS.user)
  },
  removeRegisteredUser(mobile: string): void {
    const clean = mobile.replace(/\D/g, '')
    const users = this.getRegisteredUsers()
    delete users[clean]
    localStore.set(STORAGE_KEYS.registeredUsers, users)
  },
  clearAll(): void {
    this.clear()
    localStore.remove(STORAGE_KEYS.registeredUsers)
    localStore.remove('taxedge.userApplications')
    localStore.remove('taxedge.applicationDrafts')
  },
}
