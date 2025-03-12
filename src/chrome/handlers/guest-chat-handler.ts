import 'reflect-metadata';
import {
  Handler,
  dependencyInjection,
  errorHandler,
  responseWrapperMiddleware,
} from '@noony/core';
import { API_KEYS_TYPE, apiKeyMiddleware, bearerAuthMiddleware } from '../middleware/auth-custom.middleware';

const guestHistoryMessageHandler = Handler.use(dependencyInjection())
  .use(apiKeyMiddleware(API_KEYS_TYPE.GUEST))
  .use(bearerAuthMiddleware)
  // .use(bodyValidator(chatRequestSchema))
  .use(errorHandler())
  .use(responseWrapperMiddleware<any>())
  .handle(async (context: any) => {
    const body = context.req.body;
    // Implement member message sending logic
    console.log(`guestHistoryMessageHandler: ${body}`);
  });

const guestMessageHandler = Handler.use(dependencyInjection())
  .use(apiKeyMiddleware(API_KEYS_TYPE.GUEST))
  .use(bearerAuthMiddleware)
  // .use(bodyValidator(chatRequestSchema))
  .use(errorHandler())
  .use(responseWrapperMiddleware<any>())
  .handle(async (context: any) => {
    const body = context.req.body;
    // Implement member message sending logic
    console.log(`guestMessageHandler: ${body}`);
  });

export { guestHistoryMessageHandler, guestMessageHandler };
