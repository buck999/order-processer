import { NextFunction, Request, Response } from "express";

import { HttpError } from "../errors/http.error";

function errorMiddleware(
  error: HttpError,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  response.status(status).json({
    status,
    message
  });
}

export default errorMiddleware;
