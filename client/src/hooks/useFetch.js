import { useState } from "react";
import { newAxios } from "../util/newAxios";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = async () => {
    setLoading(true);
    try {
  
        const res = await newAxios(url);
        setData(res.data);
      }
    catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  getData();

  return { data, loading, error };
};

export default useFetch;
