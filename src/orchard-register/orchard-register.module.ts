import { Module } from '@nestjs/common';
import { OrchardRegisterService } from './orchard-register.service';
import { OrchardRegisterController } from './orchard-register.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrchardRegister,
  OrchardRegisterSchema,
} from 'src/schema/orchard/orchard-register.schema';
import {
  DepartmentProvincial,
  DepartmentProvincialSchema,
} from 'src/schema/orchard/department-provincial.schema';
import {
  DataCollection,
  DataCollectionSchema,
} from 'src/schema/hardware/data-collection.schema';
import {
  TreesRegistration,
  TreesRegistrationSchema,
} from 'src/schema/trees/trees-registration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrchardRegister.name, schema: OrchardRegisterSchema },
      { name: DepartmentProvincial.name, schema: DepartmentProvincialSchema },
      { name: DataCollection.name, schema: DataCollectionSchema },
      { name: TreesRegistration.name, schema: TreesRegistrationSchema },
    ]),
  ],
  controllers: [OrchardRegisterController],
  providers: [OrchardRegisterService],
})
export class OrchardRegisterModule { }
