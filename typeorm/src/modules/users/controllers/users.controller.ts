import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { Serialize } from 'src/common/interceptors';
import { UpdateUserDto, UserResponseDto } from '../dtos';
import { UsersService } from '../services';

@Controller('users')
@Serialize(UserResponseDto) // Serializes response to exclude password
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
