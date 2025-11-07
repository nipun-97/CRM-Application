import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const accountSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal(''))
});

export type AccountFormValues = z.infer<typeof accountSchema>;

type AccountFormProps = {
  isOpen: boolean;
  title?: string;
  defaultValues?: Partial<AccountFormValues>;
  onClose: () => void;
  onSubmit: (values: AccountFormValues) => void | Promise<void>;
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 520,
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  overflow: 'hidden'
};

const headerStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderBottom: '1px solid #eee',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const bodyStyle: React.CSSProperties = {
  padding: 16
};

const footerStyle: React.CSSProperties = {
  padding: 16,
  borderTop: '1px solid #eee',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  marginBottom: 6
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #ccc',
  borderRadius: 6
};

const errorStyle: React.CSSProperties = {
  color: '#b91c1c',
  fontSize: 12,
  marginTop: 4
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: 6,
  background: '#fff',
  cursor: 'pointer'
};

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#2563eb',
  color: '#fff',
  border: '1px solid #1d4ed8'
};

const AccountForm: React.FC<AccountFormProps> = ({ isOpen, title = 'Account', defaultValues, onClose, onSubmit }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const normalizedDefaults = useMemo(() => ({
    firstName: defaultValues?.firstName ?? '',
    lastName: defaultValues?.lastName ?? '',
    email: defaultValues?.email ?? '',
    phone: defaultValues?.phone ?? '',
    country: defaultValues?.country ?? ''
  }), [defaultValues]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: normalizedDefaults
  });

  useEffect(() => {
    if (isOpen) {
      reset(normalizedDefaults);
      setSubmitError(null);
    }
  }, [isOpen, normalizedDefaults, reset]);

  const handleFormSubmit = useCallback(async (values: AccountFormValues) => {
    setSubmitError(null);

    const trimmed: AccountFormValues = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() ?? '',
      country: values.country?.trim() ?? ''
    };

    try {
      await onSubmit(trimmed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error saving account';
      setSubmitError(message);
    }
  }, [onSubmit]);

  if (!isOpen) return null;

  const submitButtonLabel = isSubmitting ? 'Saving…' : (title?.toLowerCase().includes('edit') ? 'Update' : 'Save');

  return (
    <div style={modalOverlayStyle} role="dialog" aria-modal="true">
      <div style={modalStyle}>
        <div style={headerStyle}>
          <div>{title}</div>
          <button type="button" onClick={onClose} aria-label="Close" style={buttonStyle}>×</button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div style={bodyStyle}>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle} htmlFor="firstName">First name</label>
              <input id="firstName" type="text" {...register('firstName')} style={inputStyle} />
              {errors.firstName && <div style={errorStyle}>{errors.firstName.message}</div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle} htmlFor="lastName">Last name</label>
              <input id="lastName" type="text" {...register('lastName')} style={inputStyle} />
              {errors.lastName && <div style={errorStyle}>{errors.lastName.message}</div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle} htmlFor="email">Email</label>
              <input id="email" type="email" {...register('email')} style={inputStyle} />
              {errors.email && <div style={errorStyle}>{errors.email.message}</div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle} htmlFor="phone">Phone</label>
              <input id="phone" type="tel" {...register('phone')} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle} htmlFor="country">Country</label>
              <input id="country" type="text" {...register('country')} style={inputStyle} />
            </div>
            {submitError && (
              <div style={{ ...errorStyle, marginTop: 8 }}>{submitError}</div>
            )}
          </div>
          <div style={footerStyle}>
            <button type="button" onClick={onClose} style={buttonStyle}>Cancel</button>
            <button type="submit" disabled={isSubmitting} style={primaryButtonStyle}>{submitButtonLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;


