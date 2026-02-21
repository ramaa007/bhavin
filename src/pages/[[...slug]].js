import React, { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { allContent } from '../utils/local-content';
import { getComponent } from '../components/components-registry';
import { resolveStaticProps } from '../utils/static-props-resolvers';
import { resolveStaticPaths } from '../utils/static-paths-resolvers';
import { seoGenerateTitle, seoGenerateMetaTags, seoGenerateMetaDescription } from '../utils/seo-utils';

const services = [
    {
        title: 'Seller Services',
        description:
            "Maximize your property's value with strategic positioning, premium marketing, and sharp negotiation to close faster at the strongest price.",
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200'
    },
    {
        title: 'Buyer Representation',
        description:
            'Find homes that fit your lifestyle with local insight, offer strategy, and end-to-end guidance from search to settlement.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'
    },
    {
        title: 'Investment Property Guidance',
        description:
            'Build wealth through data-backed suburb selection, rental yield forecasting, and portfolio planning tailored to your risk profile.',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'
    },
    {
        title: 'Property Valuation',
        description:
            'Receive accurate valuations using current comparables, local demand trends, and market-cycle context for confident decisions.',
        image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200'
    },
    {
        title: 'Market Analysis',
        description:
            'Stay ahead with actionable reports on neighborhood momentum, buyer behavior, and pricing trends to time your moves better.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200'
    },
    {
        title: 'First Home Buyer Support',
        description:
            'Navigate grants, finance options, inspections, and contract milestones with practical support built for first-time buyers.',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200'
    }
];

const values = [
    {
        title: 'Excellence in Every Transaction',
        description: 'Uncompromising quality and detail in every campaign, communication, and close.'
    },
    {
        title: 'Trusted Local Expertise',
        description: "Deep Brisbane market knowledge with clear, honest advice you can act on quickly."
    },
    {
        title: 'Premium Portfolio Access',
        description: 'On-market and off-market opportunities matched to lifestyle and investment goals.'
    },
    {
        title: 'Dedicated Personal Service',
        description: 'One-on-one guidance from first consultation through to successful completion.'
    }
];

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const linesCanvasRef = useRef(null);
    const serviceGridRef = useRef(null);

    const currentYear = useMemo(() => new Date().getFullYear(), []);

    useEffect(() => {
        document.body.classList.toggle('homepage-dark', darkMode);
        return () => document.body.classList.remove('homepage-dark');
    }, [darkMode]);

    useEffect(() => {
        const header = document.querySelector('.homepage-header');
        const onScroll = () => {
            header?.classList.toggle('scrolled', window.scrollY > 80);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll('[data-fade]').forEach((node) => observer.observe(node));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const cards = document.querySelectorAll('.service-card');

        const move = (event, card) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * 10;
            const rotateY = (x - 0.5) * 16;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            card.style.boxShadow = `${-rotateY * 1.6}px ${rotateX * 1.5 + 22}px 30px rgba(0, 0, 0, 0.35)`;
        };

        const reset = (card) => {
            card.style.transform = '';
            card.style.boxShadow = '';
        };

        cards.forEach((card) => {
            const onMouseMove = (e) => move(e, card);
            const onMouseLeave = () => reset(card);
            card.addEventListener('mousemove', onMouseMove);
            card.addEventListener('mouseleave', onMouseLeave);
            card.addEventListener('touchend', onMouseLeave);
        });

        return () => {
            cards.forEach((card) => reset(card));
        };
    }, []);

    useEffect(() => {
        const canvas = linesCanvasRef.current;
        const grid = serviceGridRef.current;
        if (!canvas || !grid) return;
        const ctx = canvas.getContext('2d');

        const drawLines = () => {
            const cards = [...grid.querySelectorAll('.service-card')];
            const rect = grid.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.strokeStyle = 'rgba(201, 169, 110, 0.45)';
            ctx.lineWidth = 1.1;

            for (let i = 0; i < cards.length - 1; i++) {
                const a = cards[i].getBoundingClientRect();
                const b = cards[i + 1].getBoundingClientRect();
                const ax = a.left + a.width / 2 - rect.left;
                const ay = a.top + a.height / 2 - rect.top;
                const bx = b.left + b.width / 2 - rect.left;
                const by = b.top + b.height / 2 - rect.top;
                const cx = (ax + bx) / 2;
                ctx.beginPath();
                ctx.moveTo(ax, ay);
                ctx.bezierCurveTo(cx, ay - 40, cx, by + 40, bx, by);
                ctx.stroke();
            }
        };

        const rafDraw = () => requestAnimationFrame(drawLines);
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
                <meta
                    name="description"
                    content="Modern, animated luxury real estate homepage for Cityscape Real Estate by Bhumi Patel in Brisbane."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <header className="homepage-header">
                <a href="#intro" className="logo">
                    Cityscape
                </a>

                <button className="mobile-menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
                    <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
                </button>

                <nav className={menuOpen ? 'active' : ''}>
                    <ul>
                        <li>
                            <a href="#intro" onClick={() => setMenuOpen(false)}>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#values" onClick={() => setMenuOpen(false)}>
                                Why Choose Me
                            </a>
                        </li>
                        <li>
                            <a href="#about" onClick={() => setMenuOpen(false)}>
                                About Bhumi
                            </a>
                        </li>
                        <li>
                            <a href="#services" onClick={() => setMenuOpen(false)}>
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="#contact" onClick={() => setMenuOpen(false)}>
                                Contact
                            </a>
                        </li>
                    </ul>
                    <button className="theme-toggle" onClick={() => setDarkMode((v) => !v)} aria-label="Toggle theme">
                        <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} />
                    </button>
                </nav>
            </header>

            <main>
                <section id="intro" className="hero-section">
                    <video className="bg-video" autoPlay muted loop playsInline>
                        <source
                            src="https://assets.zyrosite.com/m5K88rorN6Sjw7jW/brisbane_urban_lifestyle_video-AVLxxllKGyTEeGR6.mp4"
                            type="video/mp4"
                        />
                    </video>
                    <div className="overlay intro-overlay" />
                    <div className="hero-content" data-fade>
                        <p className="eyebrow">Luxury Brisbane Real Estate</p>
                        <h1 className="cityscape-logo">CITYSCAPE</h1>
                        <p className="hero-sub">Find your dream home with strategy, style, and service that moves as fast as your goals.</p>
                        <div className="cta-buttons">
                            <a href="#contact" className="btn btn-primary">
                                Get In Touch
                            </a>
                            <a href="#services" className="btn btn-secondary">
                                View Services
                            </a>
                        </div>
                    </div>
                </section>

                <section id="values" className="values-section">
                    <video className="bg-video" autoPlay muted loop playsInline>
                        <source
                            src="https://srv1915-files.hstgr.io/18179fef691b6786/files/public_html/Real_Estate_Video_Generation_Request.mp4"
                            type="video/mp4"
                        />
                    </video>
                    <div className="overlay values-overlay" />
                    <div className="container">
                        <h2 className="section-title" data-fade>
                            Why Choose Cityscape
                        </h2>
                        <div className="values-grid">
                            {values.map((value, i) => (
                                <article className="value-item" data-fade key={value.title}>
                                    <div className="value-number">0{i + 1}</div>
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="about" className="about-section">
                    <video className="bg-video" autoPlay muted loop playsInline>
                        <source
                            src="https://assets.zyrosite.com/m5K88rorN6Sjw7jW/luxury_living_video_generation-A1az9VreG6c8nrL4.mp4"
                            type="video/mp4"
                        />
                    </video>
                    <div className="overlay about-overlay" />
                    <div className="container about-container">
                        <div className="about-image" data-fade>
                            <img
                                src="https://assets.zyrosite.com/m5K88rorN6Sjw7jW/gemini_generated_image_5i6bmc5i6bmc5i6b-AQEeeJ0eNpC25G61.png"
                                alt="Bhumi Patel"
                            />
                            <blockquote>“I don&apos;t just sell properties — I guide you home.”</blockquote>
                        </div>
                        <div className="about-content" data-fade>
                            <h2>About Bhumi Patel</h2>
                            <p>
                                With over a decade of experience in luxury real estate, Bhumi combines deep market expertise with tailored strategy,
                                premium marketing, and relationship-first service to deliver standout outcomes.
                            </p>
                            <p>
                                Her clients benefit from direct access, clear communication, and a process that stays focused on their goals from first
                                consultation through long after settlement.
                            </p>
                            <p className="signature">— Bhumi Patel</p>
                            <div className="about-contacts">
                                <span>
                                    <i className="fas fa-phone" /> +61 430 879 9900
                                </span>
                                <span>
                                    <i className="fas fa-envelope" /> bhumi@cityscaperealestate.com.au
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="services" className="services-section">
                    <div className="container">
                        <div className="services-head" data-fade>
                            <p className="eyebrow dark">Six-Service Experience</p>
                            <h2>Everything you need for buying, selling, and investing — fully covered.</h2>
                        </div>
                        <div className="services-canvas-wrap">
                            <canvas ref={linesCanvasRef} className="services-lines" aria-hidden />
                            <div className="services-grid" ref={serviceGridRef}>
                                {services.map((service, i) => (
                                    <article className="service-card" data-fade key={service.title}>
                                        <img src={service.image} alt={service.title} className="service-image" />
                                        <div className="service-body">
                                            <span className="service-number">0{i + 1}</span>
                                            <h3>{service.title}</h3>
                                            <p>{service.description}</p>
                                            <a href="#contact" className="service-link">
                                                Learn more <i className="fas fa-arrow-right" />
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="contact" className="contact-section" data-fade>
                    <div className="container contact-container">
                        <div>
                            <h2>Ready to Find Your Dream Home?</h2>
                            <p>
                                Let&apos;s build your next move with a tailored strategy. Reach out directly for a free consultation and personalized property
                                roadmap.
                            </p>
                            <div className="contact-points">
                                <span>
                                    <i className="fas fa-phone" /> +61 430 879 9900
                                </span>
                                <span>
                                    <i className="fas fa-envelope" /> bhumi@cityscaperealestate.com.au
                                </span>
                                <span>
                                    <i className="fas fa-map-marker-alt" /> Brisbane, Queensland
                                </span>
                            </div>
                        </div>
                        <form
                            className="contact-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                // eslint-disable-next-line no-alert
                                alert('Thank you for your message! Bhumi will contact you shortly.');
                                e.currentTarget.reset();
                            }}
                        >
                            <h3>Get In Touch</h3>
                            <label htmlFor="name">Full Name *</label>
                            <input id="name" required type="text" />
                            <label htmlFor="email">Email Address *</label>
                            <input id="email" required type="email" />
                            <label htmlFor="phone">Phone Number</label>
                            <input id="phone" type="tel" />
                            <label htmlFor="message">Message *</label>
                            <textarea id="message" required rows={5} />
                            <button type="submit" className="btn btn-primary full">
                                Send Message
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="homepage-footer">
                <div className="container footer-grid">
                    <div>
                        <h3>Cityscape Real Estate</h3>
                        <p>
                            Your trusted partner in Brisbane real estate. Specialized in residential sales, investment properties, and personalized,
                            high-touch service.
                        </p>
                        <div className="socials">
                            <a href="#" aria-label="facebook">
                                <i className="fab fa-facebook-f" />
                            </a>
                            <a href="#" aria-label="instagram">
                                <i className="fab fa-instagram" />
                            </a>
                            <a href="#" aria-label="linkedin">
                                <i className="fab fa-linkedin-in" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4>Quick Links</h4>
                        <a href="#intro">Home</a>
                        <a href="#services">Services</a>
                        <a href="#about">About</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <div>
                        <h4>Services</h4>
                        {services.map((service) => (
                            <a href="#services" key={service.title}>
                                {service.title}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="footer-bottom">© {currentYear} Cityscape Real Estate. All rights reserved.</div>
            </footer>

            <style jsx global>{`
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
                :root {
                    --primary: #1a1a1a;
                    --secondary: #c9a96e;
                    --light: #f8f8f8;
                    --dark: #111111;
                    --gray: #8d8d8d;
                    --transition: all 0.35s ease;
                }

                * {
                    box-sizing: border-box;
                }

                html,
                body {
                    margin: 0;
                    font-family: Inter, sans-serif;
                    background: var(--light);
                    color: var(--dark);
                    scroll-behavior: smooth;
                    overflow-x: hidden;
                }

                body.homepage-dark {
                    background: #0e0e0f;
                    color: #f6f6f6;
                }

                .container {
                    width: min(1320px, 92vw);
                    margin: 0 auto;
                }

                .homepage-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 18px 4vw;
                    transition: var(--transition);
                }

                .homepage-header.scrolled {
                    background: rgba(255, 255, 255, 0.92);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                    backdrop-filter: blur(10px);
                }

                body.homepage-dark .homepage-header.scrolled {
                    background: rgba(15, 15, 15, 0.85);
                }

                .logo {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.45rem;
                    color: var(--secondary);
                    text-decoration: none;
                    z-index: 1002;
                }

                nav ul {
                    list-style: none;
                    display: flex;
                    gap: 1.4rem;
                    margin: 0;
                    padding: 0;
                }

                nav a {
                    color: inherit;
                    text-decoration: none;
                    font-weight: 500;
                    position: relative;
                }

                nav a::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -6px;
                    width: 0;
                    height: 2px;
                    background: var(--secondary);
                    transition: var(--transition);
                }

                nav a:hover::after {
                    width: 100%;
                }

                .theme-toggle,
                .mobile-menu-btn {
                    border: 0;
                    background: transparent;
                    cursor: pointer;
                    font-size: 1.2rem;
                    color: inherit;
                }

                .theme-toggle {
                    margin-left: 1.2rem;
                }

                .mobile-menu-btn {
                    display: none;
                    z-index: 1002;
                }

                .hero-section,
                .values-section,
                .about-section {
                    min-height: 100vh;
                    position: relative;
                    display: grid;
                    place-items: center;
                    isolation: isolate;
                }

                .bg-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    z-index: -2;
                }

                .overlay {
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                }

                .intro-overlay {
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.35));
                }

                .values-overlay,
                .about-overlay {
                    background: rgba(0, 0, 0, 0.72);
                }

                .hero-content {
                    width: min(900px, 92vw);
                    text-align: center;
                    color: white;
                }

                .eyebrow {
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    font-size: 0.82rem;
                    color: #e4c387;
                }

                .cityscape-logo {
                    margin: 0;
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(3.2rem, 12vw, 8rem);
                    line-height: 0.95;
                }

                .hero-sub {
                    max-width: 760px;
                    margin: 1rem auto 2rem;
                    color: #ececec;
                    font-size: clamp(1rem, 2.5vw, 1.2rem);
                }

                .cta-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 0.8rem;
                    flex-wrap: wrap;
                }

                .btn {
                    border: 2px solid transparent;
                    text-decoration: none;
                    padding: 0.8rem 1.3rem;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .btn-primary {
                    background: var(--secondary);
                    color: white;
                    border-color: var(--secondary);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    background: #b99254;
                    border-color: #b99254;
                }

                .btn-secondary {
                    color: white;
                    border-color: white;
                }

                .btn-secondary:hover {
                    background: white;
                    color: var(--dark);
                }

                .values-section {
                    padding: 5rem 0;
                }

                .section-title {
                    color: white;
                    text-align: center;
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 6vw, 3rem);
                    margin-bottom: 2.2rem;
                }

                .values-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 1.1rem;
                }

                .value-item {
                    border: 1px solid rgba(201, 169, 110, 0.35);
                    padding: 1.25rem;
                    transition: var(--transition);
                    background: rgba(255, 255, 255, 0.04);
                }

                .value-item:hover {
                    border-color: var(--secondary);
                    transform: translateY(-4px);
                }

                .value-number {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.3rem;
                    color: var(--secondary);
                    opacity: 0.7;
                }

                .value-item h3 {
                    color: white;
                    margin: 0.2rem 0 0.5rem;
                    font-size: 1.25rem;
                }

                .value-item p {
                    margin: 0;
                    color: #dcdcdc;
                    line-height: 1.6;
                }

                .about-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    align-items: center;
                    color: white;
                    padding: 5rem 0;
                }

                .about-image {
                    position: relative;
                }

                .about-image img {
                    width: 100%;
                    height: min(520px, 70vh);
                    object-fit: cover;
                }

                .about-image blockquote {
                    position: absolute;
                    right: 1rem;
                    bottom: 1rem;
                    margin: 0;
                    background: var(--secondary);
                    padding: 1rem;
                    max-width: 300px;
                    font-family: 'Playfair Display', serif;
                }

                .about-content h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 2.9rem);
                    margin-top: 0;
                }

                .about-content p {
                    color: #dfdfdf;
                    line-height: 1.65;
                }

                .signature {
                    color: var(--secondary);
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                }

                .about-contacts {
                    display: grid;
                    gap: 0.6rem;
                }

                .about-contacts span i {
                    color: var(--secondary);
                    margin-right: 0.5rem;
                }

                .services-section {
                    padding: 6rem 0;
                    background: #f3f3f5;
                    position: relative;
                }

                body.homepage-dark .services-section {
                    background: #121214;
                }

                .services-head {
                    text-align: center;
                    margin-bottom: 1.7rem;
                }

                .services-head h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.7rem, 4vw, 2.6rem);
                    max-width: 900px;
                    margin: 0 auto;
                }

                .eyebrow.dark {
                    color: #b99254;
                }

                .services-canvas-wrap {
                    position: relative;
                }

                .services-lines {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }

                .services-grid {
                    position: relative;
                    z-index: 1;
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 1rem;
                }

                .service-card {
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    background: white;
                    transition: transform 0.18s linear, box-shadow 0.25s ease, border-color 0.25s ease;
                    transform-style: preserve-3d;
                    overflow: hidden;
                }

                body.homepage-dark .service-card {
                    background: #19191d;
                    border-color: rgba(255, 255, 255, 0.09);
                }

                .service-card:hover {
                    border-color: rgba(201, 169, 110, 0.6);
                    box-shadow: 0 18px 30px rgba(0, 0, 0, 0.2);
                }

                .service-image {
                    width: 100%;
                    height: 210px;
                    object-fit: cover;
                }

                .service-body {
                    padding: 1rem;
                }

                .service-number {
                    display: inline-block;
                    color: var(--secondary);
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .service-body h3 {
                    margin: 0 0 0.5rem;
                    font-size: 1.2rem;
                    font-family: 'Playfair Display', serif;
                }

                .service-body p {
                    margin: 0;
                    color: var(--gray);
                    line-height: 1.6;
                }

                body.homepage-dark .service-body p {
                    color: #bcbcbc;
                }

                .service-link {
                    margin-top: 0.9rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    text-decoration: none;
                    color: var(--secondary);
                    font-weight: 600;
                    transition: var(--transition);
                }

                .service-link:hover {
                    gap: 0.55rem;
                }

                .contact-section {
                    padding: 6rem 0;
                }

                .contact-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }

                .contact-container h2 {
                    margin-top: 0;
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 4vw, 2.8rem);
                }

                .contact-container p {
                    line-height: 1.7;
                    color: var(--gray);
                }

                body.homepage-dark .contact-container p {
                    color: #b9b9b9;
                }

                .contact-points {
                    display: grid;
                    gap: 0.65rem;
                }

                .contact-points span i {
                    color: var(--secondary);
                    width: 18px;
                    margin-right: 0.35rem;
                }

                .contact-form {
                    background: #f7f7f7;
                    padding: 1.2rem;
                    display: grid;
                    gap: 0.45rem;
                }

                body.homepage-dark .contact-form {
                    background: #1a1a1d;
                }

                .contact-form h3 {
                    margin: 0 0 0.35rem;
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                }

                .contact-form label {
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .contact-form input,
                .contact-form textarea {
                    width: 100%;
                    border: 1px solid #dbdbdb;
                    padding: 0.7rem 0.8rem;
                    font-family: inherit;
                    font-size: 1rem;
                    background: white;
                    color: var(--dark);
                }

                body.homepage-dark .contact-form input,
                body.homepage-dark .contact-form textarea {
                    background: #2a2a2f;
                    border-color: #3a3a44;
                    color: #f5f5f5;
                }

                .full {
                    width: 100%;
                }

                .homepage-footer {
                    background: #111;
                    color: #e5e5e5;
                    padding: 3rem 0 0;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    gap: 1.4rem;
                }

                .homepage-footer h3,
                .homepage-footer h4 {
                    margin-top: 0;
                    color: var(--secondary);
                    font-family: 'Playfair Display', serif;
                }

                .homepage-footer p {
                    color: #b8b8b8;
                    line-height: 1.7;
                }

                .homepage-footer a {
                    color: #d0d0d0;
                    text-decoration: none;
                    display: block;
                    margin-bottom: 0.45rem;
                }

                .homepage-footer a:hover {
                    color: var(--secondary);
                }

                .socials {
                    display: flex;
                    gap: 0.65rem;
                }

                .socials a {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                    background: #2b2b2d;
                }

                .socials a:hover {
                    background: var(--secondary);
                    color: white;
                }

                .footer-bottom {
                    border-top: 1px solid #2f2f30;
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9d9d9d;
                    margin-top: 2rem;
                    padding: 1rem;
                }

                [data-fade] {
                    opacity: 0;
                    transform: translateY(26px);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }

                [data-fade].visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                @media (max-width: 980px) {
                    .about-container,
                    .contact-container,
                    .footer-grid {
                        grid-template-columns: 1fr;
                    }

                    .services-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    nav {
                        position: fixed;
                        top: 0;
                        right: -100%;
                        width: min(300px, 80vw);
                        height: 100vh;
                        background: #fff;
                        padding: 5rem 1.2rem 1.2rem;
                        transition: var(--transition);
                    }

                    body.homepage-dark nav {
                        background: #121216;
                    }

                    nav.active {
                        right: 0;
                    }

                    nav ul {
                        flex-direction: column;
                    }

                    .theme-toggle {
                        margin-left: 0;
                        margin-top: 1rem;
                    }

                    .mobile-menu-btn {
                        display: inline-block;
                    }
                }

                @media (max-width: 680px) {
                    .services-grid,
                    .values-grid {
                        grid-template-columns: 1fr;
                    }

                    .service-image {
                        height: 185px;
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
