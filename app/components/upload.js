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
  const [selectedGrades, setSelectedGrades] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
  });
  const [examType, setExamType] = useState("");
  const [subject, setSubject] = useState("");

  // const cookieStore = useCookies();
  const id = Cookies.get("id-teacher");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleTextInputChange = (event) => {
    const subjectValue = event.target.value;
    setSubject(subjectValue);
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedGrades((prev) => ({ ...prev, [name]: checked }));
  };
  const handleExamTypeChange = (event) => {
    const selectedExamType = event.target.value;
    setExamType(selectedExamType);
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
        const grade = Object.keys(selectedGrades).filter(
          (key) => selectedGrades[key]
        );
        // const subject = subject;
        const assessment = examType;
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
    <div className={`${styles.container}`} style={{ marginTop: "20px" }}>
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
              Subject
            </label>
            <input
              id="textInput"
              type="text"
              placeholder="example: Biology"
              value={subject}
              onChange={handleTextInputChange}
              className={`${styles.input} ${styles.textInput} form-control`}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Select Grade</label>
            <div className={styles.checkboxGroup}>
              {Object.keys(selectedGrades).map((grade) => (
                <div key={grade}>
                  <input
                    id={`grade${grade}`}
                    name={grade}
                    type="checkbox"
                    checked={selectedGrades[grade]}
                    onChange={handleCheckboxChange}
                    className={styles.checkboxInput}
                  />
                  <label
                    htmlFor={`grade${grade}`}
                    className={styles.checkboxLabel}
                  >
                    {grade}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="examType">
              Select Exam Type
            </label>
            <select
              id="examType"
              name="examType"
              className={styles.dropdown}
              onChange={handleExamTypeChange} // Function to handle the dropdown change
            >
              <option value="" disabled selected></option>
              <option value="Midterm">Midterm</option>
              <option value="Final Assessment">Final Assessment</option>
              <option value="Quiz">Quiz</option>
            </select>
          </div>
          <br />
          <div className={styles.buttonGroup}>
            {!loading
              ? selectedFile &&
                examType &&
                selectedGrades &&
                subject && (
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
            <button className="btn btn-success" onClick={reload}>
              New Upload
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploadForm;
