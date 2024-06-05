"use client";

import axios from "axios";
import { useState } from "react";
import "../style/style.css";
import Cookies from "js-cookie";

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [urlFileName, setUrlFileName] = useState("");
  const [uploadState, setUploadState] = useState(true);
  const [loading, setLoading] = useState(false);

  // const cookieStore = useCookies();
  const id = Cookies.get("id-teacher");

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
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post(
        "https://assessment.nola.sch.id/upload.php",
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

        const teacherData = await axios.get(`/api/teacher?id=${id}`);
        const filename = res.data.filename;
        const url = res.data.url;
        const grade = [5];
        const subject = "Biology";
        const assessment = "midterm";
        const teacher = teacherData.data.teacher.name;

        const data = { filename, url, grade, subject, assessment, teacher };

        const uploadToDB = await axios.post(`/api/upload`, data);
        setUploadState(false);
        setLoading(false);
      } else {
        setResponseMessage(`file already exist`);
        // setUploadedFileName(res.data.filename);
        setUrlFileName(res.data.message);
        setSelectedFile(null);
        setLoading(false);
        setUploadState(false);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setResponseMessage("Error uploading file");
      setUrlFileName("");
      setSelectedFile(null);
      setLoading(false);
      setUploadState(false);
    }
  };

  const handleDelete = async () => {
    if (!urlFileName) {
      alert("No file to delete");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("filename", urlFileName);

      const res = await axios.post(
        "https://assessment.nola.sch.id/delete.php",
        formData
      );

      if (res.data.status === "success") {
        setResponseMessage("File deleted successfully.");
        setUrlFileName("");
        setSelectedFile(null);
        const deleteDB = await axios.delete(`/api/upload?url=${urlFileName}`);
        setLoading(false);
        setUploadState(false);
      } else {
        setResponseMessage(`Error: ${res.data.message}`);
        setSelectedFile(null);
        setLoading(false);
        setUploadState(false);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setResponseMessage("Error deleting file");
      setSelectedFile(null);
      setLoading(false);
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
            {!loading
              ? selectedFile && (
                  <button type="submit" className="btn btn-info">
                    Upload
                  </button>
                )
              : "Uploading..."}
          </form>
        )}

        <div>
          {responseMessage && <div id="response">{responseMessage}</div>}
          {urlFileName && (
            <div>
              <h5>{urlFileName}</h5>
              {!loading ? (
                <>
                  <button onClick={handleDelete} className="btn btn-danger">
                    Delete File
                  </button>
                  <button onClick={goTo} className="btn btn-success">
                    Open
                  </button>
                </>
              ) : (
                "Deleting..."
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUploadForm;
