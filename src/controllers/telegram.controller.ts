import { Request, Response } from 'express';
import path from 'path';


class Controller {
  async default(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '/index.html'));
  }
}

export const telegramController = new Controller();
