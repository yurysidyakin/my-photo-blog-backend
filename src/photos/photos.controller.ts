import { Controller, Get } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Photo } from './schemas/photo.schema';

@Controller('main')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get()
  async getPhotos(): Promise<Photo[]> {
    return this.photosService.findAll();
  }
}
