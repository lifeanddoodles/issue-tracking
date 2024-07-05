import { useEffect, useState } from "react";
import { generateContent } from "../utils";

const useParseMarkdown = (content: string | null, language?: string) => {
  const [parsedMarkdown, setParsedMarkdown] = useState("");

  useEffect(() => {
    if (!content) return;

    generateContent(content, language).then(setParsedMarkdown);
  }, [content, language]);

  return parsedMarkdown;
};

export default useParseMarkdown;
