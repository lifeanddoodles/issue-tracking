import { useMemo } from "react";
import ErrorBoundary from "../../../ErrorBoundary";
import Heading from "../../../components/Heading";
import useFetch from "../../../hooks/useFetch";
import useParseMarkdown from "./hooks/useParseMarkdown";
import { FetchedCodeSnippetProps, MarkdownSnippetProps } from "./types";
import { BASE_REPO_URL } from "./utils";
import(`highlight.js/styles/a11y-dark.css`);

const ParsedContent = ({ content }: { content: string }) => (
  <div
    dangerouslySetInnerHTML={{ __html: content }}
    className="mb-2 rounded-lg border-2 dark:border-neutral-800 overflow-hidden text-sm"
  />
);

const FetchedCodeSnippet = ({
  pathToFile,
  language = "typescript",
  startLine = 0,
  endLine = -1,
}: FetchedCodeSnippetProps) => {
  const { data, loading, error } = useFetch({
    url: `${BASE_REPO_URL}${pathToFile}`,
  });
  const codeSnippet = useMemo(() => {
    if (!data) return null;

    const snippet = (data as string)
      .split("\n")
      .slice(
        startLine === 0 ? startLine : startLine - 1,
        endLine === -1 ? endLine : endLine + 1
      )
      .join("\n");
    return snippet;
  }, [data, startLine, endLine]);
  const content = useParseMarkdown(codeSnippet, language);

  if (loading) return <Heading level={1} text="Loading..." />;
  if (error) return <Heading level={1} text={error.message} />;

  return (
    <ErrorBoundary>
      {content ? <ParsedContent content={content} /> : null}
    </ErrorBoundary>
  );
};

const MarkdownSnippet = ({ markdown, language }: MarkdownSnippetProps) => {
  const content = useParseMarkdown(markdown, language);

  return (
    <ErrorBoundary>
      {content ? <ParsedContent content={content} /> : null}
    </ErrorBoundary>
  );
};

export { FetchedCodeSnippet, MarkdownSnippet };
