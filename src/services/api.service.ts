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
export const UpdateUserAPI = (_id: string, fullName: string, phone: string) => {
    const URL_BACKEND = "/api/v1/user";
    const data = {
        _id: _id,
        fullName: fullName,
        phone: phone
    }
    return axios.put<IBackendRes<IRegister>>(URL_BACKEND, data)
}

// const deleteUserAPI = (id) => {
//     const URL_BACKEND = `/api/v1/user/${id}`; //backtick
//     return axios.delete(URL_BACKEND)
// }
export const deleteUserAPI = (_id: string) => {
    const URL_BACKEND = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IModelPaginate<IDeleteUser>>>(URL_BACKEND);
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
export const getBooksAPI = (query: string) => {
    const URL_BACKEND = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(URL_BACKEND);
}
export const deleteBookAPI = (_id: string) => {
    const URL_BACKEND = `/api/v1/book/${_id}`;
    return axios.delete<IBackendRes<IModelPaginate<IDeleteBook>>>(URL_BACKEND);
}
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
export const CreateBookAPI = (
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
    thumbnail: string,
    slider: string[],

) => {
    const URL_BACKEND = `/api/v1/book`;
    const data = {
        mainText: mainText,
        author: author,
        price: price,
        quantity: quantity,
        category: category,
        thumbnail: thumbnail,
        slider: slider,


    }
    return axios.post<IBackendRes<IBookTable>>(URL_BACKEND, data)
}
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
export const UpdateBookAPI = (
    _id: string,
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
    thumbnail: string,
    slider: string[],
) => {
    const URL_BACKEND = `/api/v1/book/${_id}`;
    const data = {
        mainText: mainText,
        author: author,
        price: price,
        quantity: quantity,
        category: category,
        thumbnail: thumbnail,
        slider: slider,

    }
    return axios.put<IBackendRes<IBookTable>>(URL_BACKEND, data)
}
export const bulkCreateUserAPI = (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}[]) => {
    const URL_BACKEND = "/api/v1/user/bulk-create";
    return axios.post<IBackendRes<IResponseImport>>(URL_BACKEND, data)
}
export const GetCategoryAPI = () => {
    const URL_BACKEND = `/api/v1/database/category`;
    return axios.get<IBackendRes<string>>(URL_BACKEND)
}
export const UploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append("fileImg", fileImg)
    return axios<IBackendRes<{
        fileUploaded: string
    }>>({
        method: 'post',
        url: `/api/v1/file/upload`,
        data: bodyFormData,
        headers: {
            "upload-type": folder,
            "Content-Type": "multipart/form-data",
        },
    });
}


