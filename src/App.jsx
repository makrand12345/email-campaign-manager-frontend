import React, { useState, useEffect } from 'react';

function App() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    console.log("Fetching templates from http://127.0.0.1:8000...");
    fetch('http://127.0.0.1:8000/api/v1/campaign/templates')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Templates loaded:", data);
        setTemplates(data);
      })
      .catch(err => {
        console.error("❌ DB Connection Error:", err);
        setStatus('Failed to load templates. Is backend running?');
      });
  }, []);

  const handleSend = async () => {
    if (!selectedTemplate || !file) {
      alert("Please select a hiring template and upload a candidate CSV.");
      return;
    }
    
    setStatus('📡 Sending request to backend...');
    console.log("🚀 Dispatching batch for template:", selectedTemplate.name);

    const formData = new FormData();
    formData.append('name', selectedTemplate.name);
    formData.append('subject', selectedTemplate.subject);
    formData.append('html_content', selectedTemplate.content);
    formData.append('csv_file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/campaign/send-bulk', {
        method: 'POST',
        body: formData
      });
      
      const result = await res.json();
      console.log("📩 Backend Response Object:", result);

      if (res.ok) {
        setStatus('✅ ' + result.message);
      } else {
        setStatus('❌ Server Error: ' + res.status);
        console.error("Backend Error Details:", result);
      }
    } catch (e) {
      console.error("🔥 Network/Fetch Error:", e);
      setStatus('🔥 Server unreachable. Check terminal for crashes.');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Hiring Portal: Email Manager</h1>
      <hr />
      
      <h3>1. Select Hiring Stage Template</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        {templates.map(t => (
          <div 
            key={t.id} 
            onClick={() => {
              console.log("Selected:", t.name);
              setSelectedTemplate(t);
            }}
            style={{ 
              padding: '20px', border: '2px solid', cursor: 'pointer', transition: '0.3s',
              borderColor: selectedTemplate?.id === t.id ? '#007bff' : '#ecf0f1',
              borderRadius: '10px', background: selectedTemplate?.id === t.id ? '#f0f7ff' : '#fff'
            }}
          >
            <strong style={{ display: 'block', fontSize: '16px' }}>{t.name}</strong>
            <small style={{ color: '#7f8c8d' }}>Sub: {t.subject}</small>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fdfefe', border: '1px solid #dcdde1', borderRadius: '10px' }}>
        <h3>2. Mailer Content Preview</h3>
        {selectedTemplate ? (
          <div 
            dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} 
            style={{ padding: '20px', background: '#fff', border: '1px dashed #3498db', minHeight: '100px' }} 
          />
        ) : <p style={{ color: '#95a5a6' }}>Click a template above to preview.</p>}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>3. Upload Candidate Data (.csv)</h3>
        <input type="file" accept=".csv" onChange={(e) => {
          console.log("File selected:", e.target.files[0].name);
          setFile(e.target.files[0]);
        }} style={{ padding: '10px', background: '#eee', width: '100%', borderRadius: '5px' }} />
      </div>

      <button onClick={handleSend} style={{ marginTop: '40px', width: '100%', padding: '18px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
        Send Bulk Hiring Emails Now
      </button>
      {status && <div style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold', color: '#2980b9' }}>{status}</div>}
    </div>
  );
}

export default App;