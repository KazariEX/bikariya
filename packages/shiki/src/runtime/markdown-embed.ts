import type { LanguageRegistration } from "shiki";

const MARKDOWN_SCOPES = ["text.html.markdown", "text.markdown.mdc.standalone", "source.mdx"];
const MARKDOWN_SELECTOR = MARKDOWN_SCOPES.map((scope) => `L:${scope}`).join(", ");
const MARKDOWN_HOSTS = new Set(["markdown", "mdc", "mdx"]);

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function withMarkdownEmbed(grammars: LanguageRegistration[]): LanguageRegistration[] {
  let hasMarkdownCodeblock = false;
  const patched = grammars.map((grammar) => {
    if (grammar.injectionSelector === "L:text.html.markdown" && grammar.scopeName !== "text.markdown.mdc.standalone") {
      hasMarkdownCodeblock = true;
      return {
        ...grammar,
        injectionSelector: MARKDOWN_SELECTOR,
        injectTo: [...new Set([...(grammar.injectTo ?? []), ...MARKDOWN_SCOPES])],
      };
    }
    return grammar;
  });

  if (!hasMarkdownCodeblock) {
    const main = patched.at(-1);
    if (main && !main.injectionSelector && main.scopeName && !MARKDOWN_HOSTS.has(main.name)) {
      const ids = [main.name, ...(main.aliases ?? [])].map(escapeRegExp).join("|");
      patched.push({
        name: `markdown-${main.name}-codeblock`,
        scopeName: `markdown.${main.name}.codeblock`,
        injectionSelector: MARKDOWN_SELECTOR,
        injectTo: MARKDOWN_SCOPES,
        repository: {},
        patterns: [{
          begin: `(^|\\G)(\\s*)(\`{3,}|~{3,})\\s*(?i:(${ids})((\\s+|[,:?{])[^\`~]*)?$)`,
          beginCaptures: {
            3: { name: "punctuation.definition.markdown" },
            4: { name: "fenced_code.block.language.markdown" },
            5: { name: "fenced_code.block.language.attributes.markdown" },
          },
          end: "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
          endCaptures: {
            3: { name: "punctuation.definition.markdown" },
          },
          name: "markup.fenced_code.block.markdown",
          patterns: [{
            begin: "(^|\\G)(\\s*)(.*)",
            while: "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
            contentName: `meta.embedded.block.${main.name}`,
            patterns: [{ include: main.scopeName }],
          }],
        }],
      });
    }
  }

  return patched;
}
