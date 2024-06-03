"use client";

import axios from "axios";
import { useState } from "react";
import "./style/style.css";

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [urlFileName, setUrlFileName] = useState("");
  const [uploadState, setUploadState] = useState(true);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post(
        "https://seb-test.000webhostapp.com/upload.php",
        // "http://localhost/seb-file/upload.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status === "success") {
        setResponseMessage(`File uploaded successfully`);
        setUploadedFileName(res.data.filename);
        setUrlFileName(res.data.url);
        setSelectedFile(null);
        const filename = res.data.filename;
        const url = res.data.url;
        const grade = [5];
        const subject = "Biology";
        const assessment = "midterm";
        const teacher = "Caroline Lumengga";

        const data = { filename, url, grade, subject, assessment, teacher };

        const uploadToDB = await axios.post(`/api/upload`, data);
        setUploadState(false);
      } else {
        setResponseMessage(`file already exist`);
        // setUploadedFileName(res.data.filename);
        setUrlFileName(res.data.message);
        setSelectedFile(null);
        setUploadState(false);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setResponseMessage("Error uploading file");
      setSelectedFile(null);
      setUploadState(false);
    }
  };

  const handleDelete = async () => {
    if (!urlFileName) {
      alert("No file to delete");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("filename", urlFileName);

      const res = await axios.post(
        "https://seb-test.000webhostapp.com/delete.php",
        formData
      );

      if (res.data.status === "success") {
        setResponseMessage("File deleted successfully.");
        setUrlFileName("");
        setSelectedFile(null);
        const deleteDB = await axios.delete(`/api/upload?url=${urlFileName}`);
        setUploadState(false);
      } else {
        setResponseMessage(`Error: ${res.data.message}`);
        setSelectedFile(null);
        setUploadState(false);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setResponseMessage("Error deleting file");
      setSelectedFile(null);
      setUploadState(false);
    }
  };
  const goTo = () => {
    window.location.href = urlFileName;
  };

  return (
    <>
      <div className="container">
        {uploadState && (
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
          </form>
        )}

        <div>
          {responseMessage && <div id="response">{responseMessage}</div>}
          {urlFileName && (
            <div>
              <h5>{urlFileName}</h5>
              <button onClick={handleDelete}>Delete File</button>
              <button onClick={goTo}>Open</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUploadForm;
