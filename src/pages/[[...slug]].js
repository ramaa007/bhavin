import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import { allContent } from '../utils/local-content';
import { getComponent } from '../components/components-registry';
import { resolveStaticProps } from '../utils/static-props-resolvers';
import { resolveStaticPaths } from '../utils/static-paths-resolvers';
import { seoGenerateTitle, seoGenerateMetaTags, seoGenerateMetaDescription } from '../utils/seo-utils';

const services = [
    {
        title: 'Seller Services',
        desc: "Position, stage, and market your property to attract premium buyers and secure top-dollar offers with confidence.",
        icon: '🏡'
    },
    {
        title: 'Buyer Representation',
        desc: 'Access private listings, smart negotiation strategy, and suburb insights that help you buy with certainty.',
        icon: '🔑'
    },
    {
        title: 'Investment Advisory',
        desc: 'Identify high-growth opportunities using rental-yield analysis, risk profiling, and long-term portfolio planning.',
        icon: '📈'
    },
    {
        title: 'Property Valuation',
        desc: 'Get accurate, data-backed valuations based on comparable sales, market momentum, and local demand trends.',
        icon: '📊'
    },
    {
        title: 'Luxury Marketing',
        desc: 'Elevate premium homes with cinematic visuals, targeted digital campaigns, and international exposure.',
        icon: '✨'
    },
    {
        title: 'First Home Guidance',
        desc: 'Navigate finance, grants, inspections, and contract milestones with calm, step-by-step expert support.',
        icon: '🧭'
    }
];

