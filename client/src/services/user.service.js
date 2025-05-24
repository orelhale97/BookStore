import axios from "axios";
import { generateObject, SERVER_URL } from "./api.service";


const BOOKS_API = `${SERVER_URL}books`;
const PURCHASES_API = `${SERVER_URL}purchases`;


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

    return axios.get(api).then((response) => response.data?.map((book) => generateObject(book)));
}


export const buyBook = (userId, bookId) => {
    const api = `${PURCHASES_API}`;

    return axios.post(api, { userId, bookId }).then((response) => response.data)
}


export const fetchUserPurchases = (userId) => {
    const api = `${PURCHASES_API}/user/${userId}`;

    return axios.get(api).then((response) => response.data?.map((book) => generateObject(book)));
}


