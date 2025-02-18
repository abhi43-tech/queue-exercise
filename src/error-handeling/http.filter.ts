import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let message = exception.message;

    if (exception instanceof ValidationError) {
      message = exception.message;
    } else if ((exception.getResponse() as any)?.message) {
      message = (exception.getResponse() as any)?.message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      path: request.url,
    });
  }
}
