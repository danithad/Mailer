import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      // Use the deployed API URL for production, localhost for development
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://mailer-ou2i1x18p-danithad03-gmailcoms-projects.vercel.app/api/schedule' 
        : 'http://localhost:5000/api/schedule';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, date, time }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Network error. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32, maxWidth: 400, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#1976d2' }}>Schedule Google Meet Invite</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Recipient Email</label>
          <input
            type="email"
            placeholder="Recipient Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 16, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 16, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Time</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 24, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
          <button
            type="submit"
            style={{ width: '100%', padding: 12, background: loading ? '#90caf9' : '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontSize: 18, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
        {result && result.eventLink && (
          <div style={{ marginTop: 24, background: '#e3fcef', borderRadius: 8, padding: 16, color: '#256029' }}>
            <p style={{ margin: 0, fontWeight: 500 }}>Event created! <a href={result.eventLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>View in Calendar</a></p>
            <p style={{ margin: 0 }}>Google Meet link: <a href={result.meetLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>{result.meetLink}</a></p>
          </div>
        )}
        {result && result.error && <p style={{ color: '#d32f2f', marginTop: 24, background: '#ffebee', borderRadius: 8, padding: 16 }}>{result.error}</p>}
      </div>
    </div>
  );
}

export default App;