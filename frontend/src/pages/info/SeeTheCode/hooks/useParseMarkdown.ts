import { ReactNode, useEffect, useState } from "react";
import { generateContent } from "../utils";

const useParseMarkdown = (content: string | null, language?: string) => {
  const [parsedMarkdown, setParsedMarkdown] = useState<ReactNode>(null);

  useEffect(() => {
    if (!content) return;

    const generatedMarkup = generateContent(content, language);
    setParsedMarkdown(generatedMarkup as ReactNode);
  }, [content, language]);

  return parsedMarkdown;
};

export default useParseMarkdown;
