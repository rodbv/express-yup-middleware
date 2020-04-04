import { NextFunction, Request, Response } from 'express'
import { BAD_REQUEST } from 'http-status-codes'

import { ExpressYupMiddlewareInterface } from './schema-validation-interface'
import { validatePayload } from './schema-validator'

const defaultPropertiesToValidate = ['params', 'body', 'query']

export const expressYupMiddleware = ({
  schemaValidator,
  expectedStatusCode,
  propertiesToValidate = defaultPropertiesToValidate,
}: {
  schemaValidator: ExpressYupMiddlewareInterface
  expectedStatusCode?: number
  propertiesToValidate?: string[]
}) => async (req: Request, res: Response, next: NextFunction) => {
  const errors = await validatePayload({
    schemaValidator,
    payload: req,
    propertiesToValidate,
  })

  if (!Object.keys(errors).length) {
    return next()
  }

  return res.status(expectedStatusCode || BAD_REQUEST).send({ errors })
}
