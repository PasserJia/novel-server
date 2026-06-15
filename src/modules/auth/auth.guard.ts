import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InMemoryStore } from '../../store/in-memory.store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly store: InMemoryStore) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: unknown;
      token?: string;
    }>();
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : undefined;
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const session = await this.store.findSession(token);
    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    const user = await this.store.findUserById(session.userId);
    if (!user || user.status !== 'enabled') {
      throw new UnauthorizedException('Account is disabled or unavailable');
    }

    request.user = user;
    request.token = token;
    return true;
  }
}
