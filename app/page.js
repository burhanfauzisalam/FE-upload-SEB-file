"use client";

import axios from "axios";
import { useState } from "react";
import "./style/style.css";
// import "./globals.css";

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

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
        setUploadedFileName(res.data.url);
        setSelectedFile(null);
        const filename = res.data.url;
        const url = res.data.url;
        const uploadToDB = await axios.get(
          `/api/upload?filename=${filename}&url=${url}`
        );
      } else {
        setResponseMessage(`file already exist`);
        setUploadedFileName(res.data.message);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setResponseMessage("Error uploading file");
      setSelectedFile(null);
    }
  };

  const handleDelete = async () => {
    if (!uploadedFileName) {
      alert("No file to delete");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("filename", uploadedFileName.split("/").pop());

      const res = await axios.post(
        "https://seb-test.000webhostapp.com/delete.php",
        formData
      );

      if (res.data.status === "success") {
        setResponseMessage("File deleted successfully.");
        setUploadedFileName("");
        setSelectedFile(null);
        const filename = uploadedFileName;
        const deleteDB = await axios.delete(`/api/upload?filename=${filename}`);
        console.log(deleteDB);
      } else {
        setResponseMessage(`Error: ${res.data.message}`);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setResponseMessage("Error deleting file");
      setSelectedFile(null);
    }
  };
  const goTo = () => {
    window.location.href = uploadedFileName;
  };

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        <div>
          {responseMessage && <div id="response">{responseMessage}</div>}
          {uploadedFileName && (
            <div>
              <h5>{uploadedFileName}</h5>
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
