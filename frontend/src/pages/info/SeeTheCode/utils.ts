import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
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

export const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

export const generateCodeSnippet = async (
  content: string,
  language: string
) => {
  const contentWrapper = `\`\`\`${language}\n${content}\n\`\`\``;
  return await marked.parse(contentWrapper);
};

export const generateContent = async (content: string, language?: string) => {
  try {
    if (language) return generateCodeSnippet(content, language);
    return await marked.parse(content);
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
