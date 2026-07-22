import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabaseEnabled } from '../lib/supabase';

export default function AuthBar() {
  const { session, sendMagicLink, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  if (!supabaseEnabled) return null;

  if (session) {
    return (
      <div className="auth-bar">
        <span className="auth-status">Synced as {session.user.email}</span>
        <button className="auth-link" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="auth-bar">
        <span className="auth-status">Not synced — data stays on this device</span>
        <button className="auth-link" onClick={() => setOpen(true)}>
          Sign in
        </button>
      </div>
    );
  }

  const submit = async () => {
    setError('');
    const trimmed = email.trim();
    if (!trimmed) return;
    const result = await sendMagicLink(trimmed);
    if (result.error) setError(result.error);
    else setSent(true);
  };

  return (
    <div className="auth-bar auth-bar-open">
      {sent ? (
        <span className="auth-status">Check {email} for a sign-in link</span>
      ) : (
        <>
          <input
            className="auth-input"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <button className="auth-link" onClick={submit}>
            Send link
          </button>
        </>
      )}
      {error && <span className="auth-error">{error}</span>}
    </div>
  );
}
