export type Vacancy = {
  title: string;
  link: string;
  pubDate: string;
  content: string | string[] | { [key: string]: string };
  contentSnippet: string;
  id: string;
  isoDate: string;
};
