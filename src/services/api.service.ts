// import { FundFilled } from "@ant-design/icons";
import axios from "@/services/axios.customize";
// create user
// const createUserAPI = (fullName: string, email: string, password: string, phone: number) => {
//     const URL_BACKEND = "/api/v1/user";
//     const data = {
//         fullName: fullName,
//         email: email,
//         password: password,
//         phone: phone
//     }
//     return axios.post(URL_BACKEND, data)
// }
export const createUserAPI = (fullName: string, email: string, password: string, phone: number) => {
    const URL_BACKEND = "/api/v1/user";
    return axios.post<IBackendRes<ICreateUser>>(URL_BACKEND, { fullName, email, password, phone })
}
// //update user
// const updateUserAPI = (_id, fullName, phone) => {
//     const URL_BACKEND = "/api/v1/user";
//     const data = {
//         _id: _id,
//         fullName: fullName,
//         phone: phone
//     }
//     return axios.put(URL_BACKEND, data)
// }
// const deleteUserAPI = (id) => {
//     const URL_BACKEND = `/api/v1/user/${id}`; //backtick
//     return axios.delete(URL_BACKEND)
// }
export const deleteUserAPI = (id: string) => {
    const URL_BACKEND = `/api/v1/user/${id}`;
    return axios.delete<IBackendRes<IModelPaginate<IUserTable>>>(URL_BACKEND);
}
// const handleUploadFile = (file, folder) => {
//     const URL_BACKEND = "/api/v1/file/upload"; //backtick
//     let config = {
//         headers: {
//             "upload-type": folder,
//             "Content-Type": "multipart/form-data"
//         }
//     }
//     const bodyFormData = new FormData();
//     bodyFormData.append("fileImg", file)
//     return axios.post(URL_BACKEND, bodyFormData, config)
// }
// const UpdateUserAvatarAPI = (avatar, _id, fullName, phone) => {
//     const URL_BACKEND = "/api/v1/user";
//     const data = {
//         avatar: avatar,
//         _id: _id,
//         fullName: fullName,
//         phone: phone
//     }
//     return axios.put(URL_BACKEND, data)
// }
// register form
export const registerUserAPI = (fullName: string, email: string, password: string, phone: number) => {
    const URL_BACKEND = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(URL_BACKEND, { fullName, email, password, phone })
}
export const loginAPI = (username: string, password: string) => {
    const URL_BACKEND = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(URL_BACKEND, { username, password, delay: 2000 })
}
// const logoutAPI = () => {
//     const URL_BACKEND = "/api/v1/auth/logout";
//     return axios.post(URL_BACKEND);
// }
export const logoutAPI = () => {
    const URL_BACKEND = "/api/v1/auth/logout";
    return axios.post<IBackendRes<ILogout>>(URL_BACKEND)
}
// const getAccountAPI = () => {
//     const URL_BACKEND = "/api/v1/auth/account";
//     return axios.get(URL_BACKEND);
// }

export const fetchAccountAPI = () => {
    const URL_BACKEND = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(URL_BACKEND, { headers: { delay: 2000 } });
}
// const fetchAllUserAPI = (current, pageSize) => {
//     const URL_BACKEND = `/api/v1/user?current=${current}&pageSize=${pageSize}`;
//     return axios.get(URL_BACKEND);
// }
// export const getUsersAPI = (current: number, pageSize: number) => {
//     const URL_BACKEND = `/api/v1/user?current=${current}&pageSize=${pageSize}`;
//     return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(URL_BACKEND);
// }
export const getUsersAPI = (query: string) => {
    const URL_BACKEND = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(URL_BACKEND);
}
// const fetchALLBookAPI = (current, pageSize) => {
//     const URL_BACKEND = `/api/v1/book?current=${current}&pageSize=${pageSize}`;
//     return axios.get(URL_BACKEND);
// }
// const deleteBookAPI = (id) => {
//     const URL_BACKEND = `/api/v1/book/${id}`; //backtick
//     return axios.delete(URL_BACKEND)
// }
// const UpdateBookAvatarAPI = (avatar, _id) => {
//     const URL_BACKEND = "/api/v1/book";
//     const data = {
//         avatar: avatar,
//         _id: _id
//     }
//     return axios.put(URL_BACKEND, data)
// }
// const CreateBookAPI = (thumbnail, mainText, author, price, quantity, category) => {
//     const URL_BACKEND = "/api/v1/book";
//     const data = {
//         thumbnail: thumbnail,
//         mainText: mainText,
//         author: author,
//         price: price,
//         quantity: quantity,
//         category: category
//     }
//     return axios.post(URL_BACKEND, data)
// }
// const UpdateBookAPI = (_id, thumbnail, mainText, author, price, quantity, category) => {
//     const URL_BACKEND = "/api/v1/book";
//     const data = {
//         _id: _id,
//         thumbnail: thumbnail,
//         mainText: mainText,
//         author: author,
//         price: price,
//         quantity: quantity,
//         category: category
//     }
//     return axios.put(URL_BACKEND, data)
// }
export const bulkCreateUserAPI = (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}[]) => {
    const URL_BACKEND = "/api/v1/user/bulk-create";
    return axios.post<IBackendRes<IResponseImport>>(URL_BACKEND, data)
}

// export {
//     createUserAPI, updateUserAPI, fetchAllUserAPI, deleteUserAPI, handleUploadFile,
//     UpdateUserAvatarAPI, registerUserAPI, loginAPI, getAccountAPI, logoutAPI, fetchALLBookAPI,
//     deleteBookAPI, UpdateBookAvatarAPI, CreateBookAPI, UpdateBookAPI
// };

