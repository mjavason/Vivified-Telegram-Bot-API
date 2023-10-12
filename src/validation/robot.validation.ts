import { z } from 'zod';

class RobotValidation {
  // Validation schema for updating an existing robot
  analyze = {
    body: z.object({
      text: z.string(),
    }),
  };
}

export const robotValidation = new RobotValidation();
