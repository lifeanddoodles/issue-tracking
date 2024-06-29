import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";

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
