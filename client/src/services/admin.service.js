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

export const uploadBookImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const headers = getHeaders();
    headers['Content-Type'] = 'multipart/form-data';

    console.log("headers ==== ", headers);

    const response = await axios.post(`${BOOKS_API}/upload`, formData, { headers });
    return response.data;
}

export const createBook = async (bookData) => {
    const headers = getHeaders();

    return axios.post(BOOKS_API, bookData, { headers })
        .then((response) => generateObject(response.data));
};


export const fetchAuthors = () => {
    const headers = getHeaders();
    return axios.get(AUTHORS_API, { headers }).then((response) => response.data);
}

export const createAuthors = (authorsData) => {
    const headers = getHeaders();
    return axios.post(AUTHORS_API, authorsData, { headers }).then((response) => response.data);
}

export const updateAuthors = (authorsId, authorsData) => {
    const url = `${AUTHORS_API}/${authorsId}`;
    const headers = getHeaders();
    return axios.put(url, authorsData, { headers }).then((response) => response.data);
}

export const deleteAuthor = (authorsId) => {
    const url = `${AUTHORS_API}/${authorsId}`;
    const headers = getHeaders();
    return axios.delete(url, { headers })
}



export const fetchPublishers = () => {
    const headers = getHeaders();
    return axios.get(PUBLISHERS_API, { headers }).then((response) => response.data);
}

export const createPublisher = (publisherData) => {
    const headers = getHeaders();
    return axios.post(PUBLISHERS_API, publisherData, { headers }).then((response) => response.data);
}

export const updatePublisher = (publisherId, publisherData) => {
    const url = `${PUBLISHERS_API}/${publisherId}`;
    const headers = getHeaders();
    return axios.put(url, publisherData, { headers }).then((response) => response.data);
}

export const deletePublisher = (publisherId) => {
    const url = `${PUBLISHERS_API}/${publisherId}`;
    const headers = getHeaders();
    return axios.delete(url, { headers })
}


