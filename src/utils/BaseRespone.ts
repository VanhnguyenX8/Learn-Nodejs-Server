import { ApiResponse, PaginationMeta } from '../models/APIResponeModel';

export function successRes<T>(data: T, message = 'Success', status_code = 200): ApiResponse<T> {
  return { status_code, data, message };
}

export function successPageRes<T>(data: T,
  message = 'Success',
  status_code = 200,
  pagination?: PaginationMeta): ApiResponse<T> {
  return { status_code, data, message, ...(pagination ? { pagination } : {}) };
}

export function notfoundRes(message = 'Not Found', status_code = 404, data: any = null): ApiResponse {
  return { status_code, data, message };
}

export function createSuccessRes(message: string = 'Create Success', status_code = 201, data: any = null): ApiResponse {
  return { status_code, data, message };
}


export function errorRes<T>(data: T, message = 'Internal Server Error', status_code = 500): ApiResponse<T> {
  return { status_code, data, message };
}

export function badRequestRes(message = 'Bad Request', status_code = 400, data: any = null): ApiResponse {
  return { status_code, data, message };
}
export function unauthorizedRes(message = 'Unauthorized', status_code = 401, data: any = null): ApiResponse {
  return { status_code, data, message };
}

export function customRes<T>(data: T, message: string, status_code: number): ApiResponse<T> {
  return { status_code, data, message };
}