import { Module } from '@nestjs/common';
import { RawdataService } from './rawdata.service';
import { RawdataController } from './rawdata.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExperimentData, ExperimentDataSchema } from 'src/schema/experiment-data/experiment-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ExperimentData.name, schema: ExperimentDataSchema }]),],
  controllers: [RawdataController],
  providers: [RawdataService],
})
export class RawdataModule { }
