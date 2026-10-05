import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { getHomeData } from "~/lib/api";
import { cn, img, useSite } from "~/lib/ui";
import { SiteLink } from "~/components/SiteLink";
import { ProjectCard, SectionHeading } from "~/components/ui";
import { ArrowRight, SearchIcon } from "~/components/Icons";
import { LogoMarquee, TestimonialSlider } from "~/components/Sliders";
import { FaqList } from "~/components/FaqList";
import { pathOn } from "~/lib/features";

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  component: Home,
});

function Home() {
  const s = useSite();
  const { services, projects, testimonials, clients, faqs } = Route.useLoaderData();
  const h = s.hero;
  const home = s.home;
  const center = h.align === "center";
  const overlay = Math.min(0.9, Math.max(0, Number(h.overlay) || 0));
  const f = s.features;
  const L = s.labels;

  return (
    <>
      {/* HERO */}
      <section
        className="relative flex items-center overflow-hidden bg-primary text-white"
        style={{ minHeight: `max(560px, ${Math.min(100, Math.max(40, Number(h.height) || 90))}vh)` }}
      >
        {h.image && <img src={img(h.image, 2400)} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />}
        <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className={cn("container-x relative pb-20 pt-[calc(var(--header-h)+3rem)]", center && "text-center")}>
          {h.eyebrow && <p className="eyebrow fade-up mb-6 !text-[color-mix(in_srgb,var(--c-accent)_60%,white)]">{h.eyebrow}</p>}
          <h1 className={cn("fade-up max-w-4xl text-5xl leading-[1.02] sm:text-6xl md:text-7xl lg:text-8xl", center && "mx-auto")}>{h.title}</h1>
          {h.subtitle && (
            <p className={cn("fade-up-2 mt-7 max-w-xl text-base leading-relaxed text-white/85 md:text-lg", center && "mx-auto")}>{h.subtitle}</p>
          )}
          <div className={cn("fade-up-3 mt-10 flex flex-wrap gap-3", center && "justify-center")}>
            {h.primaryCta.label && pathOn(s, h.primaryCta.to) && (
              <SiteLink to={h.primaryCta.to} className="btn btn-accent">
                {h.primaryCta.label} <ArrowRight size={16} />
              </SiteLink>
            )}
            {h.secondaryCta.label && pathOn(s, h.secondaryCta.to) && (
              <SiteLink to={h.secondaryCta.to} className="btn btn-outline text-white">
                {h.secondaryCta.label}
              </SiteLink>
            )}
          </div>
          {f.listings && f.portfolio && <HeroSearch center={center} />}
          {s.brand.tagline && !f.listings && (
            <p className={cn("fade-up-3 mt-16 font-heading text-xl italic text-white/70 md:text-2xl", center && "mx-auto")}>{s.brand.tagline}</p>
          )}
        </div>
      </section>

      {/* INTRO */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-line">
              {home.introImage && <img src={img(home.introImage, 1200)} alt="" loading="lazy" className="h-full w-full object-cover" />}
            </div>
            <div className="absolute -bottom-6 -right-4 hidden h-40 w-40 border border-accent md:block lg:-right-8" aria-hidden />
          </div>
          <div>
            {home.introEyebrow && <p className="eyebrow mb-5">{home.introEyebrow}</p>}
            <h2 className="text-4xl md:text-5xl">{home.introTitle}</h2>
            <p className="mt-6 whitespace-pre-line leading-relaxed text-muted">{home.introText}</p>
            {home.stats.length > 0 && (
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
                {home.stats.map((st) => (
                  <div key={st.label}>
                    <dt className="font-heading text-4xl text-accent md:text-5xl">{st.value}</dt>
                    <dd className="mt-1 text-xs uppercase tracking-wider text-muted">{st.label}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/about" className="btn btn-primary">About Us</Link>
              {f.booking && <Link to="/book" className="btn btn-outline">{L.bookCta}</Link>}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      {home.showServices && f.services && services.length > 0 && (
        <section className="section bg-surface">
          <div className="container-x">
            <SectionHeading
              eyebrow={home.servicesEyebrow}
              title={home.servicesTitle}
              text={s.pages.servicesIntro}
              action={<Link to="/services" className="btn btn-outline shrink-0">All Services <ArrowRight size={16} /></Link>}
            />
            <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {services.map((sv, i) => (
                <Link key={sv.id} to="/services" hash={sv.slug} className="group flex flex-col bg-surface p-8 transition-colors hover:bg-bg">
                  <span className="font-heading text-lg text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-3xl">{sv.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{sv.summary}</p>
                  <span className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-60 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {home.showProjects && f.portfolio && projects.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow={home.projectsEyebrow}
              title={home.projectsTitle}
              text={home.projectsText}
              action={<Link to="/portfolio" className="btn btn-outline shrink-0">View All {L.items} <ArrowRight size={16} /></Link>}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      {home.showProcess && home.process.length > 0 && (
        <section className="section bg-primary text-on-primary">
          <div className="container-x">
            <div className="mb-14 max-w-2xl">
              {home.processEyebrow && <p className="eyebrow mb-4">{home.processEyebrow}</p>}
              <h2 className="text-4xl md:text-5xl">{home.processTitle}</h2>
            </div>
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {home.process.map((step, i) => (
                <li key={step.title} className="border-t border-white/20 pt-6">
                  <span className="font-heading text-5xl text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-2xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-75">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* CLIENTS & PARTNERS (hidden until logos are added in the dashboard) */}
      {home.showClients && f.clients && clients.length > 0 && (
        <section className="border-y border-line bg-surface py-12 md:py-16">
          <div className="container-x">
            <p className="eyebrow mb-8 text-center">{home.clientsTitle}</p>
          </div>
          <LogoMarquee items={clients} />
        </section>
      )}

      {/* TESTIMONIALS (hidden until at least one is switched on in the dashboard) */}
      {home.showTestimonials && f.testimonials && testimonials.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="Kind words" title={home.testimonialsTitle} align="center" />
            <div className="-mx-3">
              <TestimonialSlider items={testimonials} seconds={Number(home.sliderSeconds) || 6} />
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {home.showFaq && f.faqs && faqs.length > 0 && (
        <section className="section bg-surface">
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow mb-4">Good to know</p>
              <h2 className="text-4xl md:text-5xl">{home.faqTitle}</h2>
              <p className="mt-4 text-muted">Can't find your answer? Ask us on the chat or send us a message.</p>
              <Link to="/contact" className="btn btn-outline mt-6">Contact us</Link>
            </div>
            <div className="lg:col-span-8">
              <FaqList items={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {home.showCta && (
        <section className="relative overflow-hidden bg-primary text-white">
          {home.ctaImage && <img src={img(home.ctaImage, 2200)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-black/60" />
          <div className="container-x section relative text-center">
            <h2 className="mx-auto max-w-3xl text-4xl md:text-6xl">{home.ctaTitle}</h2>
            <p className="mx-auto mt-5 max-w-xl text-white/80">{home.ctaText}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {f.quotes && <Link to="/quote" className="btn btn-accent">{L.quoteCta}</Link>}
              {f.booking && <Link to="/book" className="btn btn-outline text-white">{L.bookCta}</Link>}
              {!f.quotes && !f.booking && <Link to="/contact" className="btn btn-accent">Contact Us</Link>}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/** Property search on the home banner (real estate). Opens the listings page with the filters filled in. */
function HeroSearch({ center }: { center: boolean }) {
  const s = useSite();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [ptype, setPtype] = useState("");
  const [q, setQ] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/portfolio", search: { type: type || undefined, ptype: ptype || undefined, q: q.trim() || undefined } });
  };
  const field = "h-12 w-full rounded-[var(--radius)] border-0 bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-accent";
  return (
    <form
      onSubmit={submit}
      className={cn("fade-up-3 mt-12 grid max-w-4xl gap-2 rounded-[calc(var(--radius)+4px)] bg-white/15 p-2 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr_auto]", center && "mx-auto")}
    >
      <select aria-label="Buy or rent" value={type} onChange={(e) => setType(e.target.value)} className={field}>
        <option value="">Buy or rent</option>
        {s.listing.types.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <select aria-label="Property type" value={ptype} onChange={(e) => setPtype(e.target.value)} className={field}>
        <option value="">Any property type</option>
        {s.listing.propertyTypes.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <input aria-label="Area or keyword" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Area, estate or keyword" className={cn(field, "sm:col-span-2 lg:col-span-1")} />
      <button type="submit" className="btn btn-accent h-12 sm:col-span-2 lg:col-span-1">
        <SearchIcon size={18} /> Search
      </button>
    </form>
  );
}
