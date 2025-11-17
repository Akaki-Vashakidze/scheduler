import { ApiResult } from './ApiResult.class';
import { Response } from 'express';

export class ApiResponse<T> {

    result: ApiResult<T>;
    errors: any[];
    statusCode: number;

    public static success(data: any): ApiResponse<any> {
        const result = new ApiResult();
        result.data = data;
        result.page = 1;

        const response = new ApiResponse();
        response.result = result;
        response.statusCode = 200;

        return response;
    }

    public static error(error: any, code:number): ApiResponse<any> {
        const response = new ApiResponse();
        response.errors = error;
        response.statusCode = code;

        return response;
    }

}
