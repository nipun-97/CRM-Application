import { useCallback, useMemo, useState } from 'react'
import './App.css'

import AccountsTable from './components/AccountsTable'
import AccountForm from './components/AccountForm'
import type { Account } from './components/AccountsTable'
import type { AccountFormValues } from './components/AccountForm'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formDefaults, setFormDefaults] = useState<Partial<AccountFormValues> | undefined>()
  const [editingAccountId, setEditingAccountId] = useState<string | number | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  const accountsEndpoint = useMemo(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'
    return new URL('/api/accounts', baseUrl).toString()
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
    setFormDefaults(undefined)
    setEditingAccountId(null)
  }, [])

  const handleSubmitAccount = useCallback(async (values: AccountFormValues) => {
    const firstName = values.firstName.trim()
    const lastName = values.lastName.trim()
    const email = values.email.trim()
    const phone = values.phone?.trim() ?? ''
    const country = values.country?.trim() ?? ''

    const payload: Record<string, unknown> = {
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      country
    }

    const targetUrl = editingAccountId != null ? `${accountsEndpoint}/${editingAccountId}` : accountsEndpoint
    const method = editingAccountId != null ? 'PUT' : 'POST'

    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Failed to ${editingAccountId != null ? 'update' : 'create'} account (status ${response.status})`)
    }

    setRefreshToken((token) => token + 1)
    handleCloseForm()
  }, [accountsEndpoint, editingAccountId, handleCloseForm])

  const handleNewAccount = useCallback(() => {
    setEditingAccountId(null)
    setFormDefaults(undefined)
    setIsFormOpen(true)
  }, [])

  const handleEditAccount = useCallback((account: Account) => {
    setEditingAccountId(account.id)

    setFormDefaults({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      phone: account.phoneNumber ?? '',
      country: account.country ?? ''
    })
    setIsFormOpen(true)
  }, [])

  const handleDeleteAccount = useCallback(async (account: Account) => {
    const targetUrl = `${accountsEndpoint}/${account.id}`

    const response = await fetch(targetUrl, { method: 'DELETE' })

    if (!response.ok) {
      throw new Error(`Failed to delete account (status ${response.status})`)
    }

    setRefreshToken((token) => token + 1)
  }, [accountsEndpoint])

  const formTitle = useMemo(() => editingAccountId != null ? 'Edit Account' : 'New Account', [editingAccountId])

  return (
    <div style={{ padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Accounts</h1>
        <button onClick={handleNewAccount} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #1d4ed8', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>
          Add Account
        </button>
      </header>
      <AccountsTable onEdit={handleEditAccount} onDelete={handleDeleteAccount} refreshToken={refreshToken} />
      <AccountForm
        isOpen={isFormOpen}
        title={formTitle}
        defaultValues={formDefaults}
        onClose={handleCloseForm}
        onSubmit={handleSubmitAccount}
      />
    </div>
  )
}

export default App
