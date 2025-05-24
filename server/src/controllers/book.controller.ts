import {
  Count,
  Filter,
  FilterBuilder,
  FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { Book } from '../models';
import { AuthorRepository, BookRepository, PublisherRepository } from '../repositories';
import { authorize } from '@loopback/authorization';
import { authenticate } from '@loopback/authentication';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

export const uploadImage = (req: Request, res: Response) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the relative path to the uploaded file
    const imagePath = `/assets/uploads/${req.file.filename}`;
    res.json({ imagePath });
  });
};

export class BookController {
  constructor(
    @repository(BookRepository) public bookRepository: BookRepository,
    @repository(AuthorRepository) public authorRepository: AuthorRepository,
    @repository(PublisherRepository) public publisherRepository: PublisherRepository,
  ) { }


  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin'] })
  @post('/books')
  @response(200, {
    description: 'Book model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Book) } },
  })
  async create(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewBook',
            exclude: ['id'],
          }),
        },
      },
    })
    book: Omit<Book, 'id'>,
  ): Promise<Book> {
    const { name, authorId, publisherId } = book;

    const authorExists = await this.authorRepository.exists(authorId);
    if (!authorExists) {
      throw new HttpErrors.BadRequest(`Author with id ${authorId} does not exist`);
    }

    const publisherExists = await this.publisherRepository.exists(publisherId);
    if (!publisherExists) {
      throw new HttpErrors.BadRequest(`Publisher with id ${publisherId} does not exist`);
    }


    return this.bookRepository.createIfNotExists(book, { name });
  }


  @get('/books')
  @response(200, {
    description: 'Array of Book model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.query.string('search') search?: string,
  ): Promise<Book[]> {
    const filter = new FilterBuilder<Book>().include(['author', 'publisher']);

    if (search) {
      search = search.trim();
      filter.where({ name: { like: `%${search}%` } });
      // return (await this.searchBookOrAuther(search))
    }

    return this.bookRepository.find(filter.build());
  }


  // async searchBookOrAuther(search: string): Promise<Book[]> {
  //   const query = `
  //     SELECT 
  //       b.id
  //     FROM book b
  //     JOIN author a ON b.authorId = a.id
  //     WHERE b.name LIKE '%${search}%' OR a.name LIKE '%${search}%'
  //   `;
  //   const result = await this.bookRepository.dataSource.execute(query);
  //   const bookIds = result.map((item: any) => item.id);

  //   if (!bookIds.length) {
  //     return [];
  //   }

  //   const filter = new FilterBuilder<Book>()
  //     .include(['author', 'publisher'])
  //     .where({ id: { inq: bookIds } })
  //     .build();

  //   return this.bookRepository.find(filter);
  // }


  @get('/books/{id}')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Book, { exclude: 'where' }) filter?: FilterExcludingWhere<Book>
  ): Promise<Book> {
    return this.bookRepository.findById(id, filter);
  }



  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin'] })
  @put('/books/{id}')
  @response(204, {
    description: 'Book PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() book: Book,
  ): Promise<Book> {
    await this.bookRepository.replaceById(id, book);
    const filter = new FilterBuilder<Book>().include(['author', 'publisher']).where({ id: id }).build();
    return this.bookRepository.findById(id, filter);
  }


  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin'] })
  @del('/books/{id}')
  @response(204, {
    description: 'Book DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.bookRepository.deleteById(id);
  }
}
