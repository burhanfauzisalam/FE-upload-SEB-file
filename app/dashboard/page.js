"use client";
import FileTable from "../components/fileTable";
import Cookies from "js-cookie";
import axios from "axios";
import useStore from "../store/useStore";
import { useEffect } from "react";

const Dashboard = () => {
  const token = Cookies.get("token");
  const { user, setUser, clearUser } = useStore();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.post(
          `https://api-seb-file.vercel.app/api/decode`,
          // `http://192.168.0.116:5000/api/decode`,
          {},
          { headers: { token: token } }
        );
        setUser(res.data.name);
        // console.log(res.status);
      } catch (error) {
        // console.log("Error fetching data:", error);
        Cookies.remove("token");
        clearUser();
        window.location.reload();
      }
    };
    if (token) {
      getUser();
    }
  }, []);
  // console.log(user);
  return (
    <>
      <div className="container mt-10">
        <FileTable />
      </div>
    </>
  );
};

export default Dashboard;
