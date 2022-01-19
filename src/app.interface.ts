import { statusCode } from './app.enums';

export interface DataResModel {
    statusCode: statusCode;
    message: string;
    model: any;
}

export interface LoginFormSchema {
    email: string,
    password: string
}