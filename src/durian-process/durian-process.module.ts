import { Module } from '@nestjs/common';
import { DurianProcessService } from './durian-process.service';
import { DurianProcessController } from './durian-process.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RejectProcess, RejectProcessSchema } from 'src/schema/durian-process/reject-process.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RejectProcess.name, schema: RejectProcessSchema },
      { name: User.name, schema: UserSchema },

    ]),],
  controllers: [DurianProcessController],
  providers: [DurianProcessService],
})
export class DurianProcessModule { }
