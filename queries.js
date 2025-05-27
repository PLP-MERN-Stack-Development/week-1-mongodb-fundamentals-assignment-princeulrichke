// queries.js - MongoDB queries for the books collection

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1.This will return all the books in the collection
    const allBooks = await collection.find({}).toArray();
    console.log('\n1. All books:');
    allBooks.forEach(book => console.log(`- ${book.title} by ${book.author}`));

    // 2.This will return the books that are written by George Orwell
    const orwellBooks = await collection.find({ author: "George Orwell" }).toArray();
    console.log('\n2. Books by George Orwell:');
    orwellBooks.forEach(book => console.log(`- ${book.title}`));

    // 3.This will return the books that are published after 1950
    const booksAfter1950 = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    console.log('\n3. Books published after 1950:');
    booksAfter1950.forEach(book => console.log(`- ${book.title} (${book.published_year})`));

    // 4.This will return the books that are in the Fiction genre
    const fictionBooks = await collection.find({ genre: "Fiction" }).toArray();
    console.log('\n4. Fiction books:');
    fictionBooks.forEach(book => console.log(`- ${book.title}`));

    // 5.This will return the books that are currently in stock
    const inStockBooks = await collection.find({ in_stock: true }).toArray();
    console.log('\n5. Books in stock:');
    inStockBooks.forEach(book => console.log(`- ${book.title}`));

    // 6.This will return the books with a price less than $10
    const cheapBooks = await collection.find({ price: { $lt: 10 } }).toArray();
    console.log('\n6. Books priced below $10:');
    cheapBooks.forEach(book => console.log(`- ${book.title} ($${book.price})`));

    // 7.This will return the books with more than 300 pages
    const thickBooks = await collection.find({ pages: { $gt: 300 } }).toArray();
    console.log('\n7. Books with more than 300 pages:');
    thickBooks.forEach(book => console.log(`- ${book.title} (${book.pages} pages)`));

    // 8.This will return the books sorted by published year in descending order
    const booksSortedByYear = await collection.find({}).sort({ published_year: -1 }).toArray();
    console.log('\n8. Books sorted by published year (newest first):');
    booksSortedByYear.forEach(book => console.log(`- ${book.title} (${book.published_year})`));

    // 9.This will return the count of books that are currently in stock
    const inStockCount = await collection.countDocuments({ in_stock: true });
    console.log(`\n9. Number of books in stock: ${inStockCount}`);

    // 10.This will return the average price of books grouped by genre, sorted by average price in descending order
    const avgPricePerGenre = await collection.aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" }, count: { $sum: 1 } } },
      { $sort: { avgPrice: -1 } }
    ]).toArray();
    console.log('\n10. Average price per genre:');
    avgPricePerGenre.forEach(item => {
      console.log(`- ${item._id}: $${item.avgPrice.toFixed(2)} (Count: ${item.count})`);
    });

  } catch (error) {
    console.error('Error running queries:', error);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

runQueries();
