import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  GetUserByEmailDto,
  GetUserByIdDto,
  UpdateSettingsDto,
} from './types/user.dto';
import { ApiMessageResponse } from 'src/lib/api.response';

@Controller('user')
export class UserController {
  constructor(private userSevice: UserService) {}

  @Post('/get-user-by-email')
  getUserByEmail(@Body() dto: GetUserByEmailDto) {
    return this.userSevice.getUserByEmail(dto);
  }

  @Post('/get-user-by-id')
  getUserByid(@Body() dto: GetUserByIdDto) {
    return this.userSevice.getUserById(dto);
  }

  @Post('/update-settings')
  updateSettings(@Body() dto: UpdateSettingsDto): Promise<ApiMessageResponse> {
    return this.userSevice.updateSettings(dto);
  }
}
