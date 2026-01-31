import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class MediaService {
  private uploadDir: string;
  private maxFileSize: number;
  private allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    this.maxFileSize = parseInt(
      this.configService.get('MAX_FILE_SIZE') || '5242880',
    );
    void this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File) {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File too large. Maximum size: ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    await fs.writeFile(filepath, file.buffer);

    const port = this.configService.get('PORT') || 3001;
    const url = `http://localhost:${port}/uploads/${filename}`;

    return {
      filename,
      url,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async deleteImage(filename: string) {
    const filepath = path.join(this.uploadDir, filename);

    try {
      await fs.unlink(filepath);
      return { message: 'File deleted successfully' };
    } catch (_error) {
      throw new BadRequestException('File not found or already deleted');
    }
  }
}
