'use client';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '500px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          Welcome to Widget Catalog
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: '20px'
        }}>
          Navigate to <a href="/articles" style={{ color: '#3b82f6', fontWeight: '600' }}>/articles</a> to view the live article feed from CMS-RT.
        </p>
      </div>
    </div>
  );
}
