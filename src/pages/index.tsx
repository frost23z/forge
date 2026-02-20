import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Heading from "@theme/Heading"
import Layout from "@theme/Layout"
import type { LucideIcon } from "lucide-react"
import {
    ArrowRight,
    BookOpen,
    MessageSquareQuote,
    PenLine,
    Search,
    SquareTerminal,
} from "lucide-react"
import type { ReactNode } from "react"

import styles from "./index.module.css"

type TopicItem = {
    title: string
    description: string
    href: string
    tag: string
    Icon: LucideIcon
}

const topics: TopicItem[] = [
    {
        title: "Docs",
        description: "Structured technical notes and practical references by topic.",
        href: "/docs/intro",
        tag: "Reference",
        Icon: BookOpen,
    },
    {
        title: "Blog",
        description: "Experiments, mistakes, and cool finds from real-world learning.",
        href: "/blog",
        tag: "Journal",
        Icon: PenLine,
    },
    {
        title: "Search",
        description: "Jump directly to concepts, snippets, and ideas when you need them.",
        href: "/search",
        tag: "Fast Access",
        Icon: Search,
    },
]

function HeroSection() {
    return (
        <header className={styles.heroBanner}>
            <div className="container">
                <div className={styles.heroGrid}>
                    <div>
                        <p className={styles.eyebrow}>Personal Knowledge Base</p>
                        <Heading as="h1" className={styles.title}>
                            Notes, tweaks, and cool finds
                        </Heading>
                        <p className={styles.subtitle}>
                            A personal knowledge base for programming notes, experiments, and
                            discoveries. Built for learning, organized for reference.
                        </p>
                        <div className={styles.actions}>
                            <Link className="button button--primary button--lg" to="/docs/intro">
                                Explore Topics
                            </Link>
                            <Link className="button button--secondary button--lg" to="/blog">
                                Read Latest Notes
                            </Link>
                        </div>
                    </div>

                    <div className={styles.terminal}>
                        <div className={styles.terminalHeader}>
                            <span className={styles.terminalDot} />
                            <span className={styles.terminalDot} />
                            <span className={styles.terminalDot} />
                            <div className={styles.terminalTitleGroup}>
                                <SquareTerminal
                                    size={13}
                                    className={styles.terminalTitleIcon}
                                    strokeWidth={2}
                                />
                                <span className={styles.terminalTitle}>knowledge-base.log</span>
                            </div>
                        </div>
                        <pre className={styles.terminalBody}>
                            <span className={styles.prompt}>$</span>
                            {" cat topics.txt\n"}
                            <span className={styles.tTree}>{"\u251c\u2500\u2500 git/\n"}</span>
                            <span className={styles.tTree}>{"\u251c\u2500\u2500 java/\n"}</span>
                            <span className={styles.tTree}>{"\u251c\u2500\u2500 linux/\n"}</span>
                            <span className={styles.tTree}>{"\u2514\u2500\u2500 "}</span>
                            <span className={styles.tMuted}>{"...more\n\n"}</span>
                            <span className={styles.prompt}>$</span>
                            {' grep -r "learning"\n'}
                            <span className={styles.tOk}>{"\u2713 Found 100+ notes\n\n"}</span>
                            <span className={styles.prompt}>$ </span>
                            <span className={styles.cursor}>{"_"}</span>
                        </pre>
                    </div>
                </div>
            </div>
        </header>
    )
}

function TopicsSection() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.sectionHeading}>
                    <Heading as="h2" className={styles.sectionTitle}>
                        Explore Topics
                    </Heading>
                    <p className={styles.sectionText}>
                        Dive into organized notes and documentation
                    </p>
                </div>

                <div className={styles.topicGrid}>
                    {topics.map((topic) => (
                        <Link key={topic.title} className={styles.topicCard} to={topic.href}>
                            <div className={styles.topicCardHead}>
                                <span className={styles.topicIcon}>
                                    <topic.Icon size={22} strokeWidth={1.5} />
                                </span>
                                <span className={styles.topicTag}>{topic.tag}</span>
                            </div>
                            <Heading as="h3" className={styles.topicTitle}>
                                {topic.title}
                            </Heading>
                            <p className={styles.topicDescription}>{topic.description}</p>
                            <span className={styles.topicCta}>
                                Open
                                <ArrowRight
                                    size={14}
                                    strokeWidth={2}
                                    className={styles.topicCtaArrow}
                                />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

function QuoteSection() {
    return (
        <section className={styles.quoteSection}>
            <div className="container">
                <blockquote className={styles.quote}>
                    <MessageSquareQuote size={18} strokeWidth={1.5} className={styles.quoteIcon} />
                    <span>
                        The best time to document something is when you learn it. The second best
                        time is now.
                    </span>
                </blockquote>
            </div>
        </section>
    )
}

export default function Home(): ReactNode {
    const { siteConfig } = useDocusaurusContext()
    return (
        <Layout title={siteConfig.title} description={siteConfig.tagline}>
            <HeroSection />
            <main className={styles.main}>
                <TopicsSection />
                <QuoteSection />
            </main>
        </Layout>
    )
}
