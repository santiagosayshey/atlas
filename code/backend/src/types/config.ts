export interface Config {
  content: {
    basePath: string;
    reviews: {
      movies: string;
      tv: string;
      books: string;
    };
    habits: {
      all: string;
    };
  };
  logs: {
    directory: string;
  };
}
