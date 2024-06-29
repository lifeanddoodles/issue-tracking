import ExternalLink from "frontend/src/components/ExternalLink";
import Heading from "../../../components/Heading";
import Text from "../../../components/Text";
import { getVariantClasses } from "../../../utils";
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
      <section>
        <Heading level={1} text="Code snippets" />
        <Text>
          Here are some code snippets that I believe can prove interesting, and
          that you can use to analyze my approach to solving problems and
          creating the features for an application of this magnitude.
        </Text>
        <Text>
          Feel free to check them out and if you are interested in learning
          more, you can visit the repo on GitHub:
        </Text>
        <ExternalLink
          href="https://github.com/lifeanddoodles/issue-tracking"
          className={`${getVariantClasses("outline")} mb-4`}
        >
          Go to project repo
        </ExternalLink>
      </section>
      <section>
        <Heading text="Client flows" />
        <CodeSnippetsSection codeSources={clientFlowsCodeSamples} />
      </section>
      <section>
        <Heading text="Customer success flows" className="mt-8" />
        <CodeSnippetsSection codeSources={customerSuccessFlowsCodeSamples} />
      </section>
    </>
  );
};

export default SeeTheCode;
