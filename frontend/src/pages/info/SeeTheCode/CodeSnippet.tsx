import { useEffect, useMemo, useState } from "react";
import Heading from "../../../components/Heading";
import useFetch from "../../../hooks/useFetch";
import { BASE_REPO_URL, generateCodeSnippet, type Theme } from "./utils";

const CodeSnippet = ({
  pathToFile,
  language = "typescript",
  startLine = 0,
  endLine = -1,
}: {
  pathToFile?: string;
  language?: string;
  startLine?: number;
  endLine?: number;
}) => {
  const { data, loading, error } = useFetch({
    url: `${BASE_REPO_URL}${pathToFile}`,
  });
  const [code, setCode] = useState<string | null>(null);
  const theme: Theme = "light";

  const codeSnippet = useMemo(() => {
    if (!data) return null;
    const snippet = (data as string)
      .split("\n")
      .slice(startLine, endLine === -1 ? endLine : endLine + 1)
      .join("\n");
    return snippet;
  }, [data, startLine, endLine]);

  useEffect(() => {
    if (codeSnippet) {
      generateCodeSnippet(codeSnippet, language).then((snippet) => {
        setCode(snippet);
      });
    }
  }, [codeSnippet, language]);

  useEffect(() => {
    if (theme === ("dark" as Theme)) {
      import("highlight.js/styles/a11y-dark.css");
    } else {
      import("highlight.js/styles/a11y-light.css");
    }
  }, [theme]);

  if (loading) return <Heading level={1} text="Loading..." />;
  if (error) return <Heading level={1} text={error.message} />;

  return code ? (
    <div
      dangerouslySetInnerHTML={{ __html: code }}
      className="mb-4 rounded-lg border-2 overflow-hidden text-sm"
    />
  ) : null;
};

export default CodeSnippet;
