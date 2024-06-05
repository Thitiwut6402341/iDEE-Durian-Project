import { Body, Controller, Delete, Get, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { TreeRegisterService } from './tree-register.service';
import { RegisterTreeDto } from './dto/register-tree.dto';
import { EditTreeDto } from './dto/edit-tree.dto';
import { TreeDetailsDto } from './dto/tree-details.dto';

@Controller('tree-register')
export class TreeRegisterController {
  constructor(private readonly treeRegisterService: TreeRegisterService) {}

  @Post('register')
  RegisterNewTree(@Body(new ValidationPipe()) registerTreeDto: RegisterTreeDto) {
    return this.treeRegisterService.RegisterNewTree(registerTreeDto);
  }

  @Get('all-tree-register')
  GetAllTreeRegister() {
    return this.treeRegisterService.GetAllTreeRegister();
  }

  @Put('edit-tree')
  UpdateTreeRegister(@Body(new ValidationPipe()) editTreeDto: EditTreeDto) {
    return this.treeRegisterService.UpdateTreeRegister(editTreeDto);
  }
  
  @Delete('delete-tree')
  DeleteTreeRegister(@Query('treeCode') treeCode: string){
    return this.treeRegisterService.DeleteTreeRegister(treeCode);
  }
  
  @Post('tree-details')
  TreeDetails(@Body(new ValidationPipe()) treeDetailsDto: TreeDetailsDto){
    return this.treeRegisterService.TreeDetails(treeDetailsDto);
  }
}
