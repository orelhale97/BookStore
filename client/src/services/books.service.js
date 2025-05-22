
import axios from "axios";

export const SERVER_URL = import.meta.env.VITE_API_SERVER;
const Books_API = `${SERVER_URL}books`;

export const getBookList = () => {
    return axios.get(Books_API).then((response) => {
        const { data } = response;
        console.log("data ==== ", data);
        return data;
    })
} 