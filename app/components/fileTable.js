"use client";

import React, { useEffect, useState } from "react";
import styles from "../style/fileTable.module.css";
import axios from "axios";
import { IoMdOpen } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdCopy } from "react-icons/io";

const FileTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // useEffect(() => {
  //   // Menginisialisasi tooltip Bootstrap
  //   const bootstrap = require("bootstrap");
  //   const tooltipTriggerList = [].slice.call(
  //     document.querySelectorAll('[data-toggle="tooltip"]')
  //   );
  //   const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  //     return new bootstrap.Tooltip(tooltipTriggerEl);
  //   });
  // }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`https://api-seb-file.vercel.app/api/seb`);
        setData(res.data.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);
  console.log(data);

  const handleCopyClick = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };
  const handleDelete = async (urlFileName) => {
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
        await axios.delete(
          `https://api-seb-file.vercel.app/api/seb?url=${urlFileName}`
        );
        // Remove deleted file from the data state
        setData((prevData) =>
          prevData.filter((item) => item.url !== urlFileName)
        );
      } else {
        setResponseMessage(`Error: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setResponseMessage("Error deleting file.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (url) => {
    window.location.href = url;
  };

  return (
    data.length > 0 && (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Filename</th>
              {/* <th>URL</th> */}
              <th>Grade</th>
              <th>Subject</th>
              <th>Assessment</th>
              <th>Teacher</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item.filename}</td>
                {/* <td>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                </td> */}
                <td>{item.grade.join(", ")}</td>
                <td>{item.subject}</td>
                <td>{item.assessment}</td>
                <td>{item.teacher}</td>
                <td>
                  <div className="mb-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleOpen(item.url)}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Open"
                    >
                      <IoMdOpen />
                    </button>{" "}
                    <button
                      className="btn btn-success"
                      onClick={() => handleCopyClick(item.url)}
                      disabled={loading}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Copy URL"
                    >
                      <IoMdCopy />
                    </button>{" "}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.url)}
                      disabled={loading}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete file"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    )
  );
};

export default FileTable;
