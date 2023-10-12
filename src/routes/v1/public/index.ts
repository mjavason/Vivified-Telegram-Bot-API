import express, { Request, Response } from 'express';
import { robotValidation } from '../../../validation';
import { processRequestBody } from 'zod-express-middleware';
import { analyze } from '../../../controllers';
import {
  BadRequestResponse,
  InternalErrorResponse,
  SuccessResponse,
} from '../../../helpers/response';
const router = express.Router();

router.post(
  '/analyze',
  processRequestBody(robotValidation.analyze.body),
  async (req: Request, res: Response) => {
    // Ensure that req.body is defined and contains the text property
    if (req.body && req.body.text) {
      const data = await analyze(req.body.text);

      if (!data) return InternalErrorResponse(res);

      return SuccessResponse(res, data);
    } else {
      // Handle the case where 'text' is missing in req.body
      return BadRequestResponse(res, 'text is missing in the body parameters.');
    }
  },
);

export default router;
