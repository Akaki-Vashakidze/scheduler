import { ApiResult } from './ApiResult.class';
import { ApiPage } from './ApiPage.class';
import { Response } from 'express';

export class ApiResponse<T> {
    result: ApiResult<T>;
    errors: any[];

    public static success(data: any, page?: ApiPage): ApiResponse<any> {
        const result = new ApiResult();
        result.data = data;
        result.page = page;

        const response = new ApiResponse();
        response.result = result;

        return response;
    }

}
