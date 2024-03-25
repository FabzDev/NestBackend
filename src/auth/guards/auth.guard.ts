import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor( private jwtService: JwtService, private authService: AuthService){} 

  async canActivate( context: ExecutionContext ): Promise<boolean> {
    
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if(!token) throw new UnauthorizedException('Token was not received')

    const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });

    const userFound = await this.authService.findUserById( payload.id );

    if(!userFound) throw new UnauthorizedException('User does not exist')
    if(!userFound.isActive) throw new UnauthorizedException('User is not active')
    
    req['user'] = userFound;

    return true;
  }

  extractTokenFromHeader(request){
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token: undefined;
  }
}
