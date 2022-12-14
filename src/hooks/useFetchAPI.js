import { useState, useEffect } from "react";

export function useFetchAPI(endpoint) {
    const [data, setData] = useState(undefined);

    useEffect(() => {
        fetch(endpoint)
            .then((response) => response.json())
            .then((json) => setData(json));
    }, [endpoint]);
    return data;
}
