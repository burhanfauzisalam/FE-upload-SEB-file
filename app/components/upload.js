"use client";

import axios from "axios";
import { useState } from "react";
// import "../style/style.css";
import styles from "../style/fileUpload.module.css";
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
        window.location.href = "/";
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

  const reload = () => {
    window.location.reload();
  };

  return (
    <div className={`${styles.form}`} style={{ marginTop: "20px" }}>
      {!responseMessage && (
        <form
          onSubmit={handleSubmit}
          className={styles.form}
          style={{ marginTop: "20px" }}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="fileInput" className={styles.label}>
              Select File
            </label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className={`${styles.input} ${styles.fileInput}`}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="textInput" className={styles.label}>
              Enter Text
            </label>
            <input
              id="textInput"
              type="text"
              placeholder="Enter some text"
              value=""
              // onChange={handleTextInputChange}
              className={`${styles.input} ${styles.textInput} form-control`}
            />
          </div>
          <br />
          <div className={styles.buttonGroup}>
            {!loading
              ? selectedFile && (
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnInfo}`}
                  >
                    Upload
                  </button>
                )
              : "Uploading..."}
          </div>
        </form>
      )}
      <div className={styles.buttonGroup}>
        {responseMessage && (
          <>
            <div className={`${styles.response} mb-10`}>{responseMessage}</div>
            <button
              className={`${styles.btn} ${styles.btnInfo}`}
              onClick={reload}
            >
              New Upload
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploadForm;
