import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSiteContent } from "../context/SiteContentContext";
import { navLinks } from "../data/siteData";

function Header() {
  const { content } = useSiteContent();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>

      {/* ── Top info bar — white, always visible ── */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-inner">
            <ul className="header-top-left">
              <li>
                <i className="far fa-envelope" />
                <a href={`mailto:${content.org.email}`}>{content.org.email}</a>
              </li>
              <li className="header-top-sep" aria-hidden="true">|</li>
              <li>
                <i className="fas fa-phone-volume" />
                <a href={`tel:${content.org.phone}`}>{content.org.phone}</a>
              </li>
              <li className="header-top-sep" aria-hidden="true">|</li>
              <li>
                <i className="fas fa-clock" />
                <span>{content.org.hours}</span>
              </li>
            </ul>
            <div className="header-top-right">
              <NavLink className="btn btn-sm btn-success" to="/contact#volunteer">
                <i className="fas fa-hands-helping" /> Volunteer
              </NavLink>
              <NavLink className="btn btn-sm header-donate-btn" to="/contact#donate">
                <i className="fas fa-hand-holding-heart" /> Donate
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <div className="header-bottom">
        <div className="container">
          <div className="header-nav-inner">

            {/* Logo */}
            <NavLink className="brand-mark" to="/" aria-label="Wings and Tails home">
              <span className="brand-badge"><i className="fas fa-dove" /></span>
              <span>
                Wings &amp; Tails
                <small>{content.org.legalType}</small>
              </span>
            </NavLink>

            {/* Desktop nav — vertical links */}
            <nav className="desktop-nav" aria-label="Main navigation">
              <ul className="vnav">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      className={({ isActive }) => {
                        const [path, hash] = link.to.split("#");
                        const isHashActive = hash
                          ? location.pathname === path && location.hash === `#${hash}`
                          : isActive && !location.hash;
                        return `vnav-link${isHashActive ? " vnav-link--active" : ""}`;
                      }}
                      to={link.to}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Hamburger — mobile/tablet only */}
            <button
              className={`hamburger${menuOpen ? " hamburger--open" : ""}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile/tablet slide-in drawer ── */}
      <div
        className={`mobile-drawer${menuOpen ? " mobile-drawer--open" : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="mobile-drawer-header">
          <NavLink className="brand-mark brand-mark--sm" to="/" onClick={() => setMenuOpen(false)}>
            <span className="brand-badge brand-badge--sm"><i className="fas fa-dove" /></span>
            <span>Wings &amp; Tails</span>
          </NavLink>
          <button className="mobile-drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <i className="fas fa-times" />
          </button>
        </div>

        <nav aria-label="Mobile navigation">
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  className={({ isActive }) => {
                    const [path, hash] = link.to.split("#");
                    const isHashActive = hash
                      ? location.pathname === path && location.hash === `#${hash}`
                      : isActive && !location.hash;
                    return `mobile-nav-link${isHashActive ? " mobile-nav-link--active" : ""}`;
                  }}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                  <i className="fas fa-chevron-right mobile-nav-arrow" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-nav-actions">
          <NavLink className="btn btn-success" to="/contact#volunteer" onClick={() => setMenuOpen(false)}>
            <i className="fas fa-hands-helping" /> Volunteer With Us
          </NavLink>
          <NavLink className="btn header-donate-btn" to="/contact#donate" onClick={() => setMenuOpen(false)}>
            <i className="fas fa-hand-holding-heart" /> Donate Now
          </NavLink>
        </div>

        <div className="mobile-nav-contact">
          <a href={`tel:${content.org.phone}`}>
            <i className="fas fa-phone" />{content.org.phone}
          </a>
          <a href={`mailto:${content.org.email}`}>
            <i className="fas fa-envelope" />{content.org.email}
          </a>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

export default Header;
