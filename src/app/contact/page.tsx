import { siteConfig } from "@/lib/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact Hamza Hanif, the publisher of TextHelper.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Questions, feedback, or a problem with a tool? {siteConfig.publisherName} publishes {siteConfig.name}.
      </p>
      <p className="mt-8 max-w-xl">
        Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary underline">
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </div>
  );
}
