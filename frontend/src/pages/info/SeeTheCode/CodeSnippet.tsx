import { useEffect, useMemo, useState } from "react";
import Heading from "../../../components/Heading";
import { useTheme } from "../../../context/ThemeContext";
import useFetch from "../../../hooks/useFetch";
import { CodeSnippetProps } from "./types";
import { BASE_REPO_URL, generateCodeSnippet } from "./utils";

const CodeSnippet = ({
  pathToFile,
  language = "typescript",
  startLine = 0,
  endLine = -1,
}: CodeSnippetProps) => {
  const { data, loading, error } = useFetch({
    url: `${BASE_REPO_URL}${pathToFile}`,
  });
  const [code, setCode] = useState<string | null>(null);
  const { theme } = useTheme();

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
    if (theme === "dark") {
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
      className="mb-4 rounded-lg border-2 dark:border-neutral-800 overflow-hidden text-sm"
    />
  ) : null;
};

export default CodeSnippet;
