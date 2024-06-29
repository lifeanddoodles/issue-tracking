import Heading from "../../../components/Heading";
import CodeSnippetsWithFetch from "./CodeSnippetsWithFetch";
import { CodeSnippetsSectionProps } from "./types";

const clientFlowsCodeSamples = [
  {
    summary: "Create account",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
      {
        title: "Create account second step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 225,
        endLine: 246,
      },
    ],
  },
  {
    summary: "Edit profile",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
  {
    summary: "Create company",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
  {
    summary: "Create project",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
  {
    summary: "Create ticket",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
  {
    summary: "Create comment",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
  {
    summary: "Request status update",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
  {
    summary: "View notifications",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
  {
    summary: "View dashboard",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
];
const customerSuccessFlowsCodeSamples = [
  {
    summary: "Create company",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
  {
    summary: "Create project",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
  {
    summary: "Create/Update ticket",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
  {
    summary: "View dashboard",
    content: [
      {
        title: "Create account first step",
        description: "Lorem ipsum dolor.",
        language: "typescript",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
    ],
  },
];

const CodeSnippetsSection = ({ codeSources }: CodeSnippetsSectionProps) => {
  return codeSources.map((item) => (
    <CodeSnippetsWithFetch
      key={item.summary}
      summary={item.summary}
      content={item.content}
    />
  ));
};

const SeeTheCode = () => {
  return (
    <>
      <Heading level={1} text="Code snippets" />
      <Heading text="Client flows" />
      <CodeSnippetsSection codeSources={clientFlowsCodeSamples} />
      <Heading text="Customer success flows" className="mt-8" />
      <CodeSnippetsSection codeSources={customerSuccessFlowsCodeSamples} />
    </>
  );
};

export default SeeTheCode;
