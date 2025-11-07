import React, { useEffect, useMemo, useState } from 'react';

export type Account = {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  country?: string | null;
};

type AccountsTableProps = {
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
  refreshToken?: number;
};

const AccountsTable: React.FC<AccountsTableProps> = ({ onEdit, onDelete, refreshToken }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const accountsEndpoint = useMemo(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';
    return new URL('/api/accounts', baseUrl).toString();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(accountsEndpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load accounts (status ${response.status})`);
        }
        const data: Account[] = await response.json();
        if (isMounted) {
          setAccounts(Array.isArray(data) ? data : []);
        }
      } catch (err: unknown) {
        if ((err as { name?: string }).name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'Unknown error fetching accounts';
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAccounts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [accountsEndpoint, refreshToken]);

  if (isLoading) {
    return <div>Loading accounts…</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!accounts.length) {
    return <div>No accounts found.</div>;
  }

  const handleEdit = (account: Account) => {
    if (onEdit) onEdit(account);
  };

  const handleDelete = (account: Account) => {
    if (onDelete) onDelete(account);
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Country</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td style={tdStyle}>{[account.firstName, account.lastName].filter(Boolean).join(' ')}</td>
              <td style={tdStyle}>{account.email}</td>
              <td style={tdStyle}>{account.phoneNumber ?? ''}</td>
              <td style={tdStyle}>{account.country ?? ''}</td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(account)} style={buttonStyle}>Edit</button>
                <button onClick={() => handleDelete(account)} style={{ ...buttonStyle, marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#f7f7f7'
};

const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid #eee',
  padding: '8px'
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #ccc',
  borderRadius: 4,
  background: '#fff',
  cursor: 'pointer'
};

export default AccountsTable;


