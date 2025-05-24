


export const SERVER_URL = import.meta.env.VITE_API_SERVER;

export function getHeaders() {
    const header = {};
    if (localStorage.token) { header.Authorization = `Bearer ${localStorage.token}`; }
    return header
}




export function generateObject(object) {
    for (const key in object) {
        if (key == "book" && !!object[key].src) {
            object[key].src = `${SERVER_URL}${object[key].src}`;
        }

        if (key == "src") {
            object.src = `${SERVER_URL}${object.src}`;
        }
    }
    return object;
}