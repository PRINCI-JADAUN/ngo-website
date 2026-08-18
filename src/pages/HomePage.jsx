import { useEffect, useRef, useState, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSiteContent } from "../context/SiteContentContext";

/* ── Confetti + Thank-You ─────────────────────────────────── */
const CONFETTI_COLORS = ["#1f8f62","#3cc88f","#f0b44a","#c26b34","#ffd166","#06d6a0","#118ab2"];

function Confetti() {
  const pieces = Array.from({ length: 72 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    w: 8 + Math.random() * 8,
    h: 6 + Math.random() * 6,
    dur: 2 + Math.random() * 2,
    delay: Math.random() * 1.2,
  }));
  return (
    <>
      {pieces.map((p) => (
        <div key={p.id} className="confetti-piece"
          style={{ left: p.left, top: "-14px", width: p.w, height: p.h,
            background: p.color, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />
      ))}
    </>
  );
}

function ThankYouModal({ onClose, formType }) {
  const msgs = {
    volunteer: "Your volunteer application has been received! We will be in touch within 2 business days.",
    donation:  "Your donation intent has been submitted. Our team will follow up with payment details shortly.",
    sponsor:   "Your sponsorship request is confirmed. We will connect you with your chosen dog soon.",
    adoption:  "Your adoption application is under review. Expect a call from our team within 48 hours.",
    contact:   "Your message has been sent. We will respond within 24 hours.",
  };
  return (
    <div className="thankyou-overlay" onClick={onClose}>
      <Confetti />
      <div className="thankyou-card" onClick={(e) => e.stopPropagation()}>
        <div className="thankyou-icon">🎉</div>
        <h3>Thank You!</h3>
        <p>{msgs[formType] || "Your submission was successful!"}</p>
        <button className="thankyou-close" onClick={onClose}>Wonderful ✓</button>
      </div>
    </div>
  );
}

/* ── Animated Canvas Slide ────────────────────────────────── */
function AnimatedCanvasSlide({ sceneIndex, isActive }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(0);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth || 1200; canvas.height = canvas.offsetHeight || 690; };
    resize();
    window.addEventListener("resize", resize);

    const drawBird = (bx, by, size, wing, col) => {
      ctx.save(); ctx.translate(bx, by);
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      const wa = Math.sin(wing) * 0.7;
      ctx.beginPath(); ctx.ellipse(-size*0.7, -size*0.2 - wa*size*0.8, size*0.9, size*0.25, -0.4 - wa*0.3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse( size*0.7, -size*0.2 + wa*size*0.8, size*0.9, size*0.25,  0.4 + wa*0.3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(size*0.75, -size*0.15, size*0.4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#f0b44a";
      ctx.beginPath(); ctx.moveTo(size*1.12,-size*0.1); ctx.lineTo(size*1.45,-size*0.04); ctx.lineTo(size*1.12, 0.02); ctx.fill();
      ctx.restore();
    };

    let state;
    if (sceneIndex === 0) {
      state = { birds: Array.from({length:20},(_,i)=>({ x:Math.random()*1200, y:60+Math.random()*240, vx:(Math.random()-0.5)*1.1, vy:(Math.random()-0.5)*0.5, size:6+Math.random()*7, phase:Math.random()*Math.PI*2, col:`hsl(${140+Math.random()*60},${50+Math.random()*30}%,${55+Math.random()*20}%)`, wing:0 })) };
    } else {
      state = { birds: Array.from({length:14},(_,i)=>({ x:Math.random()*1200, y:50+Math.random()*200, vx:0.7+Math.random()*1.2, vy:Math.sin(i)*0.5, size:7+Math.random()*6, phase:Math.random()*Math.PI*2, col:`hsl(${40+Math.random()*30},80%,68%)`, wing:0 })), dogPhase:[0,1.8,3.6] };
    }

    const drawDog = (x, y, ph) => {
      const s=26, bob=Math.sin(ph)*4;
      ctx.save(); ctx.translate(x, y+bob);
      ctx.fillStyle="#c8a06a";
      ctx.beginPath(); ctx.ellipse(0,0,s,s*0.58,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(s*0.88,-s*0.3,s*0.48,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#a07040";
      ctx.beginPath(); ctx.ellipse(s*1.06,-s*0.62,s*0.2,s*0.34,0.3,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle="#c8a06a"; ctx.lineWidth=5; ctx.lineCap="round";
      ctx.beginPath(); ctx.moveTo(-s,-s*0.18); ctx.quadraticCurveTo(-s*1.4,-s*0.8+Math.sin(ph*2)*10,-s*1.1,-s*1+Math.sin(ph*2)*8); ctx.stroke();
      ctx.fillStyle="#c8a06a";
      [-0.5,-0.1,0.3,0.7].forEach((lx,i)=>{ const ly=s*0.5+Math.abs(Math.sin(ph+i*0.8))*8; ctx.beginPath(); ctx.roundRect(lx*s-3,0,6,ly,3); ctx.fill(); });
      ctx.restore();
    };

    const drawFrame = () => {
      const W=canvas.width, H=canvas.height, t=tRef.current;
      const sky=ctx.createLinearGradient(0,0,0,H);
      sky.addColorStop(0,"#0b1e14"); sky.addColorStop(0.55,"#173326"); sky.addColorStop(1,"#2a5c3e");
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
      const grd=ctx.createLinearGradient(0,H*0.72,0,H);
      grd.addColorStop(0,"#1b3f28"); grd.addColorStop(1,"#0c1e13");
      ctx.fillStyle=grd; ctx.fillRect(0,H*0.72,W,H);
      for(let i=0;i<38;i++){ const sx=((i*139+20)%W), sy=((i*97+15)%(H*0.58)); const alpha=0.25+0.55*Math.abs(Math.sin(t*0.018+i)); ctx.fillStyle=`rgba(255,255,255,${alpha})`; ctx.beginPath(); ctx.arc(sx,sy,1,0,Math.PI*2); ctx.fill(); }
      ctx.fillStyle="rgba(255,248,220,0.9)"; ctx.beginPath(); ctx.arc(W*0.84,H*0.12,26,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="rgba(15,35,25,0.75)"; ctx.beginPath(); ctx.arc(W*0.86,H*0.1,21,0,Math.PI*2); ctx.fill();
      for(let f=0;f<16;f++){ const fx=((f*175+t*0.28)%W); const fy=H*0.38+Math.sin(t*0.014+f*1.1)*H*0.26; const a=0.35+0.55*Math.abs(Math.sin(t*0.048+f)); ctx.fillStyle=`rgba(140,220,110,${a})`; ctx.beginPath(); ctx.arc(fx,fy,2.2,0,Math.PI*2); ctx.fill(); }
      if(sceneIndex===0){
        const px=W*0.44, py=H*0.7;
        ctx.fillStyle="#0a1810"; ctx.beginPath(); ctx.ellipse(px,py-18,16,38,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(px,py-64,15,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle="#0a1810"; ctx.lineWidth=7; ctx.lineCap="round"; ctx.beginPath(); ctx.moveTo(px+10,py-28); ctx.lineTo(px+58,py-18+Math.sin(t*0.03)*5); ctx.stroke();
        ctx.fillStyle="#f0b44a"; for(let s=0;s<5;s++){ ctx.beginPath(); ctx.arc(px+58+s*4,py-20+Math.sin(t*0.03)*5,3,0,Math.PI*2); ctx.fill(); }
        state.birds.forEach(b=>{ b.wing+=0.18; const tx=px+58, ty=py-18; const dist=Math.hypot(tx-b.x,ty-b.y); if(dist>40){ b.x+=(tx-b.x)*0.007+b.vx; b.y+=(ty-b.y)*0.007+b.vy; } else{ b.x=tx+(Math.random()-0.5)*90; b.y=50+Math.random()*H*0.45; } if(b.x>W+20)b.x=-20; if(b.x<-20)b.x=W+20; drawBird(b.x,b.y,b.size,b.wing,b.col); });
      } else {
        [W*0.24,W*0.52,W*0.78].forEach((dx,di)=>{ state.dogPhase[di]+=0.04; drawDog(dx,H*0.7,state.dogPhase[di]); });
        state.birds.forEach(b=>{ b.wing+=0.22; b.x+=b.vx; b.y+=b.vy+Math.sin(t*0.02+b.phase)*0.55; if(b.x>W+20)b.x=-20; drawBird(b.x,b.y,b.size,b.wing,b.col); });
      }
      tRef.current++; rafRef.current=requestAnimationFrame(drawFrame);
    };
    rafRef.current=requestAnimationFrame(drawFrame);
    return ()=>{ cancelAnimationFrame(rafRef.current); window.removeEventListener("resize",resize); };
  }, [isActive, sceneIndex]);

  return (
    <div className="hero-canvas-slide">
      <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}} />
    </div>
  );
}

/* ── Hero Story Animation ─────────────────────────────────── */
function HeroStoryAnimation({ variant }) {
  return (
    <div className={`hero-story-animation hero-story-${variant}`} aria-hidden="true">
      <div className="story-sky"><span className="story-cloud cloud-one" /><span className="story-cloud cloud-two" /><span className="story-sun" /></div>
      <div className="story-path" />
      <div className="story-rescue-scene"><span className="rescue-pit" /><span className="rescue-rope" /><span className="rescue-light" /></div>
      <div className="story-care-scene"><span className="care-bowl" /><span className="care-water" /><span className="care-food care-food-one" /><span className="care-food care-food-two" /></div>
      <div className="story-home-scene"><span className="home-roof" /><span className="home-wall" /><span className="home-door" /><span className="home-window" /></div>
      <div className="story-heart story-heart-one">♥</div>
      <div className="story-heart story-heart-two">♥</div>
      <div className="story-person"><span className="person-head" /><span className="person-body" /><span className="person-arm person-arm-left" /><span className="person-arm person-arm-right" /><span className="person-leg person-leg-left" /><span className="person-leg person-leg-right" /></div>
      <div className="story-animal"><span className="animal-tail" /><span className="animal-body" /><span className="animal-head" /><span className="animal-ear animal-ear-left" /><span className="animal-ear animal-ear-right" /><span className="animal-leg animal-leg-one" /><span className="animal-leg animal-leg-two" /></div>
    </div>
  );
}

/* ── Donation Carousel ────────────────────────────────────── */
const DONATION_ITEMS = [
  { img:"/images/ngo/stray-care.jpg",  title:"₹500 — Feed for a Week",     desc:"Feeds one rescued dog nutritious meals for seven full days." },
  { img:"/images/ngo/abc-care.jpg",    title:"₹1,500 — Vaccination Drive", desc:"Covers complete vaccination for one stray, protecting the community." },
  { img:"/images/ngo/rescue.jpg",      title:"₹3,000 — Surgery Fund",      desc:"Contributes to life-saving surgery for a critically injured animal." },
  { img:"/images/ngo/foster.jpg",      title:"₹5,000 — Foster Home Kit",   desc:"Equips a foster home with bedding, food, toys, and medical supplies." },
  { img:"/images/ngo/adoption.jpg",    title:"₹10,000 — Sponsor a Rescue", desc:"Fully sponsors the rescue, treatment, and adoption of one animal." },
];

function DonationCarousel() {
  const [center, setCenter] = useState(2);
  const total = DONATION_ITEMS.length;
  const getOffset = useCallback((i) => { const diff = ((i - center + total) % total + total) % total; return diff > total / 2 ? diff - total : diff; }, [center, total]);
  const prev = () => setCenter((c) => (c - 1 + total) % total);
  const next = () => setCenter((c) => (c + 1) % total);
  const CARD_W = 300, GAP = 24, step = CARD_W + GAP;

  return (
    <section className="donation-carousel-section events">
      <div className="container">
        <div className="session-title row"><h2>How Your Gift Helps</h2><p>Every donation, big or small, directly transforms an animal's life</p></div>
      </div>
      <div className="donation-carousel-viewport">
        <div style={{position:"relative",height:340,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {DONATION_ITEMS.map((card, i) => {
            const off = getOffset(i);
            const isCenter = off === 0;
            return (
              <div key={i} className={`donation-carousel-card${isCenter ? " is-center" : ""}`}
                style={{ position:"absolute", transform:`translateX(${off * step}px) scale(${isCenter ? 1.06 : 0.9})`, filter: isCenter ? "none" : `blur(${Math.min(Math.abs(off)*1.4,2.8)}px) brightness(${1-Math.abs(off)*0.1})`, zIndex: 10 - Math.abs(off), transition:"all 0.56s cubic-bezier(0.25,0.8,0.25,1)" }}>
                <img src={card.img} alt={card.title} />
                <div className="donation-carousel-body">
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                  <NavLink className="btn btn-success btn-sm" to="/contact#donation">Donate Now</NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="donation-carousel-nav">
        <button onClick={prev} aria-label="Previous"><i className="fas fa-chevron-left" /></button>
        <button onClick={next} aria-label="Next"><i className="fas fa-chevron-right" /></button>
      </div>
    </section>
  );
}

const STATUS_COLORS = { Available:"#1f8f62", Foster:"#118ab2", Medical:"#c26b34", Adopted:"#6c757d" };

function PetProfileCard({ pet }) {
  return (
    <div className="pet-card">
      <div className="pet-card-img-wrap">
        <img src={pet.image} alt={pet.name} className="pet-card-img" />
        <span className="pet-card-status" style={{ background: STATUS_COLORS[pet.status] || "#1f8f62" }}>
          {pet.status === "Available" ? "🐾 Available" : pet.status === "Foster" ? "🏠 Foster" : pet.status === "Medical" ? "💊 Medical Recovery" : pet.status}
        </span>
      </div>
      <div className="pet-card-body">
        <h4 className="pet-card-name">{pet.name}</h4>
        <p className="pet-card-breed">{pet.breed} · {pet.age}</p>
        <div className="pet-card-traits">
          {pet.traits.map((t) => <span key={t} className="pet-trait">{t}</span>)}
        </div>
        <NavLink to="/contact#adoption" className="btn btn-success btn-sm pet-card-btn">
          <i className="fas fa-heart" /> Inquire to Adopt
        </NavLink>
      </div>
    </div>
  );
}

/* ── Do-Roti Challenge Section ────────────────────────────── */
function DoRotiChallenge() {
  const steps = [
    { icon:"fas fa-bread-slice",  num:"01", title:"Feed 2 Rotis",    desc:"Every day, set aside 2 rotis (or any food) for a stray animal near your home or workplace." },
    { icon:"fas fa-camera",       num:"02", title:"Snap a Photo",    desc:"Capture the moment — a happy stray eating, a wagging tail, or a grateful bird." },
    { icon:"fas fa-share-alt",    num:"03", title:"Tag & Share",     desc:"Post on social media and tag @WingsAndTails with #DoRotiChallenge to inspire others." },
  ];
  return (
    <section className="doroti-section">
      <div className="container">
        <div className="session-title row">
          <h2>🍞 The Do-Roti Challenge</h2>
          <p>A simple daily act that feeds strays, builds compassion, and creates a kinder community — one roti at a time.</p>
        </div>
        <div className="doroti-steps">
          {steps.map((s) => (
            <div key={s.num} className="doroti-step">
              <div className="doroti-step-num">{s.num}</div>
              <div className="doroti-step-icon"><i className={s.icon} /></div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="doroti-cta">
          <NavLink to="/contact" className="btn btn-success">Join the Challenge</NavLink>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn btn-outline-success doroti-social">
            <i className="fab fa-instagram" /> Share on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Animated Counter ─────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const numTarget = parseInt(target, 10) || 0;
        const duration = 1800;
        const steps = 60;
        const increment = numTarget / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= numTarget) { setCount(numTarget); clearInterval(timer); }
          else { setCount(Math.floor(current)); }
        }, duration / steps);
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = isNaN(parseInt(target, 10)) ? target : `${count}${suffix}`;
  return <span ref={ref}>{display}</span>;
}

/* ── Stories Preview ──────────────────────────────────────── */
function StoriesPreview({ stories }) {
  const preview = stories.filter((s) => s.status !== "deleted").slice(0, 3);
  if (!preview.length) return null;
  return (
    <section className="stories-preview-section events">
      <div className="container">
        <div className="session-title row">
          <h2>Happy Tails &amp; Success Stories</h2>
          <p>Real stories of rescue, recovery, and forever homes — because every animal deserves a second chance.</p>
        </div>
        <div className="row event-ro">
          {preview.map((post) => (
            <div className="col-md-4 col-sm-6" key={post.title}>
              <div className="single-blog stories-preview-card">
                <figure><img src={post.image} alt={post.title} /></figure>
                <div className="blog-detail">
                  <small>{post.date}</small>
                  <h4>{post.title}</h4>
                  <p>{post.excerpt}</p>
                  <div className="link">
                    <NavLink to="/stories">Read more</NavLink>
                    <i className="fas fa-long-arrow-alt-right" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:28}}>
          <NavLink to="/stories" className="btn btn-success">View All Stories</NavLink>
        </div>
      </div>
    </section>
  );
}

/* ── Supporter Ticker ─────────────────────────────────────── */
function SupporterTicker({ donations }) {
  if (!donations.length) return null;

  return (
    <div className="supporter-ticker-wrap">
      <div className="supporter-ticker-label">
        <i className="fas fa-heart" /> Recent Supporters
      </div>
      <div className="supporter-ticker">
        {/* Two identical tracks — second one starts exactly where the first ends,
            so the loop is invisible. CSS animation only plays on the first track. */}
        <div className="supporter-ticker-track">
          {donations.map((d, i) => (
            <div key={d._id || d.id || i} className="supporter-ticker-item">
              <div className="supporter-avatar">
                {(d.values?.name || "A")[0].toUpperCase()}
              </div>
              <div className="supporter-info">
                <strong>{d.values?.name || "Anonymous"}</strong>
                <span>{d.values?.donationType || "Donation"} · ₹{d.values?.amount || "—"}</span>
              </div>
              <div className="supporter-method">
                {d.values?.paymentMethod || "UPI"}
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop — aria-hidden so screen readers skip */}
          {donations.map((d, i) => (
            <div key={`dup-${d._id || d.id || i}`} className="supporter-ticker-item" aria-hidden="true">
              <div className="supporter-avatar">
                {(d.values?.name || "A")[0].toUpperCase()}
              </div>
              <div className="supporter-info">
                <strong>{d.values?.name || "Anonymous"}</strong>
                <span>{d.values?.donationType || "Donation"} · ₹{d.values?.amount || "—"}</span>
              </div>
              <div className="supporter-method">
                {d.values?.paymentMethod || "UPI"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Team Member Card ─────────────────────────────────────── */
function TeamMemberCard({ member }) {
  const initials = member.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const roleColors = { "Founder":"#1f8f62", "Co-Founder":"#118ab2", "Facilities Head":"#c26b34", "Head of Animal Welfare":"#ef476f" };
  const color = roleColors[member.role] || "#1f8f62";
  return (
    <div className="col-md-3 col-sm-6">
      <div className="team-member-card">
        <div className="team-member-avatar" style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)`, border: `3px solid ${color}` }}>
          <span className="team-member-initials" style={{ color }}>{initials}</span>
        </div>
        <div className="team-member-info">
          <h4>{member.name}</h4>
          <span className="team-member-role" style={{ color }}>{member.role}</span>
        </div>
      </div>
    </div>
  );
}

/* ── HomePage ─────────────────────────────────────────────── */
function HomePage() {
  const [activeSlide, setActiveSlide]   = useState(0);
  const [thankYouType, setThankYouType] = useState(null);
  const location    = useLocation();
  const { content, submissions } = useSiteContent();

  const strategyImages = [
    "/images/ngo/adoption.jpg","/images/ngo/abc-care.jpg","/images/ngo/feeding.jpg",
    "/images/ngo/awareness.jpg","/images/ngo/rescue.jpg",
  ];

  const activeSubmissions = submissions.filter((s) => s.status !== "deleted" && s.status !== "rejected");
  const activeStories     = content.stories.filter((p) => p.status !== "deleted");
  // Only confirmed donations appear in the supporter ticker
  const confirmedDonations = submissions.filter(
    (s) => s.type === "donation" && s.confirmed === true && s.status !== "deleted" && s.status !== "rejected"
  );
  // Active pets from content (admin-managed)
  const activePets = (content.pets || []).filter((p) => p.petStatus !== "deleted" && p.status !== "Adopted" && p.status !== "Removed");

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((c) => (c + 1) % content.heroSlides.length), 15000);
    return () => window.clearInterval(timer);
  }, [content.heroSlides.length]);

  useEffect(() => {
    if (!location.hash) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  useEffect(() => {
    const handler = (e) => { setThankYouType(e.detail?.type); };
    window.addEventListener("ngo-form-submitted", handler);
    return () => window.removeEventListener("ngo-form-submitted", handler);
  }, []);

  /* Extended impact stats */
  const impactStats = [
    { value: "20+",  suffix: "",  label: "Years of service",        icon: "fas fa-calendar-alt" },
    { value: "500+", suffix: "",  label: "Animals rescued to date",  icon: "fas fa-paw" },
    { value: "200+", suffix: "",  label: "Successful adoptions",     icon: "fas fa-home" },
    { value: "300+", suffix: "",  label: "Animals sterilized",       icon: "fas fa-syringe" },
    { value: "30",   suffix: "+", label: "Stray dogs fed daily",     icon: "fas fa-bone" },
    { value: "100",  suffix: "%", label: "Compassion-driven mission",icon: "fas fa-heart" },
  ];

  return (
    <div className="home-page">

      {/* ── Hero Carousel ── */}
      <section className="slider react-slider" aria-label="Hero slideshow">
        {content.heroSlides.map((slide, index) => (
          <div key={slide.title} className={`react-slide ${index === activeSlide ? "is-active" : ""}`}
            aria-hidden={index !== activeSlide}>
            {slide.type === "video" ? (
              <AnimatedCanvasSlide sceneIndex={index === 3 ? 0 : 1} isActive={index === activeSlide} />
            ) : (
              <HeroStoryAnimation variant={slide.animation || "rescue"} />
            )}
            <div className="container">
              <div className="slider-captions react-captions">
                <span className="hero-kicker">{content.org.legalType}</span>
                <h1 className="slider-title">{slide.title}</h1>
                <p className="slider-text">{slide.text}</p>
                <div className="hero-actions">
                  <NavLink className="btn btn-success" to="/contact#volunteer">Volunteer With Us</NavLink>
                  <NavLink className="btn btn-light hero-secondary" to="/contact#sponsor">Sponsor a Dog</NavLink>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="react-slider-dots" role="tablist" aria-label="Slide navigation">
          {content.heroSlides.map((slide, index) => (
            <button key={slide.title} type="button" role="tab" aria-selected={index === activeSlide}
              className={index === activeSlide ? "active" : ""} onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}: ${slide.title}`} />
          ))}
        </div>
      </section>

      {/* ── Supporter Ticker — only confirmed donations ── */}
      {confirmedDonations.length > 0 && <SupporterTicker donations={confirmedDonations} />}

      {/* ── About ── */}
      <div id="about" className="about-us container-fluid">
        <div className="container">
          <div className="row natur-row no-margin w-100">
            <div className="text-part col-md-6">
              <h2>{content.about.title}</h2>
              {content.about.intro.map((paragraph) => (<p key={paragraph}>{paragraph}</p>))}
              {/* Section 8 trust badge */}
              <div className="section8-badge">
                <i className="fas fa-certificate" />
                <div>
                  <strong>Registered Section 8 Company</strong>
                  <span>Under the Companies Act, 2013 · 80G &amp; 12A Tax Exemption Applicable</span>
                </div>
              </div>
            </div>
            <div className="image-part col-md-6">
              <div className="about-actions-grid">
                {content.quickActions.map((item, idx) => {
                  const iconColors = ["#1f8f62", "#c26b34", "#f0b44a", "#118ab2"];
                  const bgColors   = ["#edf9f1", "#fff4ec", "#fffbf0", "#eaf2ff"];
                  return (
                    <div className="about-action-card" key={item.title}>
                      <div className="about-action-icon" style={{ background: bgColors[idx % 4], color: iconColors[idx % 4] }}>
                        <i className={item.icon} />
                      </div>
                      <p className="about-action-label">{item.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mission & Vision ── */}
      <section className="container-fluid mission-vision">
        <div className="container">
          <div className="row mission mission-vision-combined">
            <div className="col-lg-6 mv-det">
              <h1>Our Mission &amp; Vision</h1>
              <div className="mv-copy-block"><h3>Mission</h3><p>{content.mission}</p></div>
              <div className="mv-copy-block"><h3>Vision</h3><p>{content.vision}</p></div>
            </div>
            <div className="col-lg-6 mv-img mv-img-combined">
              <div className="mv-visual-card mv-visual-card-mission mv-3d-card">
                <img src={content.missionImage} alt="Animal rescue work supporting the Wings and Tails mission" />
              </div>
              <div className="mv-visual-card mv-visual-card-vision mv-3d-card">
                <img src={content.visionImage} alt="Community compassion supporting the Wings and Tails vision" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section id="programs" className="events">
        <div className="container">
          <div className="session-title row"><h2>5-Step Strategy</h2><p>{content.coreActivities.join(" • ")}</p></div>
          <div className="strategy-grid">
            {content.coreActivities.map((item, index) => (
              <div className="strategy-card strategy-card-photo" key={item}
                style={{ backgroundImage: `linear-gradient(rgba(18,48,34,0.72),rgba(18,48,34,0.58)),url(${strategyImages[index]})` }}>
                <span>0{index + 1}</span>
                <h4>{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="events">
        <div className="container">
          <div className="session-title row">
            <h2>Our Services &amp; Work Areas</h2>
            <p>Rescue, shelter, feeding, birth control, foster support, and long-term community awareness.</p>
          </div>
          <div className="event-ro row">
            {content.services.map((service) => (
              <div className="col-md-4 col-sm-6" key={service.title}>
                <div className="event-box">
                  <img src={service.image} alt={service.title} />
                  <h4>{service.title}</h4>
                  <p className="raises"><span>{service.raised}</span> / {service.goal}</p>
                  <p className="desic">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Do-Roti Challenge ── */}
      <DoRotiChallenge />

      {/* ── Impact Snapshot (visual dashboard) ── */}
      <div className="doctor-message">
        <div className="inner-lay">
          <div className="container">
            <div className="row session-title">
              <h2>Impact Snapshot</h2>
              <p>{content.about.founderStory}</p>
            </div>
            <div className="impact-dashboard">
              {impactStats.map((stat) => (
                <div className="impact-stat-card" key={stat.label}>
                  <div className="impact-stat-icon"><i className={stat.icon} /></div>
                  <div className="impact-stat-value">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="impact-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Donation Carousel ── */}
      <DonationCarousel />

      {/* ── Pet Profile Cards (Adoption Portal) — admin-managed ── */}
      {activePets.length > 0 && (
        <section className="events pet-adoption-section" id="adopt">
          <div className="container">
            <div className="session-title row">
              <h2>🐾 Adopt a Friend</h2>
              <p>Each of these animals is waiting for a loving forever home. Meet them, learn their story, and take the first step.</p>
            </div>
            <div className="pet-cards-grid">
              {activePets.map((pet) => <PetProfileCard key={pet.id} pet={pet} />)}
            </div>
            <div style={{textAlign:"center",marginTop:32}}>
              <NavLink to="/contact#adoption" className="btn btn-success">Start Adoption Process</NavLink>
            </div>
          </div>
        </section>
      )}

      {/* ── Stories Preview ── */}
      <StoriesPreview stories={activeStories} />

      {/* ── Team ── */}
      <section className="our-team team-11">
        <div className="container">
          <div className="session-title row">
            <h2>Our Team</h2>
            <p>The people leading rescue, shelter care, facilities, and animal welfare efforts.</p>
          </div>
          <div className="row team-row">
            {content.team.map((member) => <TeamMemberCard key={member.name} member={member} />)}
          </div>
        </div>
      </section>

      {/* ── Thank-you modal ── */}
      {thankYouType && <ThankYouModal onClose={() => setThankYouType(null)} formType={thankYouType} />}
    </div>
  );
}

export default HomePage;
