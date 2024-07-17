export type CodeExcerpt = {
  markdown?: string;
  startLine?: number;
  endLine?: number;
};

export type CodeSnippetProps = {
  fileData: string;
  language?: string;
} & CodeExcerpt;

export type MultipleCodeExcerpts = {
  excerpts: CodeExcerpt[];
};

export type FetchedCodeSnippetBaseProps = {
  pathToFile?: string;
  language?: string;
};

export type FetchedSingleCodeSnippetProps = FetchedCodeSnippetBaseProps &
  CodeExcerpt;

export type FetchedMultipleCodeSnippetProps = FetchedCodeSnippetBaseProps &
  MultipleCodeExcerpts;

export type FetchedCodeSnippetProps =
  | FetchedSingleCodeSnippetProps
  | FetchedMultipleCodeSnippetProps;

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
