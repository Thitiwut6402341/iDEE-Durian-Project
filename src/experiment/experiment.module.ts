import { Module } from '@nestjs/common';
import { ExperimentService } from './experiment.service';
import { ExperimentController } from './experiment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Experiment, ExperimentSchema } from 'src/schema/experiment';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Experiment.name, schema: ExperimentSchema },
    ]),
  ],
  controllers: [ExperimentController],
  providers: [ExperimentService],
})
export class ExperimentModule {}
