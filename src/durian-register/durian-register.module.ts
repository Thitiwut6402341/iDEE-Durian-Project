import { Module } from '@nestjs/common';
import { DurianRegisterService } from './durian-register.service';
import { DurianRegisterController } from './durian-register.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DurianRegistration,
  DurianRegistrationSchema,
} from 'src/schema/durian-registration.schema';
import {
  DepartmentProvincial,
  DepartmentProvincialDetailSchema,
} from 'src/schema/department-provincial.schema';
import {
  TreesRegistration,
  TreesRegistrationSchema,
} from 'src/schema/trees-registration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DurianRegistration.name, schema: DurianRegistrationSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: DepartmentProvincial.name,
        schema: DepartmentProvincialDetailSchema,
      },
    ]),
    MongooseModule.forFeature([
      { name: TreesRegistration.name, schema: TreesRegistrationSchema },
    ]),
  ],
  controllers: [DurianRegisterController],
  providers: [DurianRegisterService],
})
export class DurianRegisterModule { }
