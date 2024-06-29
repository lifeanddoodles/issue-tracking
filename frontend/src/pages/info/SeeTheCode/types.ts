export type CodeSnippetProps = {
  pathToFile?: string;
  language?: string;
  startLine?: number;
  endLine?: number;
};

export type CodeSnippetContentProps = {
  title: string;
  description: string;
} & CodeSnippetProps;

export type CodeSnippetsWithFetchProps = {
  summary: string;
  content: CodeSnippetContentProps[];
};

export type CodeSnippetsSectionProps = {
  codeSources: CodeSnippetsWithFetchProps[];
};
