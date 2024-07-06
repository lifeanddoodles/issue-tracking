import ExternalLink from "../../../components/ExternalLink";
import Heading from "../../../components/Heading";
import Text from "../../../components/Text";
import { getVariantClasses } from "../../../utils";
import CodeSnippetsWithSummary from "./CodeSnippetsWithSummary";
import {
  CodeSnippetsSectionProps,
  FetchedCodeSnippetProps,
  MarkdownSnippetProps,
  SnippetExplanationProps,
} from "./types";

const designSystems = [
  {
    summary: "Atomic design",
    content: [
      {
        language: "markdown",
        markdown: `frontend/
├── src/
│   ├── components/
│   │   ├── AdminRoute
│   │   └── Avatar
│   │   └── Badge
│   │   └── Button
│   │   └── Chart
│   │   └── Comment
│   │   └── Details
│   │   └── // Other components
│   ├── // Other files and folders
├── // Other files
`,
      },
    ],
  },
  // {
  //   summary: "Theming",
  //   content: [
  //     {
  //       title: "Light/Dark mode",
  //       description: "",
  //       pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
  //       startLine: 0,
  //       endLine: 1,
  //     },
  //   ],
  // },
];

const designPatterns = [
  // {
  //   summary: "Component patterns",
  //   content: [
  //     {
  //       title: "Wrapper component",
  //       description: "",
  //       pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
  //       startLine: 0,
  //       endLine: 1,
  //     },
  //     {
  //       title: "Polymorphic component",
  //       description: "",
  //       pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
  //       startLine: 0,
  //       endLine: 1,
  //     },
  //   ],
  // },
  {
    summary: "Custom hooks",
    content: [
      {
        title: "useResourceInfo",
        description: "Includes useFetch custom hook.",
        pathToFile: "/frontend/src/hooks/useResourceInfo.ts",
        startLine: 6,
        endLine: 49,
      },
      {
        title: "useChart",
        description: "Includes useDimensions and useResponsive custom hooks.",
        pathToFile: "/frontend/src/hooks/useChart.tsx",
        startLine: 14,
        endLine: 81,
      },
    ],
  },
  {
    summary: "HOC",
    content: [
      {
        title: "withPortal",
        description: "",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
      {
        title: "withControls",
        description: "Add props to a form field and control buttons.",
        pathToFile:
          "/frontend/src/components/FieldWithControls/hoc/withControls.tsx",
        startLine: 5,
        endLine: 55,
      },
      {
        description: "Example:",
        pathToFile: "/frontend/src/components/FieldWithControls/index.tsx",
        startLine: 14,
        endLine: 69,
      },
      {
        title: "withUpdatableResourceForm",
        description: "Add logic to a form and update resource on submit.",
        pathToFile:
          "/frontend/src/components/withUpdatableResourceForm/index.tsx",
        startLine: 12,
        endLine: 181,
      },
      {
        description: "Example:",
        pathToFile: "/frontend/src/components/UpdatableResourceForm/index.tsx",
        startLine: 98,
        endLine: 140,
      },
    ],
  },
  {
    summary: "Functional programming",
    content: [
      {
        title: "Recursion",
        description: "",
        pathToFile: "/frontend/src/utils/index.tsx",
        startLine: 637,
        endLine: 666,
      },
      {
        title: "Composition",
        description: "The main component is the button.",
        pathToFile: "/frontend/src/components/Button/index.tsx",
        startLine: 5,
        endLine: 29,
      },
      {
        description: "The composed component is the icon button.",
        pathToFile: "/frontend/src/components/Button/IconButton.tsx",
        startLine: 4,
        endLine: 10,
      },
      // {
      //   title: "Partial components",
      //   description: "",
      //   pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
      //   startLine: 0,
      //   endLine: 1,
      // },
      {
        title: "Compound components",
        description: "The main component.",
        pathToFile: "/frontend/src/components/Comment/index.tsx",
        startLine: 0,
        endLine: 1,
      },
      {
        description: "Then create the sub-components header and footer.",
        pathToFile: "/frontend/src/components/Comment/index.tsx",
        startLine: 0,
        endLine: 1,
      },
      {
        description: "Lastly assign the sub-components to the main component.",
        pathToFile: "/frontend/src/components/Comment/index.tsx",
        startLine: 0,
        endLine: 1,
      },
      {
        title: "Provider pattern",
        description:
          "I've used the Context API to manage state and avoid prop drilling. Example: AuthContext.",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
      {
        description:
          "Use the state in a component or hook. Example: useAuthState.",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
      {
        description: "Example: Header.",
        pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
        startLine: 0,
        endLine: 1,
      },
      // {
      //   title: "Pub-Sub pattern",
      //   description: "Redux",
      //   pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
      //   startLine: 0,
      //   endLine: 1,
      // },
    ],
  },
];

// const performance = [
//   {
//     summary: "Code splitting",
//     content: [
//       {
//         title: "",
//         description: "",
//         pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
//         startLine: 0,
//         endLine: 1,
//       },
//     ],
//   },
//   {
//     summary: "Lazy loading",
//     content: [
//       {
//         title: "",
//         description: "",
//         pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
//         startLine: 0,
//         endLine: 1,
//       },
//     ],
//   },
//   {
//     summary: "Memoization",
//     content: [
//       {
//         title: "",
//         description: "",
//         pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
//         startLine: 0,
//         endLine: 1,
//       },
//     ],
//   },
//   {
//     summary: "Suspense",
//     content: [
//       {
//         title: "",
//         description: "",
//         pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
//         startLine: 0,
//         endLine: 1,
//       },
//     ],
//   },
//   {
//     summary: "Server-Side Rendering",
//     content: [
//       {
//         title: "",
//         description: "The example is actually this page.",
//         pathToFile: "/frontend/src/pages/auth/Register/index.tsx",
//         startLine: 0,
//         endLine: 1,
//       },
//     ],
//   },
// ];

const CodeSnippetsSection = ({
  title,
  codeSources,
}: CodeSnippetsSectionProps<
  (SnippetExplanationProps & FetchedCodeSnippetProps) | MarkdownSnippetProps
>) => {
  return (
    <section>
      {title && <Heading text={title} className="mt-8" />}
      {codeSources.map((item) => (
        <CodeSnippetsWithSummary key={item.summary} {...item} />
      ))}
    </section>
  );
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
      <CodeSnippetsSection codeSources={designSystems} title="Design systems" />
      <CodeSnippetsSection
        codeSources={designPatterns}
        title="Design patterns"
      />
      {/* <CodeSnippetsSection codeSources={performance} title="Performance" /> */}
    </>
  );
};

export default SeeTheCode;
