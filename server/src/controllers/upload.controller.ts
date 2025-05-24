import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { post, requestBody, response } from '@loopback/rest';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { repository } from '@loopback/repository';
import { BookRepository } from '../repositories/book.repository';
import { inject } from '@loopback/core';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../assets/uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

export class UploadController {
  constructor(
    @repository(BookRepository) public bookRepository: BookRepository,
  ) { }

  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin'] })
  @post('/books/upload')
  @response(200, {
    description: 'Upload image and return path',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            imagePath: { type: 'string' },
          },
        },
      },
    },
  })
  async uploadImage(
    @inject('rest.http.request') request: Request,
    @inject('rest.http.response') response: Response,
  ): Promise<{ imagePath: string }> {
    return new Promise((resolve, reject) => {
      upload(request, response, (err) => {
        if (err) {
          console.error('Error uploading file:', err);
          reject(err);
          return;
        }

        if (!request.file) {
          reject(new Error('No file uploaded'));
          return;
        }

        // Return the relative path to the uploaded file (without leading slash)
        const imagePath = `assets/uploads/${request.file.filename}`;
        resolve({ imagePath });
      });
    });
  }
} 
