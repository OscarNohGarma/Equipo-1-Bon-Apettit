import { Module } from '@nestjs/common';

import { FireAuthService } from '../../../services/fire-auth/fire-auth.service';
import { FireAuthController } from '../../..//controllers/fire-auth/fire-auth.controller';

@Module({
  
  providers: [FireAuthService],
  controllers: [FireAuthController],
})
export class FireAuthModule {}

