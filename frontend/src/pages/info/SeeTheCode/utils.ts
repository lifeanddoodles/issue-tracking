import hljs from "highlight.js";
import * as marked from "marked";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { getClasses } from "../../../components/Heading/utils";
import {
  FetchedCodeSnippetProps,
  MarkdownSnippetProps,
  SnippetExplanationProps,
  SnippetTextProps,
} from "./types";

export type Theme = "light" | "dark";

export const BASE_REPO_URL = `https://raw.githubusercontent.com/${
  import.meta.env.VITE_GITHUB_USER
}/${import.meta.env.VITE_GITHUB_REPO}/${import.meta.env.VITE_GITHUB_BRANCH}`;

const codeHighlighter = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

/**
 * Configure the renderer
 */
const renderer = new marked.Renderer();
renderer.heading = ({ tokens, depth }) => {
  return `<h${depth} class="${`title-font text-neutral-900 dark:text-white font-medium mb-4 ${getClasses(
    depth
  )}`}">${tokens[0].raw}</h${depth}>`;
};
renderer.code = ({ text, lang }) => {
  const highlighted = codeHighlighter.parse(
    `\`\`\`${lang}\n${text}\n\`\`\``
  ) as string;

  return highlighted;
};

marked.setOptions({
  renderer,
});

export const generateCodeSnippet = (content: string, language: string) => {
  const codeFormat = `\`\`\`${language}\n${content}\n\`\`\``;
  return marked.parse(codeFormat);
};

export const generateContent = (content: string, language?: string) => {
  try {
    if (language) return generateCodeSnippet(content, language);
    return marked.parse(content);
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error parsing content";
  }
};

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
