import React, { Fragment } from "react";
import Details from "../../../components/Details";
import Heading from "../../../components/Heading";
import Text from "../../../components/Text";
import CodeSnippet from "./CodeSnippet";
import { CodeSnippetsWithFetchProps } from "./types";

const CodeSnippetsWithFetch: React.FC<CodeSnippetsWithFetchProps> = ({
  summary,
  content,
}) => {
  return (
    <Details summary={summary} key={summary}>
      {content.map((item, index) => (
        <Fragment key={item.title || index}>
          {item.title && <Heading level={3} text={item.title} />}
          {item.description && <Text>{item.description}</Text>}
          {item.pathToFile && (
            <CodeSnippet
              pathToFile={item.pathToFile}
              startLine={item.startLine}
              endLine={item.endLine}
            />
          )}
        </Fragment>
      ))}
    </Details>
  );
};

export default CodeSnippetsWithFetch;
