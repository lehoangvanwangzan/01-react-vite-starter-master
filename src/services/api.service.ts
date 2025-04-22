
import axios from "@/services/axios.customize";

export const createUserAPI = (fullName: string, email: string, password: string, phone: number) => {
    const URL_BACKEND = "/api/v1/user";
    return axios.post<IBackendRes<ICreateUser>>(URL_BACKEND, { fullName, email, password, phone })
}

export const UpdateUserAPI = (_id: string, fullName: string, phone: string) => {
    const URL_BACKEND = "/api/v1/user";
    const data = {
        _id: _id,
        fullName: fullName,
        phone: phone
    }
    return axios.put<IBackendRes<IRegister>>(URL_BACKEND, data)
}

export const deleteUserAPI = (_id: string) => {
    const URL_BACKEND = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IModelPaginate<IDeleteUser>>>(URL_BACKEND);
}

export const registerUserAPI = (fullName: string, email: string, password: string, phone: number) => {
    const URL_BACKEND = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(URL_BACKEND, { fullName, email, password, phone })
}
export const loginAPI = (username: string, password: string) => {
    const URL_BACKEND = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(URL_BACKEND, { username, password })
}

export const logoutAPI = () => {
    const URL_BACKEND = "/api/v1/auth/logout";
    return axios.post<IBackendRes<ILogout>>(URL_BACKEND)
}


export const fetchAccountAPI = () => {
    const URL_BACKEND = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(URL_BACKEND);
}

export const getUsersAPI = (query: string) => {
    const URL_BACKEND = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(URL_BACKEND);
}

export const getBooksAPI = (query: string) => {
    const URL_BACKEND = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(URL_BACKEND);
}
export const deleteBookAPI = (_id: string) => {
    const URL_BACKEND = `/api/v1/book/${_id}`;
    return axios.delete<IBackendRes<IModelPaginate<IDeleteBook>>>(URL_BACKEND);
}

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
    return axios.get<IBackendRes<string[]>>(URL_BACKEND)
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
export const GetBooksAPI = (query: string) => {
    const URL_BACKEND = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(URL_BACKEND);
}
export const GetBookByIdAPI = (_id: string) => {
    const URL_BACKEND = `/api/v1/book/${_id}`;
    return axios.get<IBackendRes<IBookTable>>(URL_BACKEND);
}

export const CreateOrderAPI = (
    name: string, address: string,
    phone: string, totalPrice: number,
    type: string, detail: any
) => {
    const urlBackend = "/api/v1/order";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { name, address, phone, totalPrice, type, detail });
}
export const GetHistoryAPI = () => {
    const urlBackend = `/api/v1/history`;
    return axios.get<IBackendRes<IHistory[]>>(urlBackend)
}