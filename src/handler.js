/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const isBookValid = request.payload.name !== undefined;
  const isPageValid = readPage <= pageCount;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  // const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isBookValid && isPageValid) {
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      // eslint-disable-next-line no-unneeded-ternary
      finished: pageCount === readPage ? true : false,
      reading,
      insertedAt,
      updatedAt,
    };
    books.push(newBook);

    const response = h.response({

      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } if (!isBookValid || request.payload.name === undefined || request.payload.name === null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (!isPageValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  if (request.query.reading === '0') {
    const getBook = books.filter((book) => book.reading === false);
    const arrBook = [];
    for (const item in getBook) {
      arrBook.push({
        id: getBook[item].id,
        name: getBook[item].name,
        publisher: getBook[item].publisher,
      });
    }
    const response = h.response({
      status: 'success',
      data: {
        books: arrBook,
      },
    });
    response.code(200);
    return response;
  } if (request.query.reading === '1') {
    const getBook = books.filter((book) => book.reading === true);
    const arrBook = [];
    for (const item in getBook) {
      arrBook.push({
        id: getBook[item].id,
        name: getBook[item].name,
        publisher: getBook[item].publisher,
      });
    }
    const response = h.response({
      status: 'success',
      data: {
        books: arrBook,
      },
    });
    response.code(200);
    return response;
  } if (request.query.finished === '0') {
    const getBook = books.filter((book) => book.finished === false);
    const arrBook = [];
    for (const item in getBook) {
      arrBook.push({
        id: getBook[item].id,
        name: getBook[item].name,
        publisher: getBook[item].publisher,
      });
    }
    const response = h.response({
      status: 'success',
      data: {
        books: arrBook,
      },
    });
    response.code(200);
    return response;
  } if (request.query.finished === '1') {
    const getBook = books.filter((book) => book.finished === true);
    const arrBook = [];
    for (const item in getBook) {
      arrBook.push({
        id: getBook[item].id,
        name: getBook[item].name,
        publisher: getBook[item].publisher,
      });
    }
    const response = h.response({
      status: 'success',
      data: {
        books: arrBook,
      },
    });
    response.code(200);
    return response;
  } if (request.query.name) {
    const getBook = books.filter((book) => book.name.includes(request.query.name));
    const arrBook = [];
    for (const item in getBook) {
      arrBook.push({
        id: getBook[item].id,
        name: getBook[item].name,
        publisher: getBook[item].publisher,
      });
    }
    const response = h.response({
      status: 'success',
      data: {
        books: arrBook,
      },
    });
    response.code(200);
    return response;
  }

  const getBookArr = [];

  for (const item in books) {
    getBookArr.push({
      id: books[item].id,
      name: books[item].name,
      publisher: books[item].publisher,
    });
  }

  const response = h.response({
    status: 'success',
    data: {
      books: getBookArr,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((book) => book.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const isNameValid = request.payload.name !== undefined;
  const isPageValid = readPage <= pageCount;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1 && isNameValid && isPageValid) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } if (!isNameValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (!isPageValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
