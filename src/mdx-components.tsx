import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import type { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 scroll-mt-4" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-3xl font-semibold mt-8 mb-4 scroll-mt-4" {...props} />
    ),
    h3: (props) => (
      <h3 className="text-2xl font-semibold mt-6 mb-3 scroll-mt-4" {...props} />
    ),
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 my-4 text-gray-600"
        {...props}
      />
    ),
    code: (props) => <code className="bg-gray-100 px-1 rounded" {...props} />,
    a: (props) => {
      // If this is a footnote backref, don't open in new tab and don't set rel
      // this overrides the default behavior of the rehype-sidenotes plugin
      if (props["data-footnote-backref"] !== undefined) {
        // Remove target and rel if present
        const rest = { ...props };
        delete rest.target;
        delete rest.rel;
        return <a {...rest} />;
      }
      return (
        <a
          className="text-blue-600 hover:text-blue-800 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      );
    },
    p: (props) => <p className="mb-5 leading-relaxed" {...props} />,
    hr: (props) => (
      <hr
        className="border-gray-200 border-t-2 my-8 xl:w-[calc(100%+4rem)] xl:-mx-8"
        {...props}
      />
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),
    ...components,
  };
}
