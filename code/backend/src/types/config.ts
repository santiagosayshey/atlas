export interface Config {
  content: {
    basePath: string;
    reviews: {
      movies: string;
      tv: string;
      books: string;
    };
  };
  logs: {
    directory: string;
  };
}
