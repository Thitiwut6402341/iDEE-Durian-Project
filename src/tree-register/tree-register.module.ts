import { Module } from '@nestjs/common';
import { TreeRegisterService } from './tree-register.service';
import { TreeRegisterController } from './tree-register.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TreesRegistration, TreesRegistrationSchema } from 'src/schema/trees-registration.schema';
import { OrchardRegister, OrchardRegisterSchema } from 'src/schema/orchard-registration.schema';
import { DurianRegistration, DurianRegistrationSchema } from 'src/schema/durian-registration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: TreesRegistration.name, schema: TreesRegistrationSchema}]),
    MongooseModule.forFeature([{name: OrchardRegister.name, schema: OrchardRegisterSchema}]),
    MongooseModule.forFeature([{name: DurianRegistration.name, schema: DurianRegistrationSchema}]),
  ],
  controllers: [TreeRegisterController],
  providers: [TreeRegisterService],
})
export class TreeRegisterModule {}
