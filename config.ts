import path from "path";

export const baseUrl = process.env["BASE_URL"] as string;

export const dataDirectory = process.env["DATA_DIRECTORY"] as string;
export const userDirectory = path.join(dataDirectory, 'users');
