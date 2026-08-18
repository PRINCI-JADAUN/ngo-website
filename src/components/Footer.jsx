import { NavLink } from "react-router-dom";
import { useSiteContent } from "../context/SiteContentContext";
import { navLinks } from "../data/siteData";

function Footer() {
  const { content } = useSiteContent();

  return (
    <>
      <footer className="footer-professional">
        <div className="container">
          <div className="footer-pro-grid footer-pro-grid--5col">

            {/* Brand column */}
            <div className="footer-pro-brand">
              <h3>🐾 {content.org.name}</h3>
              <p>{content.org.founderLine}</p>
              <p style={{marginTop:8, opacity:.7, fontSize:"0.82rem"}}>{content.org.tagline}</p>
              <div className="footer-pro-social">
                <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
                <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
                <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
                <a href="#" aria-label="YouTube"><i className="fab fa-youtube" /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-pro-col">
              <h4>Quick Links</h4>
              <ul>
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to}>{link.label}</NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Involved */}
            <div className="footer-pro-col">
              <h4>Get Involved</h4>
              <ul>
                <li><NavLink to="/contact#volunteer">Volunteer With Us</NavLink></li>
                <li><NavLink to="/contact#donate">Donate Now</NavLink></li>
                <li><NavLink to="/contact#sponsor">Sponsor a Dog</NavLink></li>
                <li><NavLink to="/contact#adoption">Adopt an Animal</NavLink></li>
                <li><NavLink to="/contact">Report a Case</NavLink></li>
              </ul>
            </div>

            {/* Legal / Trust */}
            <div className="footer-pro-col footer-trust-col">
              <h4>Trust &amp; Transparency</h4>
              <ul className="footer-trust-list">
                <li><i className="fas fa-certificate" /> Section 8 Company</li>
                <li><i className="fas fa-file-alt" /> Registered under Companies Act, 2013</li>
                <li><i className="fas fa-receipt" /> 80G Tax Exemption (applicable)</li>
                <li><i className="fas fa-shield-alt" /> 12A Registration (applicable)</li>
                <li style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.1)"}}>
                  <i className="fas fa-lock" />
                  <a href="/admin" style={{color:"rgba(255,255,255,0.3)",fontSize:"0.78rem"}}>Staff Login</a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-pro-col">
              <h4>Contact Us</h4>
              <ul className="footer-pro-contact">
                <li>
                  <i className="fas fa-map-marker-alt" />
                  {content.org.location}
                </li>
                <li>
                  <i className="fas fa-phone-alt" />
                  {content.org.phone}
                </li>
                <li>
                  <i className="fas fa-envelope" />
                  <a href={`mailto:${content.org.email}`} style={{color:"inherit"}}>{content.org.email}</a>
                </li>
                <li>
                  <i className="fas fa-clock" />
                  {content.org.hours}
                </li>
                <li>
                  <i className="fas fa-globe" />
                  <a href={`https://${content.org.website}`} target="_blank" rel="noreferrer" style={{color:"inherit"}}>{content.org.website}</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Key messages strip */}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"16px 0",display:"flex",gap:20,flexWrap:"wrap",marginBottom:0}}>
            {content.org.keyMessages.map((msg) => (
              <span key={msg} style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.45)"}}>
                ✦ {msg}
              </span>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="footer-pro-bottom">
            <p>© 2026 {content.org.name}. {content.org.registrationLine}.</p>
            <div className="footer-pro-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
