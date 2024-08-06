import { ConfigModule } from '@nestjs/config';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TreeRegisterModule } from './tree-register/tree-register.module';
import { DurianRegisterModule } from './durian-register/durian-register.module';
import { FruitStatusModule } from './fruit-status/fruit-status.module';
import { TransportationModule } from './transportation/transportation.module';
import { UserModule } from './user/user.module';
import { JwtMiddleware } from './common/middlewares/jwt.middleware';
import { OrchardRegisterModule } from './orchard-register/orchard-register.module';
import { PackingHouseRegisterModule } from './packing-house-register/packing-house-register.module';
import { PackingModule } from './packing/packing.module';
import { SettingModule } from './setting/setting.module';
import { QrModule } from './qr/qr.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RawdataModule } from './rawdata/rawdata.module';
import { PriceModule } from './price/price.module';
import { ExperimentModule } from './experiment/experiment.module';
import { QaProcessModule } from './qa-process/qa-process.module';
import { GradeSettingModule } from './grade-setting/grade-setting.module';
import { ChinaProcessModule } from './china-process/china-process.module';
import { TradeMarkSettingModule } from './trade-mark-setting/trade-mark-setting.module';
import { ReserveTransformationModule } from './reserve-transportation/reserve-transportation.module';
import { DurianProcessModule } from './durian-process/durian-process.module';
import { GpsTrackingModule } from './gps-tracking/gps-tracking.module';
import { ContainerModule } from './container/container.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      // 'mongodb://iiot-center2:%24nc.ii0t%402o2E@10.0.0.3:27017/iDEE_V2_DEV?authSource=admin',
      'mongodb://iiot-center2:%24nc.ii0t%402o2E@10.0.0.3:27017/iDEE_V2_PRD?authSource=admin',
    ),
    TreeRegisterModule,
    DurianRegisterModule,
    UserModule,
    OrchardRegisterModule,
    PackingHouseRegisterModule,
    PackingModule,
    SettingModule,
    QrModule,
    FruitStatusModule,
    TransportationModule,
    DashboardModule,
    RawdataModule,
    PriceModule,
    DurianProcessModule,
    ExperimentModule,
    QaProcessModule,
    ReserveTransformationModule,
    GradeSettingModule,
    ChinaProcessModule,
    TradeMarkSettingModule,
    GpsTrackingModule,
    ContainerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/dashboard/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/user/change-password',
      method: RequestMethod.PATCH,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/setting/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/packing/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/durian-process/*',
      method: RequestMethod.ALL,
    });

    consumer
      .apply(JwtMiddleware)
      .exclude('/tree-register/tree-details')
      .forRoutes({
        path: '/tree-register/*',
        method: RequestMethod.ALL,
      });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/durian-register/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/packing/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/fruit-status/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/orchard-register/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/packing-house-register/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/price/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/durian-process/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/raw-data/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/qa-process/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/grade-setting/*',
      method: RequestMethod.ALL,
    });
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/reserve/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/china-process/*',
      method: RequestMethod.ALL,
    });
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/trademark-setting/*',
      method: RequestMethod.ALL,
    });
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/gps-tracking/*',
      method: RequestMethod.ALL,
    });
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/container/*',
      method: RequestMethod.ALL,
    });
  }
}
