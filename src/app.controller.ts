import { Controller, Get, ImATeapotException } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/teapot')
  teapot() {
    return new ImATeapotException();
  }
}
