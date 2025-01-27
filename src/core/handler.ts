import Container from 'typedi';
import { Context, CustomRequest, CustomResponse } from '../framework/middlewares/base/Middleware';

export interface BaseMiddleware {
  before?: (context: Context) => Promise<void>;
  after?: (context: Context) => Promise<void>;
  onError?: (error: Error, context: Context) => Promise<void>;
}

export class Handler {
  private BaseMiddlewares: BaseMiddleware[] = [];
  private handler!: (context: Context) => Promise<void>;

  static use(BaseMiddleware: BaseMiddleware): Handler {
    const handler = new Handler();
    handler.BaseMiddlewares.push(BaseMiddleware);
    return handler;
  }

  use(BaseMiddleware: BaseMiddleware): Handler {
    this.BaseMiddlewares.push(BaseMiddleware);
    return this;
  }

  handle(handler: (context: Context) => Promise<void>): Handler {
    this.handler = handler;
    return this;
  }

  async execute(req: CustomRequest, res: CustomResponse): Promise<void> {
    const context: Context = {
      container: Container.of(),
      req,
      res,
      error: null,
      businessData: new Map(),
    };

    try {
      // Execute before BaseMiddlewares
      for (const BaseMiddleware of this.BaseMiddlewares) {
        if (BaseMiddleware.before) {
          await BaseMiddleware.before(context);
        }
      }

      await this.handler(context);

      for (const BaseMiddleware of [...this.BaseMiddlewares].reverse()) {
        if (BaseMiddleware.after) {
          await BaseMiddleware.after(context);
        }
      }
    } catch (error) {
      for (const BaseMiddleware of [...this.BaseMiddlewares].reverse()) {
        if (BaseMiddleware.onError) {
          await BaseMiddleware.onError(error as Error, context);
        }
      }
    }
  }
}
