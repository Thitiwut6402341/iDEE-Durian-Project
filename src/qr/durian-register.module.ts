import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { DurianRegisterService } from './durian-register.service';
// import { DurianRegisterController } from './durian-register.controller';
import { DurianRegister, DurianRegisterSchema } from './schema/durian-register.schema';
// import { Area, AreaDetailSchema } from './schema/area.schema';
// import { OrchardRegister, OrchardRegisterSchema } from './schema/orchard-register.schema';
// import { TreesRegister, TreesRegisterSchema } from './schema/trees-register.schema';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DurianRegister.name, schema: DurianRegisterSchema }]),
    // MongooseModule.forFeature([{ name: Area.name, schema: AreaDetailSchema }]),
    // MongooseModule.forFeature([{ name: OrchardRegister.name, schema: OrchardRegisterSchema }]),
    // MongooseModule.forFeature([{ name: TreesRegister.name, schema: TreesRegisterSchema }]),
  //   JwtModule.register({
  //     secret: `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIi
  //     wibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOT
  //     AyMn0.VFb0qJ1LRg_4ujbZoRMXnVkUgiuKq5KxWqNdbKq_G9Vvz-S1zZa9LPxt
  //     HWKa64zDl2ofkT8F6jBt_K4riU-fPg`,
  //     signOptions: { expiresIn: '10h' },
  // })
],
  // controllers: [DurianRegisterController],
  // providers: [DurianRegisterService],
})
export class DurianRegisterModule {}