import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || exception.name;
      } else {
        message = exception.message;
      }
    }

    else if (
      exception &&
      typeof exception === 'object' &&
      'code' in exception &&
      typeof exception.code === 'string' &&
      exception.code.startsWith('P')
    ) {
      const prismaError = exception as {
        code: string;
        message: string;
        meta?: { target?: string; field_name?: string };
      };

      status = HttpStatus.BAD_REQUEST;

      switch (prismaError.code) {
        case 'P2002':
          message = `Unique constraint violation: ${prismaError.meta?.target || 'unknown field'}`;
          error = 'Unique Constraint Violation';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          error = 'Not Found';
          break;
        case 'P2003':
          message = `Foreign key constraint violation: ${prismaError.meta?.field_name || 'unknown field'}`;
          error = 'Foreign Key Constraint Violation';
          break;
        default:
          message = `Database error: ${prismaError.message}`;
          error = 'Database Error';
      }
    }
    else if (exception instanceof Error) {
      message = exception.message || 'An unexpected error occurred';
    }

    const messageArray = Array.isArray(message) ? message : [message];

    const errorResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
      message: messageArray,
      error: error,
    };

    response.status(status).json(errorResponse);
  }
}
