// Renders a schema.org JSON-LD block. AI search engines (and Google) parse this
// to understand, verify, and cite the site. Keep the data consistent with what's
// visible on the page.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
