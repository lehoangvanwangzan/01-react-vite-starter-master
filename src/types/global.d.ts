export { };
declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[]
    }
    interface ILogin {
        access_token: string;
        user: {
            _id: string;
            fullName: string;
            email: string;
            phone: number;
            role: string;
            avatar: string;
        }
    }

    interface IRegister {
        _id: string;
        fullName: string;
        email: string;
    }
    interface IUser {
        _id: string;
        fullName: string;
        email: string;
        phone: number;
        role: string;
        avatar: string;
    }
    interface IFetchAccount {
        user: IUser
    }
}

