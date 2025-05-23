import axios from "axios";


export const SERVER_URL = import.meta.env.VITE_API_SERVER;
const BOOKS_API = `${SERVER_URL}books`;


export function login(body) {
    const url = `${SERVER_URL}login`;
    return axios.post(url, body).then((response) => response.data)
}

export function register(body) {
    const url = `${SERVER_URL}register`;
    return axios.post(url, body).then((response) => response.data)
}


export const fetchBooks = (search = "") => {
    search = search?.trim();
    const api = search ? `${BOOKS_API}?search=${search}` : BOOKS_API;

    return axios.get(api).then((response) => response.data)
} 