import DOMPurify from "dompurify";
import hljs from "highlight.js";
import Markdown, { ReactRenderer } from "marked-react";
import Heading from "../../../components/Heading";
import Text from "../../../components/Text";
import {
  FetchedCodeSnippetProps,
  FetchedMultipleCodeSnippetProps,
  MarkdownSnippetProps,
  SnippetExplanationProps,
  SnippetTextProps,
} from "./types";

export type Theme = "light" | "dark";

export const BASE_REPO_URL = `https://raw.githubusercontent.com/${
  import.meta.env.VITE_GITHUB_USER
}/${import.meta.env.VITE_GITHUB_REPO}/${import.meta.env.VITE_GITHUB_BRANCH}`;

export const isSnippetTextProps = (
  item: SnippetExplanationProps
): item is SnippetTextProps => {
  return "title" in item || "description" in item;
};

export const isMarkdownSnippetProps = (
  item:
    | (SnippetExplanationProps & FetchedCodeSnippetProps)
    | MarkdownSnippetProps
): item is MarkdownSnippetProps => {
  return "markdown" in item;
};

export const isFetchedCodeSnippetProps = (
  item:
    | (SnippetExplanationProps & FetchedCodeSnippetProps)
    | MarkdownSnippetProps
): item is SnippetExplanationProps & FetchedCodeSnippetProps => {
  return "pathToFile" in item;
};

export const hasMultipleCodeExcerpts = (
  item: FetchedCodeSnippetProps
): item is FetchedMultipleCodeSnippetProps => {
  return "excerpts" in item && item?.excerpts !== undefined;
};

/**
 * Configure the renderer
 */
const renderer = {
  code(text: string, lang: string) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";

    return (
      <pre key={text} className="my-4">
        <code
          className={`hljs language-${lang}`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              hljs.highlight(text, { language }).value
            ),
          }}
        />
      </pre>
    );
  },
  heading(children: string, level: 1 | 2 | 3 | 4) {
    return (
      <Heading
        level={level || 2}
        text={children}
        key={children}
        className="mt-6"
      />
    );
  },
  paragraph(children: string[]) {
    return <Text key={children.join("")}>{children}</Text>;
  },
};

/**
 *
 * TODO: Sanitize HTML post processing
 *
 * https://marked.js.org/using_pro#hooks
 * https://github.com/cure53/DOMPurify
 */

export const generateCodeSnippet = (content: string, language: string) => {
  const codeFormat = `\`\`\`${language}\n${content}\n\`\`\``;

  return (
    <Markdown
      value={codeFormat}
      renderer={renderer as unknown as Partial<ReactRenderer>}
      langPrefix="hljs language-"
    />
  );
};

export const generateContent = (content: string, language?: string) => {
  try {
    if (language) return generateCodeSnippet(content, language);

    return (
      <Markdown
        value={content}
        renderer={renderer as unknown as Partial<ReactRenderer>}
        key={content}
      />
    );
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error parsing content";
  }
};

export const getCodeExcerpt = (
  codeFile: string,
  startLine: number = 0,
  endLine: number = -1
) => {
  if (!codeFile) return null;

  const snippet = (codeFile as string)
    .split("\n")
    .slice(
      startLine === 0 ? startLine : startLine - 1,
      endLine === -1 ? endLine : endLine + 1
    )
    .join("\n");
  return snippet;
};
