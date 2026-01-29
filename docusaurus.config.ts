import type * as Preset from "@docusaurus/preset-classic"
import type { Config } from "@docusaurus/types"
import { DOCUSAURUS_VERSION } from "@docusaurus/utils"
import { themes as prismThemes } from "prism-react-renderer"

const config: Config = {
    title: "Forge",
    tagline: "Learn. Build. Discover.",
    favicon: "img/favicon.ico",

    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    url: "https://forge.zayedbinhasan.me",
    baseUrl: "/",
    organizationName: "frost23z",
    projectName: "forge",

    onBrokenLinks: "throw",

    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    editUrl: "https://github.com/frost23z/forge/tree/main/",
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ["rss", "atom"],
                        xslt: true,
                    },
                    editUrl: "https://github.com/frost23z/forge/tree/main/",
                    onInlineTags: "warn",
                    onInlineAuthors: "warn",
                    onUntruncatedBlogPosts: "warn",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    markdown: {
        mermaid: true,
    },
    themes: ["@docusaurus/theme-mermaid"],

    themeConfig: {
        colorMode: {
            respectPrefersColorScheme: true,
        },
        image: "img/social-card.png",
        docs: {
            sidebar: {
                hideable: true,
                autoCollapseCategories: true,
            },
        },
        navbar: {
            title: "Forge",
            logo: {
                alt: "Forge Logo",
                src: "img/logo.svg",
            },
            items: [
                {
                    type: "docSidebar",
                    sidebarId: "tutorialSidebar",
                    position: "left",
                    label: "Tutorial",
                },
                { to: "/blog", label: "Blog", position: "left" },
                {
                    href: "https://github.com/frost23z/forge",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            // Add languages for syntax highlighting in code blocks
            // Already bundled: cpp, go, graphql, js-extras, json, jsx, kotlin, markdown, markup, objectivec, python, reason, rust, swift, tsx, yaml
            // Check if default bundled got updated: https://github.com/FormidableLabs/prism-react-renderer/blob/master/packages/generate-prism-languages/index.ts#L10-L25
            // Find available languages: ls node_modules/prismjs/components/ | grep "^prism-" | sed 's/prism-//' | sed 's/\.js$//' | sed 's/\.min$//' | sort -u
            additionalLanguages: [
                "bash",
                "c",
                "csharp",
                "css-extras",
                "csv",
                "dart",
                "diff",
                "docker",
                "editorconfig",
                "git",
                "gradle",
                "graphql",
                "http",
                "ini",
                "java",
                "javadoc",
                "json5",
                "latex",
                "log",
                "lua",
                "makefile",
                "nginx",
                "php-extras",
                "plant-uml",
                "powershell",
                "properties",
                "protobuf",
                "regex",
                "ruby",
                "sass",
                "scss",
                "sql",
                "toml",
                "typescript",
                "wasm",
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "Tutorial",
                            to: "/docs/intro",
                        },
                    ],
                },
                {
                    title: "Community",
                    items: [
                        {
                            label: "Stack Overflow",
                            to: "https://stackoverflow.com/questions/tagged/docusaurus",
                        },
                        {
                            label: "Discord",
                            to: "https://discordapp.com/invite/docusaurus",
                        },
                        {
                            label: "X",
                            to: "https://x.com/docusaurus",
                        },
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "Docusaurus Blog",
                            to: "https://docusaurus.io/blog",
                        },
                        {
                            label: "Docusaurus GitHub",
                            to: "https://github.com/facebook/docusaurus",
                        },
                        {
                            label: "Community GitHub",
                            to: "https://github.com/DocusaurusCommunity",
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Shaiekh Zayed Bin Hasan. Built with <a href="https://docusaurus.io">Docusaurus v${DOCUSAURUS_VERSION}</a>.`,
        },
    } satisfies Preset.ThemeConfig,
}

export default config
