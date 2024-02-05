import { useEffect, useState } from "react";

export const useGet = (parameters) => {
    const defaultData = {}
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(defaultData);
    
    const loadData = async ( parameters = {} ) => {
        if (!loading) setLoading(true)
        setData(defaultData)
        let filters = [];
        if (parameters) {
            for (let key in parameters) {
                if (parameters?.[key] !== undefined) filters.push(`${key}=${parameters[key]}`)
            }
        }
        try {
            await fetch(`http://localhost:8000/content${filters?.length?`?${filters.join("&")}`:""}`)
            .then(res=>{
                if (!res.ok) {
                    const statusError = { statusCode:500, message:"Server error", error: { message: "Can't connect to server." }}
                    throw new Error(statusError);
                };
                return res;
            })
            .then(res=>res.json())
            .then(res=>{
                setData(res.data)
            })
        }
        catch(error) {
            return error
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData(parameters)
    }, [JSON.stringify(parameters)]);

    return [data, loading]
}