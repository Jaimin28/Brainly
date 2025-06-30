import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../Config";

export function useContent() {
  const [contents, setContents] = useState([]);

  function refresh() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please sign in again.");
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/v1/getcontent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setContents(response.data.content);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    refresh();

    let interval = setInterval(() => {
      refresh();
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {contents,refresh};
}
