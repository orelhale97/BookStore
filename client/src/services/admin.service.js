import axios from "axios";
import { getHeaders, SERVER_URL } from "./api.service";

const BOOKS_API = `${SERVER_URL}books`;

export const deleteBook = (bookId) => {
    const url = `${BOOKS_API}/${bookId}`;

    const headers = getHeaders();

    return axios.delete(url, { headers }).then((response) => response.data);
}



