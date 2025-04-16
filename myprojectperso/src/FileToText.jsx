import React, { useState } from "react";
import Mammoth from "mammoth";
import pdfToText from "react-pdftotext";

const FileToText = () => {
  const [text, setText] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("File uploaded:", file);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;

      if (file.type === "text/plain") {
        // ✅ Extract text from .txt file
        setText(content); // No need to use ArrayBuffer for text files

      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // ✅ Extract text from .docx (Word) file
        const { value } = await Mammoth.extractRawText({
          arrayBuffer: content,
        });
        if (value.trim()) {
          setText(value);
        } else {
          alert("The content is empty or the file format may not be correct.");
        }

      } else if (file.type === "application/pdf") {
        console.log("Processing PDF file...");
        // ✅ Extract text from PDF using react-pdftotext
        pdfToText(file)
          .then((extractedText) => {
            if (extractedText.trim()) {
              console.log("PDF extracted text:", extractedText);  // Debugging log
              setText(extractedText);
            } else {
              alert("The PDF contains no readable text or it couldn't be processed properly.");
            }
          })
          .catch((error) => {
            console.error("Failed to extract text from PDF", error);
            alert("There was an issue extracting text from the PDF. Please try another file.");
          });

      } else {
        alert("Unsupported file type!");
      }
    };

    if (file.type === "text/plain") {
      reader.readAsText(file); // Read as plain text for .txt files
    } else {
      reader.readAsArrayBuffer(file); // Use ArrayBuffer for DOCX files and other files
    }
  };

  return (
    <div>
      <h2>Document to Text Converter</h2>
      <input type="file" accept=".txt,.docx,.pdf" onChange={handleFileUpload} />
      <textarea value={text} readOnly rows="10" cols="50" />
    </div>
  );
};

export default FileToText;
