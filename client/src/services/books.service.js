
import axios from "axios";

export const SERVER_URL = import.meta.env.VITE_API_SERVER;
const BOOKS_API = `${SERVER_URL}books`;

export const fetchBooks = (search = "") => {
    search = search?.trim();

    const api = search ? `${BOOKS_API}?search=${search}` : BOOKS_API;

    return axios.get(api).then((response) => {
        const { data } = response;
        console.log("data ==== ", data);
        return data;
    })
} 