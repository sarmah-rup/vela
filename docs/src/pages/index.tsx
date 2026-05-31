import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

type Capability = {title: string; href: string; icon: string; body: string};

const CAPABILITIES: Capability[] = [
  {
    title: 'Generate',
    href: '/capabilities/generate',
    icon: '/img/icons/generate.svg',
    body: 'Text-to-image, image-to-video, text-to-speech, and image-to-3D, the start of most pipelines.',
  },
  {
    title: 'Identity',
    href: '/capabilities/identity',
    icon: '/img/icons/identity.svg',
    body: 'Faceswap, identity lock & replace, instamodel, virtual try-on, and voice clone.',
  },
  {
    title: 'Editing',
    href: '/capabilities/editing',
    icon: '/img/icons/editing.svg',
    body: 'Instruction-based image editing in natural language, no masks required.',
  },
  {
    title: 'Background',
    href: '/capabilities/background',
    icon: '/img/icons/background.svg',
    body: 'Replace backgrounds and relight any image, generated or uploaded.',
  },
  {
    title: 'Branding',
    href: '/capabilities/branding',
    icon: '/img/icons/branding.svg',
    body: 'Generate logos and branded templates, constrained to your palette.',
  },
  {
    title: 'Upscale',
    href: '/capabilities/upscale',
    icon: '/img/icons/upscale.svg',
    body: 'Resolution upscaling and detail enhancement, the perfect final step.',
  },
];

const SAMPLE = `curl https://api.imagepipeline.io/generate/image/v1 \\
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "a person in a red jacket on a rooftop at golden hour",
    "width": 1024,
    "height": 1024
  }'`;

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>
          Generate, preserve, swap, and animate{' '}
          <span className="vela-gradient-text">real people</span>
        </h1>
        <p className={styles.heroSubtitle}>
          An identity generation API built from independent primitives that compose into
          full content workflows, with async jobs, webhooks, and provenance built in.
        </p>
        <div className={styles.heroButtons}>
          <Link className="button button--primary button--lg" to="/quickstart">
            Get started
          </Link>
          <Link className="button button--secondary button--lg" to="/api">
            API Reference
          </Link>
        </div>
      </div>

      <div className={styles.heroMedia}>
        <div className={styles.heroFrame}>
          {/* On-model shot pulled from the marketing home hero (served at the app
              root, so no useBaseUrl). */}
          <img
            className={styles.heroImage}
            src="/img/ip2/69773c05ff330c75b2550fc3_Botika_Homepage_WhiteCurlyAIModel_Mobile.avif"
            alt="AI-generated on-model look"
            loading="eager"
            width={720}
            height={900}
          />
        </div>

        {/* Dev cues — terminal-style API calls floating over the shot. */}
        <div className={`${styles.devCue} ${styles.devCueTL}`}>
          <div className={styles.devRow}>
            <span className={styles.devDollar}>$</span>
            <span className={styles.devMethod}>POST</span>
            <span className={styles.devPath}>/generate/image/v1</span>
          </div>
          <div className={styles.devPrompt}>
            prompt: &quot;curly hair, pastel studio, beauty&quot;
            <span className={styles.devCaret}>▋</span>
          </div>
        </div>

        <div className={`${styles.devCue} ${styles.devCueMR}`}>
          <div className={styles.devRow}>
            <span className={styles.devDollar}>$</span>
            <span className={styles.devMethod}>POST</span>
            <span className={styles.devPath}>/identity/faceswap/v1</span>
          </div>
        </div>

        <div className={`${styles.devCue} ${styles.devCueBR}`}>
          <div className={styles.devRow}>
            <span className={styles.devDollar}>$</span>
            <span className={styles.devMethod}>POST</span>
            <span className={styles.devPath}>/background/replace/v1</span>
          </div>
          <div className={styles.devPrompt}>
            status: <span className={styles.devOk}>200 · succeeded</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Capabilities() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>Capabilities</span>
          <h2 className={styles.sectionTitle}>Composable primitives</h2>
          <p className={styles.sectionLede}>
            Every endpoint is an independent primitive. Use one, or chain them into a
            full content pipeline.
          </p>
        </div>

        <div className={styles.grid}>
          {CAPABILITIES.map((c) => (
            <Link key={c.title} to={c.href} className={clsx('card', styles.card)}>
              <img className={styles.cardIcon} src={useBaseUrl(c.icon)} alt="" width={48} height={48} />
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardBody}>{c.body}</p>
              <span className={styles.cardLink}>Read the guide →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section className={clsx(styles.section, styles.sectionMuted)}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>Composable workflows</span>
          <h2 className={styles.sectionTitle}>Chain primitives into pipelines</h2>
          <p className={styles.sectionLede}>
            Each step passes its <code>result_url</code> to the next. Same async job
            model, end to end.
          </p>
        </div>
        <div className={styles.diagramFrame}>
          <img
            className={styles.diagram}
            src={useBaseUrl('/img/diagrams/workflow-chain.svg')}
            alt="Generate to Background to Upscale workflow"
            width={920}
            height={200}
          />
        </div>
      </div>
    </section>
  );
}

function StartBuilding() {
  return (
    <section className={styles.section}>
      <div className={clsx(styles.sectionInner, styles.codeRow)}>
        <div className={styles.codeCopy}>
          <span className={styles.kicker}>Quickstart</span>
          <h2 className={styles.sectionTitle}>One call to your first image</h2>
          <p className={styles.sectionLede}>
            Authenticate with a single header, submit a job, and poll or receive a
            webhook when it completes.
          </p>
          <div className={styles.heroButtons}>
            <Link className="button button--primary button--lg" to="/docs/quickstart">
              Read the quickstart
            </Link>
          </div>
        </div>
        <div className={styles.codeBlock}>
          <CodeBlock language="bash" title="Generate an image">
            {SAMPLE}
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Documentation" description={siteConfig.tagline}>
      <Hero />
      <main>
        <Capabilities />
        <Workflow />
        <StartBuilding />
      </main>
    </Layout>
  );
}
