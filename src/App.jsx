import React, { useState } from "react";

const API = "https://bulk-email-sender-backend-zupq.onrender.com/api/v1/campaign";

function App() {
  const [form, setForm] = useState({
    company_name: "",
    header_title: "",
    subject: "",
    title: "",
    body: "",
    footer: ""
  });

  const [file, setFile] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePreview = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    const res = await fetch(`${API}/preview`, { method: "POST", body: fd });
    const data = await res.json();
    setPreviewHtml(data.html);
  };

  const handleSend = async () => {
    if (!file) return alert("Upload CSV file first");

    setStatus("Sending campaign...");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("csv_file", file);

    const res = await fetch(`${API}/send-bulk`, { method: "POST", body: fd });
    const data = await res.json();
    setStatus(data.message);
  };

  return (
    <div style={page}>
      <h1 style={title}>Email Campaign Builder</h1>

      <div style={layout}>
        {/* PREVIEW */}
        <div style={card}>
          <div style={cardHeader}>Email Preview</div>
          <iframe title="preview" style={iframe} srcDoc={previewHtml} />
        </div>

        {/* FORM */}
        <div style={card}>
          <div style={cardHeader}>Campaign Details</div>

          {/* INNER CONTAINER (IMPORTANT FIX) */}
          <div style={formContainer}>
            <div style={formGrid}>
              <Field label="Company Name" name="company_name" onChange={handleChange} />
              <Field label="Header Title" name="header_title" onChange={handleChange} />
              <Field label="Email Subject" name="subject" onChange={handleChange} />
              <Field label="Email Title" name="title" onChange={handleChange} />

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Email Body</label>
                <textarea
                  name="body"
                  placeholder="Use {{name}}, {{role}}, {{company}}"
                  rows={6}
                  style={textarea}
                  onChange={handleChange}
                />
              </div>

              <Field label="Footer Text" name="footer" onChange={handleChange} />
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              style={fileInput}
            />

            <div style={actions}>
              <button style={btnSecondary} onClick={handlePreview}>
                Preview
              </button>
              <button style={btnPrimary} onClick={handleSend}>
                Send Campaign
              </button>
            </div>

            {status && <p style={statusText}>{status}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, name, onChange }) => (
  <div style={{ width: "100%" }}>
    <label style={labelStyle}>{label}</label>
    <input name={name} onChange={onChange} style={input} />
  </div>
);

/* ================= STYLES ================= */

const page = {
  padding: 40,
  background: "#f3f7f4",
  minHeight: "100vh",
  fontFamily: "Inter, Arial, sans-serif",
  boxSizing: "border-box"
};

const title = {
  textAlign: "center",
  marginBottom: 30,
  color: "#1b5e20"
};

const layout = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 30,
  maxWidth: 1200,
  margin: "0 auto"
};

const card = {
  background: "#ffffff",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  padding: 20,
  boxSizing: "border-box"
};

const cardHeader = {
  fontWeight: 600,
  marginBottom: 16,
  color: "#1b5e20"
};

const formContainer = {
  maxWidth: "100%",
  boxSizing: "border-box"
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16
};

const labelStyle = {
  fontSize: 13,
  color: "#355e3b",
  marginBottom: 4,
  display: "block"
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #cfd8cf",
  outline: "none",
  boxSizing: "border-box"
};

const textarea = {
  ...input,
  resize: "vertical"
};

const fileInput = {
  marginTop: 18,
  width: "100%",
  boxSizing: "border-box"
};

const iframe = {
  width: "100%",
  height: 520,
  border: "1px solid #e0e0e0",
  borderRadius: 10
};

const actions = {
  display: "flex",
  gap: 12,
  marginTop: 20
};

const btnPrimary = {
  flex: 1,
  padding: 14,
  background: "#1b5e20",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer"
};

const btnSecondary = {
  ...btnPrimary,
  background: "#6b8f71"
};

const statusText = {
  marginTop: 14,
  textAlign: "center",
  color: "#1b5e20",
  fontWeight: 500
};

export default App;
