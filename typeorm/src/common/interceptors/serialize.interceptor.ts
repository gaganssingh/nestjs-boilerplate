import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  // Any class
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run this before a request is handled by the request handler
    // console.log('Running before the request handler', context);

    // Run this after the request handler has run:
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          // Only respond with values marked with @Expose()
          // in the this.dto
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
