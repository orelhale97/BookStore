import { BookStoreApplication } from './application';
import { AuthorRepository, BookRepository, PublisherRepository, RoleRepository, UserRepository } from './repositories';
import * as dotenv from 'dotenv';

dotenv.config();

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new BookStoreApplication();
  await app.boot();
  await app.migrateSchema({ existingSchema });

  const isBookInclude = args.includes('book');
  const isUserInclude = args.includes('user');

  if (isBookInclude) {
    console.log("Start to run creatingFakeBooks");
    await creatingFakeBooks(app);
  }

  if (isUserInclude) {
    console.log("Start to run creatingRoleAndUser");
    await creatingRoleAndUser(app);
  }


  process.exit(0);
}

async function creatingRoleAndUser(app: BookStoreApplication) {
  const roleRepository = await app.getRepository(RoleRepository);
  const userRepository = await app.getRepository(UserRepository);


  const adminRoleId = await roleRepository.findOrCreate({ where: { name: 'admin' } }, { name: "admin" });
  const userRoleId = await roleRepository.findOrCreate({ where: { name: 'user' } }, { name: "user" });

  console.log("Roles =", { adminRoleId, userRoleId });

  if (!adminRoleId) {
    console.error("Admin role not created");
  }

  if (process.env.ADMIN && adminRoleId) {
    const adminObject = JSON.parse(process.env.ADMIN);
    const admin = await userRepository.findOrCreate({ where: { name: "admin" } }, { ...adminObject, roleId: adminRoleId.id });
    console.log("admin =", admin);
  }
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});


async function creatingFakeBooks(app: BookStoreApplication) {
  const authorRepo = await app.getRepository(AuthorRepository);
  const publisherRepo = await app.getRepository(PublisherRepository);
  const bookRepo = await app.getRepository(BookRepository);

  const JKRowling = {
    author: "J.K. Rowling",
    publisher: "Bloomsbury",
    books: [
      "Harry Potter and the Philosopher's Stone",
      "Harry Potter and the Chamber of Secrets",
      "Harry Potter and the Prisoner of Azkaban",
      "Harry Potter and the Goblet of Fire",
      "Harry Potter and the Order of the Phoenix",
      "Harry Potter and the Half-Blood Prince",
      "Harry Potter and the Deathly Hallows"
    ]
  }

  const JonathanStroud = {
    author: 'Jonathan Stroud',
    publisher: "Corgi Children's Books",
    books: [
      'The Screaming Staircase',
      'The Whispering Skull',
      'The Hollow Boy',
      'The Creeping Shadow',
      'The Empty Grave',
    ]
  }

  const fakeBookList = [JKRowling, JonathanStroud];

  for (const item of fakeBookList) {
    const { author, publisher, books } = item;

    const newAuthor = await authorRepo.findOrCreate({ where: { name: author } }, { name: author });
    const newPublisher = await publisherRepo.findOrCreate({ where: { name: publisher } }, { name: publisher });
    console.log("New data =", { newAuthor, newPublisher });

    for (const book of books) {
      const random = Math.ceil(Math.random() * 180) + 50;
      const bookProperties = { name: book, authorId: newAuthor.id, publisherId: newPublisher.id, src: `${book}.jpg` };
      console.log("bookProperties = ", bookProperties);

      const newBook = await bookRepo.findOrCreate({ where: bookProperties }, bookProperties);
      console.log("newBook =", newBook);
    }
  }
}
