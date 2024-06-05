import { ConfigModule } from "@nestjs/config";
import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { DurianRegisterModule } from "./durian-register/durian-register.module";
import { FruitStatusModule } from "./fruit-status/fruit-status.module";
import { TransportationModule } from "./transportation/transportation.module";
import { UserModule } from "./user/user.module";
import { JwtMiddleware } from "./common/middlewares/jwt.middleware";
import { SettingModule } from "./setting/setting.module";
import { QaProcessModule } from './qa-process/qa-process.module';
import { GradeSettingModule } from './grade-setting/grade-setting.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
            "mongodb://iiot-center2:%24nc.ii0t%402o2E@10.0.0.3:27017/iDEE_PRD?authSource=admin"
        ),
        DurianRegisterModule,
        UserModule,
        SettingModule,
        FruitStatusModule,
        TransportationModule,
        QaProcessModule,
        GradeSettingModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes({
            path: "/dashboard/*",
            method: RequestMethod.ALL,
        });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/user/change-password",
            method: RequestMethod.PATCH,
        });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/setting/*",
            method: RequestMethod.ALL,
        });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/packing/*",
            method: RequestMethod.ALL,
        });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/durian-process/*",
            method: RequestMethod.ALL,
        });

        consumer
            .apply(JwtMiddleware)
            .exclude("/tree-register/tree-details")
            .forRoutes({
                path: "/tree-register/*",
                method: RequestMethod.ALL,
            });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/durian-register/*",
            method: RequestMethod.ALL,
        });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/packing/*",
            method: RequestMethod.ALL,
        });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/fruit-status/*",
            method: RequestMethod.ALL,
        });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/orchard-register/*",
            method: RequestMethod.ALL,
        });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/packing-house-register/*",
            method: RequestMethod.ALL,
        });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/price/*",
            method: RequestMethod.ALL,
        }); //! new

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/raw-data/*",
            method: RequestMethod.ALL,
        }); //! new

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/qa-process/*",
            method: RequestMethod.ALL,
        });

        consumer.apply(JwtMiddleware).forRoutes({
            path: "/grade-setting/*",
            method: RequestMethod.ALL,
        });
    }
}