function HomePage() {
    const servicesRef = useRef(null);
    const linesRef = useRef(null);

    useEffect(() => {
        const header = document.querySelector('header');
        const onScroll = () => {
            header?.classList.toggle('scrolled', window.scrollY > 48);
        };
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            },
            { threshold: 0.16 }
        );

        document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const cards = Array.from(document.querySelectorAll('.service-card'));

        const setTilt = (card, x, y) => {
            const rect = card.getBoundingClientRect();
            const px = (x - rect.left) / rect.width;
            const py = (y - rect.top) / rect.height;
            const rotateX = (0.5 - py) * 10;
            const rotateY = (px - 0.5) * 14;
            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        };

        const resetTilt = (card) => {
            card.style.transform = '';
        };

        cards.forEach((card) => {
            const onMove = (e) => setTilt(card, e.clientX, e.clientY);
            const onLeave = () => resetTilt(card);
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);
            card.addEventListener('touchend', onLeave);
        });

        return () => {
            cards.forEach((card) => {
                card.style.transform = '';
            });
        };
    }, []);

    useEffect(() => {
        const container = servicesRef.current;
        const canvas = linesRef.current;
        if (!container || !canvas) return;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            const cards = Array.from(container.querySelectorAll('.service-card'));
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(rect.height * dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, rect.width, rect.height);

            ctx.strokeStyle = 'rgba(201, 169, 110, 0.42)';
            ctx.lineWidth = 1.2;

            for (let i = 0; i < cards.length - 1; i++) {
                const a = cards[i].getBoundingClientRect();
                const b = cards[i + 1].getBoundingClientRect();
                const ax = a.left + a.width / 2 - rect.left;
                const ay = a.top + a.height / 2 - rect.top;
                const bx = b.left + b.width / 2 - rect.left;
                const by = b.top + b.height / 2 - rect.top;
                const midX = (ax + bx) / 2;

                ctx.beginPath();
                ctx.moveTo(ax, ay);
                ctx.bezierCurveTo(midX, ay - 44, midX, by + 44, bx, by);
                ctx.stroke();
            }
        };

        const rafDraw = () => requestAnimationFrame(draw);
        rafDraw();
        window.addEventListener('resize', rafDraw);
        window.addEventListener('scroll', rafDraw, { passive: true });

        return () => {
            window.removeEventListener('resize', rafDraw);
            window.removeEventListener('scroll', rafDraw);
        };
    }, []);

    return (
        <>
            <Head>
                <title>Cityscape Real Estate | Bhumi Patel</title>
                <meta name="description" content="Modern luxury real estate experience by Bhumi Patel in Brisbane." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <header>
                <a href="#home" className="logo">
                    Cityscape
                </a>
                <nav>
                    <a href="#services">Services</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </nav>
                <a href="#contact" className="btn ghost">
                    Book Consultation
                </a>
            </header>

            <main id="home">
                <section className="hero">
                    <video autoPlay muted loop playsInline className="hero-video">
                        <source
                            src="https://assets.zyrosite.com/m5K88rorN6Sjw7jW/brisbane_urban_lifestyle_video-AVLxxllKGyTEeGR6.mp4"
                            type="video/mp4"
                        />
                    </video>
                    <div className="overlay" />
                    <div className="hero-inner" data-animate>
                        <p className="kicker">Brisbane Luxury Real Estate</p>
                        <h1>Find the right home, investment, and future with Bhumi Patel.</h1>
                        <p className="sub">
                            A cinematic digital-first property experience with premium service, market precision, and human guidance at every step.
                        </p>
                        <div className="hero-actions">
                            <a href="#services" className="btn primary">
                                Explore Services
                            </a>
                            <a href="#about" className="btn secondary">
                                Meet Bhumi
                            </a>
                        </div>
                    </div>
                </section>

                <section className="services" id="services" ref={servicesRef}>
                    <canvas ref={linesRef} className="lines" aria-hidden />
                    <div className="section-head" data-animate>
                        <p className="kicker dark">What you get</p>
                        <h2>Six specialized services with strategy, speed, and polish.</h2>
                    </div>
                    <div className="services-grid">
                        {services.map((service, index) => (
                            <article className="service-card" data-animate key={service.title}>
                                <div className="icon-wrap" aria-hidden>
                                    <span>{service.icon}</span>
                                </div>
                                <p className="num">0{index + 1}</p>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about" id="about">
                    <div className="about-panel" data-animate>
                        <h2>Trusted local expertise, elevated by world-class design.</h2>
                        <p>
                            With over a decade in Brisbane real estate, Bhumi combines market intelligence, calm negotiation, and high-impact marketing to
                            turn goals into outcomes. Every campaign is custom, measurable, and client-centered.
                        </p>
                    </div>
                </section>

                <section className="contact" id="contact" data-animate>
                    <h2>Ready to move forward?</h2>
                    <p>Speak directly with Bhumi and get a tailored property roadmap within 24 hours.</p>
                    <a href="mailto:bhumi@cityscaperealestate.com.au" className="btn primary">
                        Start the Conversation
                    </a>
                </section>
            </main>

            <style jsx global>{`
                :root {
                    --bg: #0f1115;
                    --bg-soft: #171a22;
                    --card: #1d2130;
                    --text: #f6f7fb;
                    --muted: #b4bbc9;
                    --gold: #c9a96e;
                    --line: rgba(255, 255, 255, 0.08);
                }
                * {
                    box-sizing: border-box;
                }
                html,
                body {
                    margin: 0;
                    font-family: Inter, ui-sans-serif, system-ui;
                    background: var(--bg);
                    color: var(--text);
                    scroll-behavior: smooth;
                }
                a {
                    color: inherit;
                    text-decoration: none;
                }

                header {
                    position: fixed;
                    inset: 0 0 auto 0;
                    z-index: 20;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 6vw;
                    background: transparent;
                    transition: 0.4s ease;
                }
                header.scrolled {
                    backdrop-filter: blur(12px);
                    background: rgba(14, 16, 21, 0.85);
                    border-bottom: 1px solid var(--line);
                }
                nav {
                    display: flex;
                    gap: 1.5rem;
                }
                nav a {
                    opacity: 0.9;
                    position: relative;
                }
                nav a::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -6px;
                    width: 0;
                    height: 2px;
                    background: var(--gold);
                    transition: width 0.25s;
                }
                nav a:hover::after {
                    width: 100%;
                }
                .logo {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.4rem;
                    color: var(--gold);
                }

                .btn {
                    padding: 0.8rem 1.2rem;
                    border-radius: 999px;
                    border: 1px solid transparent;
                    transition: transform 0.2s, background 0.3s, border-color 0.3s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                }
                .btn:hover {
                    transform: translateY(-2px);
                }
                .btn.primary {
                    background: var(--gold);
                    color: #19150b;
                }
                .btn.primary:hover {
                    background: #ddbb7c;
                }
                .btn.secondary,
                .btn.ghost {
                    border-color: #fff4;
                    background: #fff1;
                }
                .btn.secondary:hover,
                .btn.ghost:hover {
                    border-color: var(--gold);
                }

                .hero {
                    min-height: 100svh;
                    position: relative;
                    display: grid;
                    place-items: center;
                    overflow: hidden;
                }
                .hero-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 20% 20%, #0002, #000a 50%, #000d);
                }
                .hero-inner {
                    position: relative;
                    text-align: center;
                    width: min(950px, 92vw);
                }
                .kicker {
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: var(--gold);
                    font-size: 0.8rem;
                    margin: 0 0 1rem;
                }
                h1 {
                    font-size: clamp(2.2rem, 5vw, 4.6rem);
                    line-height: 1.06;
                    margin: 0;
                    font-family: 'Playfair Display', serif;
                }
                .sub {
                    font-size: clamp(1rem, 2vw, 1.25rem);
                    color: #e5e8f0;
                    max-width: 760px;
                    margin: 1.2rem auto 2rem;
                }
                .hero-actions {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 0.8rem;
                }

                .services {
                    position: relative;
                    padding: 7rem 6vw;
                    background: linear-gradient(180deg, #12151d 0%, #0d1016 100%);
                }
                .lines {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    opacity: 0.9;
                }
                .section-head {
                    position: relative;
                    max-width: 760px;
                    margin: 0 auto 2rem;
                    text-align: center;
                }
                .section-head h2 {
                    font-size: clamp(1.8rem, 3.2vw, 3rem);
                    margin: 0;
                }
                .kicker.dark {
                    color: #dbc089;
                }

                .services-grid {
                    position: relative;
                    z-index: 2;
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 1.2rem;
                }
                .service-card {
                    background: linear-gradient(160deg, #202636, #191e2b);
                    border: 1px solid #ffffff1a;
                    border-radius: 18px;
                    padding: 1.2rem;
                    transform-style: preserve-3d;
                    transition: transform 0.15s linear, border-color 0.3s, box-shadow 0.3s;
                    box-shadow: 0 14px 30px #00000033;
                }
                .service-card:hover {
                    border-color: #c9a96e88;
                    box-shadow: 0 25px 45px #0008;
                }
                .icon-wrap {
                    width: 58px;
                    height: 58px;
                    border-radius: 16px;
                    display: grid;
                    place-items: center;
                    margin-bottom: 0.7rem;
                    font-size: 1.6rem;
                    background: linear-gradient(135deg, #c9a96e, #f3dfb7);
                    color: #201706;
                    position: relative;
                    overflow: hidden;
                    animation: pulse 3.4s ease-in-out infinite;
                }
                .icon-wrap::before {
                    content: '';
                    position: absolute;
                    width: 140%;
                    height: 140%;
                    border: 2px solid #fff9;
                    border-radius: 20px;
                    animation: spin 4s linear infinite;
                }
                .num {
                    color: #e4c890;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    margin: 0;
                }
                .service-card h3 {
                    margin: 0.35rem 0;
                    font-size: 1.2rem;
                }
                .service-card p {
                    margin: 0;
                    color: var(--muted);
                }

                .about {
                    padding: 6rem 6vw;
                    display: grid;
                    place-items: center;
                }
                .about-panel {
                    max-width: 800px;
                    text-align: center;
                    border: 1px solid var(--line);
                    border-radius: 20px;
                    padding: 2rem;
                    background: linear-gradient(145deg, #151925, #10131b);
                }
                .about-panel h2 {
                    margin-top: 0;
                    font-size: clamp(1.7rem, 3vw, 2.8rem);
                }
                .about-panel p {
                    color: var(--muted);
                }

                .contact {
                    padding: 5rem 6vw 7rem;
                    text-align: center;
                    background: radial-gradient(circle at center, #181e2d, #0e1118);
                }
                .contact h2 {
                    margin: 0;
                    font-size: clamp(1.8rem, 3vw, 2.8rem);
                }
                .contact p {
                    color: var(--muted);
                    margin: 1rem 0 2rem;
                }

                [data-animate] {
                    opacity: 0;
                    transform: translateY(25px);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }
                [data-animate].visible {
                    opacity: 1;
                    transform: none;
                }

                @keyframes pulse {
                    0%,
                    100% {
                        transform: translateZ(28px) scale(1);
                    }
                    50% {
                        transform: translateZ(28px) scale(1.08);
                    }
                }
                @keyframes spin {
                    to {
                        transform: rotate(1turn);
                    }
                }

                @media (max-width: 980px) {
                    nav {
                        display: none;
                    }
                    .services-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }
                @media (max-width: 640px) {
                    header {
                        padding: 1rem 1rem;
                    }
                    .btn.ghost {
                        display: none;
                    }
                    .services {
                        padding-inline: 1rem;
                    }
                    .services-grid {
                        grid-template-columns: 1fr;
                    }
                    .about,
                    .contact {
                        padding-inline: 1rem;
                    }
                }
            `}</style>
        </>
    );
}

function Page(props) {
    const { page, site } = props;

    if (page?.__metadata?.urlPath === '/') {
        return <HomePage />;
    }

    const { modelName } = page.__metadata;
    if (!modelName) {
        throw new Error(`page has no type, page '${props.path}'`);
    }
    const PageLayout = getComponent(modelName);
    if (!PageLayout) {
        throw new Error(`no page layout matching the page model: ${modelName}`);
    }
    const title = seoGenerateTitle(page, site);
    const metaTags = seoGenerateMetaTags(page, site);
    const metaDescription = seoGenerateMetaDescription(page, site);
    return (
        <>
            <Head>
                <title>{title}</title>
                {metaDescription && <meta name="description" content={metaDescription} />}
                {metaTags.map((metaTag) => {
                    if (metaTag.format === 'property') {
                        return <meta key={metaTag.property} property={metaTag.property} content={metaTag.content} />;
                    }
                    return <meta key={metaTag.property} name={metaTag.property} content={metaTag.content} />;
                })}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {site.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            <PageLayout page={page} site={site} />
        </>
    );
}

export function getStaticPaths() {
    const data = allContent();
    const paths = resolveStaticPaths(data);
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const data = allContent();
    const urlPath = '/' + (params.slug || []).join('/');
    const props = await resolveStaticProps(urlPath, data);
    return { props };
}

export default Page;
