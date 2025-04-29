import { Link } from "react-router-dom";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
// import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
// import remarkMath from "remark-math"; // Add math support
// import rehypeKatex from "rehype-katex"; // For rendering math equations
import "katex/dist/katex.min.css"; // KaTeX styles for math equations
import { useTheme } from "@mui/material/styles";
import rehypeRaw from "rehype-raw";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const theme = useTheme();

  const components: Partial<Components> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: ({ inline, className, children, ...props }: any) => {
      const isInline = inline ?? false;
      const match = /language-(\w+)/.exec(className || "");

      return !isInline && match ? (
        <pre
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll p-3 rounded-lg mt-2`}
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <code className={`language-${match[1]}`} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code
          className={`text-sm py-0.5 px-1 rounded-md ${className || ""}`}
          style={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
    p: ({ children, ...props }) => (
      <p className="py-0.5 whitespace-pre-line" {...props}>
        {children}
      </p>
    ),
    div: ({ children, ...props }) => (
      <div className="py-0.5 whitespace-pre-line" {...props}>
        {children}
      </div>
    ),

    ol: ({ children, ...props }) => (
      <ol
        className="list-decimal list-outside ml-8 mt-0.5 space-y-0.5 whitespace-normal"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="py-0.5 whitespace-normal" {...props}>
        {children}
      </li>
    ),
    ul: ({ children, ...props }) => (
      <ul
        className="list-disc list-outside ml-8 mt-0.5 space-y-0.5 whitespace-normal"
        {...props}
      >
        {children}
      </ul>
    ),

    strong: ({ children, ...props }) => (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    ),

    a: ({ children, ...props }) => (
      <Link
        className="hover:underline"
        style={{ color: theme.palette.primary.main }}
        target="_blank"
        rel="noreferrer"
        to={props.href || "#"}
        {...props}
      >
        {children}
      </Link>
    ),

    // Headings
    h1: ({ children, ...props }) => (
      <h1
        className="text-2xl font-semibold mt-6 mb-2"
        style={{ color: theme.palette.text.primary }}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-xl font-semibold mt-6 mb-2"
        style={{ color: theme.palette.text.primary }}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="text-lg font-semibold mt-6 mb-2"
        style={{ color: theme.palette.text.primary }}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="text-base font-semibold mt-6 mb-2"
        style={{ color: theme.palette.text.primary }}
        {...props}
      >
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5
        className="text-sm font-semibold mt-6 mb-2"
        style={{ color: theme.palette.text.primary }}
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6
        className="text-sm font-semibold mt-6 mb-2"
        style={{ color: theme.palette.text.primary }}
        {...props}
      >
        {children}
      </h6>
    ),

    // Table
    table: ({ children, ...props }) => (
      <div
        className="overflow-x-auto w-full my-3"
        style={{ fontSize: "15.8px" }}
      >
        <table className="border-collapse w-full" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead
        style={{
          backgroundColor: theme.palette.md_table.header_bg,
          color: theme.palette.md_table.header_text,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
        {...props}
      >
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody
        className="[&>tr]:border-b"
        style={{
          borderBottomColor: theme.palette.divider,
        }}
        {...props}
      >
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => {
      // Apply alternate row colors using Tailwind's odd: and even: modifiers
      const rowClasses =
        theme.palette.mode === "dark"
          ? "odd:bg-[#1e1e1e] even:bg-[#2c2c2c]"
          : "odd:bg-white even:bg-[#f9f9f9]";
      return (
        <tr className={rowClasses} {...props}>
          {children}
        </tr>
      );
    },
    th: ({ children, ...props }) => (
      <th
        className="px-4 py-2 text-center first:text-left first:whitespace-nowrap font-semibold"
        style={{
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => {
      // Default text color
      let textColor = theme.palette.text.primary;
      let displayText = children;

      if (typeof children === "string") {
        if (displayText == "_complete") {
          textColor = "green";
        } else if (displayText == "_pending") {
          textColor = "orange";
        } else if (displayText == "_canceled") {
          textColor = "red";
        }

        displayText = children.replace(/^_/, "");
      }
      return (
        <td
          className="px-4 py-2 text-center first:text-left first:whitespace-nowrap"
          style={{
            border: `1px solid ${theme.palette.divider}`,
            color: textColor,
          }}
          {...props}
        >
          {displayText}
        </td>
      );
    },
  };

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]} // Allow raw HTML in Markdown
      remarkPlugins={[remarkGfm]} // Enable math support // remarkMath || remarkGfm need for markdwon table display
      // rehypePlugins={[rehypeKatex, rehypeRaw]}  //ISSUE: It have some issue like white spaces puts above table (rehypeRaw)  and end of <body> (rehypeKatex)
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
