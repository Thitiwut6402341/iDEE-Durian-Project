import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ContainerDocument } from './schema/container.schema';
import { Container } from './schema/container.schema';
import mongoose, { Model, mongo, PipelineStage } from 'mongoose';
import { ContainerSendDto, UpdateContainerDto } from './dto';
import { TServiceResponse } from 'src/types/service-response';

@Injectable()
export class ContainerService {
  constructor(
    @InjectModel(Container.name)
    private ContainerModel: Model<ContainerDocument>,
  ) {}

  //TODO [POST] container/create-container
  async createContainer(input: ContainerSendDto): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const saved = await this.ContainerModel.create({
        // transport_id,
        reserve_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          input.reserve_id,
        ),
        container_no: input.container_no,
        created_at: now,
        updated_at: now,
      });

      return {
        status: 'success',
        statusCode: 201,
        message: 'Container created successfully',
        data: [saved],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message || 'Internal server error',
        data: [],
      };
    }
  }

  //* [GET] container/get-all-container
  async findContainerAll(): Promise<TServiceResponse> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $project: {
            _id: 0,
            container_id: { $toString: '$_id' },
            reserve_id: { $toString: '$reserve_id' },
            container_no: 1,
            created_at: {
              $dateToString: {
                date: '$created_at',
                timezone: 'Asia/Bangkok',
                format: '%Y-%m-%d %H:%M:%S',
              },
            },
            updated_at: {
              $dateToString: {
                date: '$updated_at',
                timezone: 'Asia/Bangkok',
                format: '%Y-%m-%d %H:%M:%S',
              },
            },
          },
        },
        {
          $sort: {
            container_id: 1,
          },
        },
      ];
      const results = await this.ContainerModel.aggregate(pipeline);
      return {
        status: 'success',
        statusCode: 200,
        message: 'Get all container successfully',
        data: results,
        // data: [],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message || 'Internal server error',
        data: [],
      };
    }
  }

  //? [PATCH] container/update-container/:transport_id
  async updateContainer(input: UpdateContainerDto): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const updated = await this.ContainerModel.updateOne(
        {
          _id: mongo.BSON.ObjectId.createFromHexString(input.container_id),
        },
        { container_no: input.container_no, updated_at: now },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Container updated successfully',
        data: [updated],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message || 'Internal server error',
        data: null,
      };
    }
  }

  //! [DELETE] container/delete-container
  async deleteContainer(container_id: string): Promise<TServiceResponse> {
    try {
      const deleted = await this.ContainerModel.deleteOne({
        _id: mongo.BSON.ObjectId.createFromHexString(container_id),
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'container deleted successfully',
        data: [deleted],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message || 'Internal server error',
        data: [],
      };
    }
  }
}
