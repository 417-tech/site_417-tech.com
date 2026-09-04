import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../lib/og-image';
import { legalOrder } from '../../data/site';

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

// One entry per real page — mirrors the title/description each page passes to <Base>.
export async function getStaticPaths() {
  const [home] = await getCollection('home');
  const services = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
  const legalDocs = await getCollection('legal');

  const pages: { path: string; title: string; description: string }[] = [
    { path: 'index', title: home.data.heading, description: home.data.intro },
    {
      path: 'contact',
      title: 'Contact',
      description: "Get in touch with 417 Tech to discuss consultation, software development, systems administration or network engineering work.",
    },
    {
      path: 'contact/success',
      title: 'Message sent',
      description: "Your message to 417 Tech has been sent. We'll get back to you as soon as we can.",
    },
    {
      path: 'credits',
      title: 'Image credits',
      description: 'Photography and illustration credits for images used across the 417 Tech website.',
    },
    {
      path: 'sitemap',
      title: 'Sitemap',
      description: 'Every page on the 417 Tech website, including services and legal documents.',
    },
    {
      path: 'services',
      title: 'Services',
      description: 'Consultation, software development, systems administration, network engineering and miscellaneous technical work from 417 Tech.',
    },
  ];

  for (const s of services) {
    pages.push({ path: `services/${s.id}`, title: s.data.title, description: s.data.oneLiner });
  }

  for (const policy of legalOrder) {
    const versions = legalDocs
      .filter((d) => d.data.policy === policy)
      .sort((a, b) => b.data.date.localeCompare(a.data.date));
    const current = versions.find((v) => v.data.current) ?? versions[0];
    if (!current) continue;

    pages.push({
      path: `legal/${policy}`,
      title: current.data.title,
      description: `Read 417 Tech's ${current.data.title} — current version ${current.data.version}, published ${fmt(current.data.date)}.`,
    });
    for (const v of versions) {
      pages.push({
        path: `legal/${policy}/${v.data.version}`,
        title: `${v.data.title} ${v.data.version}`,
        description: `Archived copy of 417 Tech's ${v.data.title} ${v.data.version}, published ${fmt(v.data.date)}.`,
      });
    }
  }

  return pages.map(({ path, title, description }) => ({ params: { path }, props: { title, description } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as { title: string; description: string };
  return new Response(new Uint8Array(await generateOgImage(title, description)), {
    headers: { 'Content-Type': 'image/png' },
  });
};
