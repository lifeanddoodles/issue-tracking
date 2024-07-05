export type FetchedCodeSnippetProps = {
  pathToFile?: string;
  language?: string;
  startLine?: number;
  endLine?: number;
};

export type MarkdownSnippetProps = {
  markdown: string;
  language?: string;
};

export type SnippetTextProps = {
  title?: string;
  description?: string;
};

export type SnippetExplanationProps =
  | Omit<MarkdownSnippetProps, "language">
  | SnippetTextProps;

export type CodeSnippetsWithSummaryProps<T> = {
  summary: string;
  content: T[];
};

export type CodeSnippetsSectionProps<T> = {
  title?: string;
  codeSources: CodeSnippetsWithSummaryProps<T>[];
};
