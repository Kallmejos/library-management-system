import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing. Add it to api/.env before seeding.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const catalog = [
  {
    name: 'Fiction',
    books: [
      ['Things Fall Apart', 'Chinua Achebe', 1958],
      ['The River Between', 'Ngũgĩ wa Thiong’o', 1965],
      ['A Grain of Wheat', 'Ngũgĩ wa Thiong’o', 1967],
      ['Purple Hibiscus', 'Chimamanda Ngozi Adichie', 2003],
    ],
  },
  {
    name: 'Science',
    books: [
      ['A Brief History of Time', 'Stephen Hawking', 1988],
      ['The Selfish Gene', 'Richard Dawkins', 1976],
      ['Cosmos', 'Carl Sagan', 1980],
      ['The Gene', 'Siddhartha Mukherjee', 2016],
    ],
  },
  {
    name: 'History',
    books: [
      ['The History of the Ancient World', 'Susan Wise Bauer', 2007],
      ['Long Walk to Freedom', 'Nelson Mandela', 1994],
      ['The Wretched of the Earth', 'Frantz Fanon', 1961],
      ['Africa: A Biography of the Continent', 'John Reader', 1997],
    ],
  },
  {
    name: 'Technology',
    books: [
      ['Clean Code', 'Robert C. Martin', 2008],
      ['The Pragmatic Programmer', 'Andrew Hunt and David Thomas', 1999],
      ['Code', 'Charles Petzold', 1999],
      ['The Innovators', 'Walter Isaacson', 2014],
    ],
  },
] as const;

async function main() {
  for (const group of catalog) {
    const genre = await prisma.genre.upsert({
      where: { name: group.name },
      update: {},
      create: { name: group.name },
    });

    for (const [title, author, publishedYear] of group.books) {
      await prisma.book.upsert({
        where: { isbn: `LIB-${group.name.toUpperCase()}-${title.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 35)}` },
        update: { title, author, publishedYear, genreId: genre.id },
        create: {
          title,
          author,
          publishedYear,
          genreId: genre.id,
          isbn: `LIB-${group.name.toUpperCase()}-${title.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 35)}`,
        },
      });
    }
  }

  const [genreCount, bookCount] = await Promise.all([
    prisma.genre.count(),
    prisma.book.count(),
  ]);

  console.log(`Seed complete: ${genreCount} genres and ${bookCount} books in the database.`);
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
