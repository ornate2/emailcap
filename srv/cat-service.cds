using my.bookshop as my from '../db/data-model';

service CatalogService {
    @readonly entity Books as projection on my.Books;

    action submitOrder(book : Books:ID, quantity : Integer);
}
