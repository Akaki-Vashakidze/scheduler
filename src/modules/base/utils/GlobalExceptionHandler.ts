import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ApiException } from "./ApiException.class";

@Catch(ApiException)
export class GlobalExceptionsFilter implements ExceptionFilter {
    catch(exception: ApiException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response
            .status(HttpStatus.BAD_REQUEST)
            .json({
                errors: [{ ...exception }]
            });
    }
}