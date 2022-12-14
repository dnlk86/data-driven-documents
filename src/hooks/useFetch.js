import { useState, useEffect } from "react";
import axios from "axios";

export function useFetch(endpoint) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(undefined);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const response = await axios.get(endpoint);
            setData(response.data);
            setLoading(false);
        };
        getData();
    }, [endpoint]);
    return { data, loading };
}
