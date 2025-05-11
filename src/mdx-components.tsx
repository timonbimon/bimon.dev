import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import type { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 scroll-mt-4" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-2xl font-semibold mt-8 mb-4 scroll-mt-4" {...props} />
    ),
    h3: (props) => (
      <h3 className="text-xl font-semibold mt-6 mb-3 scroll-mt-4" {...props} />
    ),
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 my-4 text-gray-600"
        {...props}
      />
    ),
    code: (props) => <code className="bg-gray-100 px-1 rounded" {...props} />,
    a: (props) => {
      const isExternal =
        props.href?.startsWith("http") || props.href?.startsWith("//");

      return (
        <a
          className="text-blue-600 hover:text-blue-800 transition-colors"
          {...(isExternal
            ? {
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {})}
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
    figure: (props) => <figure className="my-8" {...props} />,
    figcaption: (props) => (
      <figcaption
        className="text-sm -mt-4 text-gray-600 text-center prose prose-sm max-w-none"
        {...props}
      />
    ),
    img: (props) => {
      const { alt, width, height, ...rest } = props as ImageProps;

      return (
        <Image
          alt={alt || ""}
          width={width ? Number(width) : 1200}
          height={height ? Number(height) : 630}
          sizes="100vw"
          style={{
            width: width ? `${width}px` : "100%",
            height: "auto",
          }}
          className="rounded-lg mx-auto my-8 block"
          {...rest}
        />
      );
    },
    ul: (props) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
    ),
    ol: (props) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
    ),
    li: (props) => <li className="marker:text-gray-500" {...props} />,
    ...components,
  };
}
