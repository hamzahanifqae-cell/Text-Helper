import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { operatorConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the team behind TextHelper.",
  alternates: { canonical: "/contact" },
};

function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.CONTACT_SMTP_HOST &&
      process.env.CONTACT_SMTP_USER &&
      process.env.CONTACT_SMTP_PASS &&
      process.env.CONTACT_TO_EMAIL
  );
}

export default function ContactPage() {
  const smtpConfigured = isSmtpConfigured();
  const hasEmail = Boolean(operatorConfig.contactEmail);

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Questions, feedback, or a problem with a tool? Get in touch.
      </p>

      <div className="mt-8">
        {smtpConfigured ? (
          <ContactForm />
        ) : hasEmail ? (
          <p className="text-sm">
            Email us directly at{" "}
            <a href={`mailto:${operatorConfig.contactEmail}`} className="text-primary underline">
              {operatorConfig.contactEmail}
            </a>
            .
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            The contact form isn&apos;t available right now. Please check back later.
          </p>
        )}
      </div>
    </div>
  );
}
