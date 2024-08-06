import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { TreeRegisterService } from './tree-register.service';
import { RegisterTreeDto } from './dto/register-tree.dto';
import { EditTreeDto } from './dto/edit-tree.dto';
import { TreeDetailsDto } from './dto/tree-details.dto';
import { Response } from 'express';

@Controller('tree-register')
export class TreeRegisterController {
  constructor(private readonly treeRegisterService: TreeRegisterService) {}

  @Post('register')
  async createTrees(
    @Body() registerTreeDto: RegisterTreeDto,
    @Res() res: Response,
  ) {
    // return this.treeRegisterService.createTrees(registerTreeDto);
    const result = await this.treeRegisterService.createTrees(registerTreeDto);
    return res.status(res.statusCode).json(result);
  }

  @Get('all-tree-register')
  async getAllTreeRegister(@Res() res: Response) {
    // return this.treeRegisterService.GetAllTreeRegister();
    const result = await this.treeRegisterService.getAllTreeRegister();
    return res.status(res.statusCode).json(result);
  }

  @Put('edit-tree')
  async updateTreeRegister(
    @Body() editTreeDto: EditTreeDto,
    @Res() res: Response,
  ) {
    // return this.treeRegisterService.updateTreeRegister(editTreeDto);
    const result =
      await this.treeRegisterService.updateTreeRegister(editTreeDto);
    return res.status(res.statusCode).json(result);
  }

  @Delete('delete-tree')
  async deleteTreeRegister(
    @Query('tree_code') tree_code: string,
    @Res() res: Response,
  ) {
    // return this.treeRegisterService.deleteTreeRegister(tree_code);
    const result = await this.treeRegisterService.deleteTreeRegister(tree_code);
    return res.status(res.statusCode).json(result);
  }

  @Post('tree-details')
  async getTreeDetails(
    @Body() treeDetailsDto: TreeDetailsDto,
    @Res() res: Response,
  ) {
    // return this.treeRegisterService.getTreeDetails(treeDetailsDto);
    const result =
      await this.treeRegisterService.getTreeDetails(treeDetailsDto);
    return res.status(res.statusCode).json(result);
  }
}
