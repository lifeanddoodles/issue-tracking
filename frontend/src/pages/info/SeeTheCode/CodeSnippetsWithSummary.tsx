import React, { Fragment } from "react";
import Details from "../../../components/Details";
import Heading from "../../../components/Heading";
import Text from "../../../components/Text";
import { FetchedCodeSnippet, MarkdownSnippet } from "./CodeSnippet";
import {
  CodeSnippetsWithSummaryProps,
  FetchedCodeSnippetProps,
  MarkdownSnippetProps,
  SnippetExplanationProps,
} from "./types";
import {
  isFetchedCodeSnippetProps,
  isMarkdownSnippetProps,
  isSnippetTextProps,
} from "./utils";

const CodeSnippetsWithSummary: React.FC<
  CodeSnippetsWithSummaryProps<
    (SnippetExplanationProps & FetchedCodeSnippetProps) | MarkdownSnippetProps
  >
> = ({ summary, content }) => {
  return (
    <Details summary={summary} key={summary}>
      {content.map((item, index) => (
        <Fragment key={index}>
          {isMarkdownSnippetProps(item) && !isFetchedCodeSnippetProps(item) ? (
            <MarkdownSnippet
              markdown={(item as MarkdownSnippetProps).markdown}
              language={item.language}
            />
          ) : (
            <Fragment>
              {isSnippetTextProps(item) ? (
                <>
                  {item.title && <Heading level={3} text={item.title} />}
                  {item.description && <Text>{item.description}</Text>}
                </>
              ) : (
                item.markdown && <MarkdownSnippet markdown={item.markdown} />
              )}
              {
                <FetchedCodeSnippet
                  pathToFile={item.pathToFile}
                  startLine={item.startLine}
                  endLine={item.endLine}
                />
              }
            </Fragment>
          )}
        </Fragment>
      ))}
    </Details>
  );
};

export default CodeSnippetsWithSummary;
