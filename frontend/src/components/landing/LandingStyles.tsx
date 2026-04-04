const LandingStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');

    .landing-page {
      --neon: #00FF7A;
      --neon-dim: rgba(0,255,122,0.08);
      --neon-glow: rgba(0,255,122,0.15);
      --ink: #000000;
      --ink-2: #0A0A0A;
      --ink-3: #111111;
    }

    .landing-page .display-font {
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 0.04em;
    }

    .landing-page .mono-font {
      font-family: 'DM Mono', monospace;
    }

    .landing-page .body-font {
      font-family: 'DM Sans', sans-serif;
    }

    /* Glow effects */
    .neon-glow {
      box-shadow: 0 0 60px rgba(0,255,122,0.15), 0 0 120px rgba(0,255,122,0.05);
    }

    .neon-text-glow {
      text-shadow: 0 0 40px rgba(0,255,122,0.3), 0 0 80px rgba(0,255,122,0.1);
    }

    /* Phone float animation */
    @keyframes phoneFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-12px) rotate(0.5deg); }
    }
    .phone-float {
      animation: phoneFloat 6s ease-in-out infinite;
    }

    /* Scroll reveal */
    .landing-reveal {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .landing-reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Stagger children */
    .stagger-1 { transition-delay: 0.1s; }
    .stagger-2 { transition-delay: 0.2s; }
    .stagger-3 { transition-delay: 0.3s; }
    .stagger-4 { transition-delay: 0.4s; }

    /* Feature card hover */
    .feature-card {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .feature-card:hover {
      transform: translateY(-4px);
      border-color: var(--neon) !important;
      box-shadow: 0 8px 40px rgba(0,255,122,0.08);
    }

    /* Plan card */
    .plan-card-hover {
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .plan-card-hover:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }

    /* Marquee for stats */
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* Grain overlay */
    .grain-overlay::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: 0.02;
      pointer-events: none;
      z-index: 1000;
    }

    /* Section divider */
    .section-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 50%, transparent);
    }
  `}</style>
);

export default LandingStyles;
