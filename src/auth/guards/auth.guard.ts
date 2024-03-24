import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor( private jwtService: JwtService){} 

  canActivate( context: ExecutionContext ): Promise<boolean> {
    
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    
    console.log(token);

    

    return Promise.resolve(true);
  }

  extractTokenFromHeader(request){
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    return type === 'Bearer' ? token: undefined;
  }
}
