import { Fragment, useMemo } from "react";
import ErrorBoundary from "../../../ErrorBoundary";
import Heading from "../../../components/Heading";
import useFetch from "../../../hooks/useFetch";
import useParseMarkdown from "./hooks/useParseMarkdown";
import {
  CodeSnippetProps,
  FetchedCodeSnippetProps,
  FetchedSingleCodeSnippetProps,
  MarkdownSnippetProps,
} from "./types";
import {
  BASE_REPO_URL,
  getCodeExcerpt,
  hasMultipleCodeExcerpts,
} from "./utils";
import(`highlight.js/styles/a11y-dark.css`);

const MarkdownSnippet = ({ markdown, language }: MarkdownSnippetProps) => {
  const content = useParseMarkdown(markdown, language);

  return <ErrorBoundary>{content ?? null}</ErrorBoundary>;
};

const CodeSnippet = ({
  fileData,
  language = "typescript",
  startLine,
  endLine,
}: CodeSnippetProps) => {
  const codeSnippet = useMemo(
    () => getCodeExcerpt(fileData, startLine, endLine),
    [fileData, startLine, endLine]
  );
  const content = useParseMarkdown(codeSnippet, language);

  return <ErrorBoundary>{content ?? null}</ErrorBoundary>;
};

const FetchedCodeSnippet = ({
  pathToFile,
  language = "typescript",
  ...props
}: FetchedCodeSnippetProps) => {
  const { data, loading, error } = useFetch({
    url: `${BASE_REPO_URL}${pathToFile}`,
  });

  if (loading) return <Heading level={1} text="Loading..." />;
  if (error) return <Heading level={1} text={error.message} />;
  if (!data) return null;

  return hasMultipleCodeExcerpts(props) ? (
    <>
      {props.excerpts.map((excerpt, index) => (
        <Fragment key={index}>
          {excerpt.markdown && <MarkdownSnippet markdown={excerpt.markdown} />}
          <CodeSnippet
            key={index}
            startLine={excerpt.startLine}
            endLine={excerpt.endLine}
            fileData={data as string}
            language={language}
          />
        </Fragment>
      ))}
    </>
  ) : (
    <CodeSnippet
      startLine={(props as Partial<FetchedSingleCodeSnippetProps>).startLine}
      endLine={(props as Partial<FetchedSingleCodeSnippetProps>).endLine}
      fileData={data as string}
      language={language}
    />
  );
};

export { FetchedCodeSnippet, MarkdownSnippet };
