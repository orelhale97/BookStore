import axios from "axios";
import { generateObject, getHeaders, SERVER_URL } from "./api.service";

const BOOKS_API = `${SERVER_URL}books`;
const AUTHORS_API = `${SERVER_URL}authors`;
const PUBLISHERS_API = `${SERVER_URL}publishers`;

export const deleteBook = (bookId) => {
    const url = `${BOOKS_API}/${bookId}`;

    const headers = getHeaders();

    return axios.delete(url, { headers }).then((response) => response.data);
}

export const updateBook = (bookId, bookData) => {
    const url = `${BOOKS_API}/${bookId}`;

    const headers = getHeaders();
    return axios.put(url, bookData, { headers }).then((response) => generateObject(response.data));
}

export const fetchAuthors = () => {
    const headers = getHeaders();
    return axios.get(AUTHORS_API, { headers }).then((response) => response.data);
}

export const fetchPublishers = () => {
    const headers = getHeaders();
    return axios.get(PUBLISHERS_API, { headers }).then((response) => response.data);
}

export const uploadBookImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const headers = {
        ...getHeaders(),
        'Content-Type': 'multipart/form-data'
    };

    const response = await axios.post(`${BOOKS_API}/upload`, formData, { headers });
    return response.data;
}



