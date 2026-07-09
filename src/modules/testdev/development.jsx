"use client";
import React, { useRef, useState } from "react";

const Development = () => {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleClick = () => fileRef.current.click();

  const handleFileChange = (file) => {
    if (file && file.name.endsWith(".csv")) {
      setFileName(file.name);
    } else {
      alert("Only CSV files allowed ❌");
    }
  };

  const onInputChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.backgroundGlow}></div>

      <div
        style={{
          ...styles.card,
          border: dragActive ? "2px dashed #6366f1" : "2px dashed transparent",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <h1 style={styles.title}>🚀 Upload CSV</h1>
        <p style={styles.subtitle}>
          Drag & drop your file or click below
        </p>

        <button style={styles.button} onClick={handleClick}>
          Choose File
        </button>

        {fileName && (
          <div style={styles.fileBox}>
            <span>📄 {fileName}</span>
          </div>
        )}

        <input
          type="file"
          accept=".csv"
          ref={fileRef}
          onChange={onInputChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #1e3a8a, #4f46e5, #9333ea)",
    position: "relative",
    overflow: "hidden",
  },

  backgroundGlow: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "rgba(255,255,255,0.1)",
    filter: "blur(120px)",
    borderRadius: "50%",
  },

  card: {
    backdropFilter: "blur(20px)",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "40px",
    width: "380px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
    transition: "0.3s ease",
  },

  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "14px",
    opacity: 0.8,
    marginBottom: "25px",
  },

  button: {
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #9333ea)",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
  },

  fileBox: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.2)",
    fontSize: "14px",
  },
};

export default Development;