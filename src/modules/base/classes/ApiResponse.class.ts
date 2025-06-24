import { ApiResult } from './ApiResult.class';
import { Response } from 'express';

export class ApiResponse<T> {
    result: ApiResult<T>;
    errors: any[];

    public static success(data: any): ApiResponse<any> {
        const result = new ApiResult();
        result.data = data;
        result.page = 1;

        const response = new ApiResponse();
        response.result = result;

        return response;
    }

}
