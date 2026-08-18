import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import { useSiteContent } from "../context/SiteContentContext";

/* ── Confetti ─────────────────────────────────────────────── */
const CONFETTI_COLORS = [
  "#1f8f62","#3cc88f","#f0b44a","#c26b34","#ffd166","#06d6a0","#118ab2","#ef476f",
];

function Confetti() {
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    w: 7 + Math.random() * 9,
    h: 5 + Math.random() * 7,
    dur: 2.2 + Math.random() * 2.4,
    delay: Math.random() * 1.4,
    rotate: Math.random() * 360,
  }));
  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: "-14px",
            width: p.w,
            height: p.h,
            background: p.color,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </>
  );
}

/* ── Thank-You Modal ──────────────────────────────────────── */
function ThankYouModal({ name, formType, onClose }) {
  const typeLabels = {
    contact: "message",
    volunteer: "volunteer application",
    donation: "donation intent",
    sponsor: "sponsorship request",
    adoption: "adoption application",
  };
  const label = typeLabels[formType] || "submission";

  return (
    <div className="thankyou-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Submission confirmed">
      <Confetti />
      <div className="thankyou-card contact-thankyou-card" onClick={(e) => e.stopPropagation()}>
        <div className="thankyou-icon">🎉</div>
        <h3>Thank You{name ? `, ${name}` : ""}!</h3>
        <p className="thankyou-personal">
          Your <strong>{label}</strong> has been received successfully.
        </p>
        <p className="thankyou-note">
          Our team at <strong>Wings &amp; Tails</strong> will review your submission and get back to you
          within <strong>24–48 hours</strong>. Your compassion for animals means the world to us. 🐾
        </p>
        <div className="thankyou-divider" />
        <p className="thankyou-sub">
          A confirmation email has been sent to your inbox. Please check your spam folder if you don't see it.
        </p>
        <button className="thankyou-close" onClick={onClose} autoFocus>
          Wonderful ✓
        </button>
      </div>
    </div>
  );
}

/* ── Form type config ─────────────────────────────────────── */
const FORM_TYPES = [
  { id: "contact",   label: "General Enquiry",      icon: "fas fa-envelope",         color: "#1f8f62" },
  { id: "volunteer", label: "Volunteer",             icon: "fas fa-hands-helping",    color: "#118ab2" },
  { id: "donation",  label: "Donate",                icon: "fas fa-hand-holding-heart",color: "#f0b44a" },
  { id: "sponsor",   label: "Sponsor a Dog",         icon: "fas fa-paw",              color: "#c26b34" },
  { id: "adoption",  label: "Adopt an Animal",       icon: "fas fa-home",             color: "#ef476f" },
];

const FORM_DEFAULTS = {
  contact:   { name: "", email: "", phone: "", subject: "", message: "" },
  volunteer: { name: "", email: "", phone: "", age: "", city: "", interest: "", availability: "", experience: "", shift: "", photo: null },
  donation:  { name: "", email: "", phone: "", donationType: "", amount: "", paymentMethod: "", message: "" },
  sponsor:   { name: "", email: "", phone: "", dogName: "", commitment: "", message: "", photo: null },
  adoption:  { name: "", email: "", phone: "", address: "", occupation: "", familySize: "", existingPets: "", houseType: "", experience: "", reason: "", photo: null },
};

/* ── Unified Form Fields ──────────────────────────────────── */
function FormFields({ type, values, onChange, content }) {
  const field = (name, props) => (
    <div className="uf-field">
      <label className="uf-label" htmlFor={`${type}-${name}`}>{props.label}{props.required && <span className="uf-required">*</span>}</label>
      {props.type === "textarea" ? (
        <textarea
          id={`${type}-${name}`}
          className="form-control uf-input"
          rows={props.rows || 3}
          placeholder={props.placeholder || ""}
          value={values[name] || ""}
          onChange={(e) => onChange(name, e.target.value)}
          required={props.required}
        />
      ) : props.type === "select" ? (
        <select
          id={`${type}-${name}`}
          className="form-control uf-input"
          value={values[name] || ""}
          onChange={(e) => onChange(name, e.target.value)}
          required={props.required}
        >
          <option value="">{props.placeholder || "Select an option"}</option>
          {props.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : props.type === "file" ? (
        <input
          id={`${type}-${name}`}
          type="file"
          accept="image/*"
          className="uf-file-input"
          onChange={(e) => onChange(name, e.target.files[0])}
          required={props.required}
        />
      ) : (
        <input
          id={`${type}-${name}`}
          type={props.type || "text"}
          className="form-control uf-input"
          placeholder={props.placeholder || ""}
          value={values[name] || ""}
          onChange={(e) => onChange(name, e.target.value)}
          required={props.required}
          min={props.min}
        />
      )}
    </div>
  );

  /* Shared fields for all types */
  const sharedFields = (
    <div className="uf-row-2">
      {field("name",  { label: "Full Name",     placeholder: "Your full name",    required: true })}
      {field("email", { label: "Email Address", placeholder: "your@email.com",    required: true, type: "email" })}
      {field("phone", { label: "Phone Number",  placeholder: "+91 XXXXX XXXXX",   required: type !== "donation" })}
    </div>
  );

  if (type === "contact") return (
    <div className="uf-fields">
      {sharedFields}
      {field("subject", { label: "Subject", placeholder: "What is this about?", required: true })}
      {field("message", { label: "Your Message", type: "textarea", rows: 5, placeholder: "Tell us how we can help you...", required: true })}
    </div>
  );

  if (type === "volunteer") return (
    <div className="uf-fields">
      {sharedFields}
      <div className="uf-row-2">
        {field("age",  { label: "Age", type: "number", placeholder: "Your age", required: true, min: "18" })}
        {field("city", { label: "City", placeholder: "Your city", required: true })}
      </div>
      {field("interest", { label: "Area of Interest", type: "select", required: true, placeholder: "Select interest area", options: content.forms.volunteerAreas })}
      <div className="uf-row-2">
        {field("shift",        { label: "Preferred Shift / Schedule", type: "textarea", rows: 2, placeholder: "Morning, evening, weekends...", required: true })}
        {field("availability", { label: "Availability & Short Note",  type: "textarea", rows: 2, placeholder: "How often can you volunteer?", required: true })}
      </div>
      {field("experience", { label: "Experience with Animals", type: "textarea", rows: 3, placeholder: "Describe any previous experience...", required: true })}
      {field("photo", { label: "Your Photo (optional)", type: "file" })}
    </div>
  );

  if (type === "donation") return (
    <div className="uf-fields">
      {sharedFields}
      <div className="uf-row-2">
        {field("donationType",   { label: "Donation Purpose", type: "select", required: true, placeholder: "Select purpose", options: content.forms.donationTypes })}
        {field("amount",         { label: "Amount (₹)",       placeholder: "e.g. 500", required: true })}
      </div>
      {field("paymentMethod", { label: "Payment Method", type: "select", required: true, placeholder: "Select method", options: ["UPI", "Bank Transfer", "Cash", "Cheque", "Online Portal"] })}
      <div className="uf-donation-upi-note">
        <i className="fas fa-info-circle" />
        <span>UPI ID: <strong>wingsandtails@upi</strong> — Please include your name in the payment note. Our team will verify and confirm your donation.</span>
      </div>
      {field("message", { label: "Optional Note", type: "textarea", rows: 3, placeholder: "Any message for the team..." })}
    </div>
  );

  if (type === "sponsor") return (
    <div className="uf-fields">
      {sharedFields}
      {field("dogName", { label: "Choose a Dog to Sponsor", type: "select", required: true, placeholder: "Select a dog", options: content.sponsorship.dogs.map((d) => d.name) })}
      {field("commitment", { label: "How Will You Support This Dog?", type: "textarea", rows: 3, placeholder: "Monthly food, medical bills, shelter costs...", required: true })}
      {field("message",    { label: "Additional Message",              type: "textarea", rows: 3, placeholder: "Anything else you'd like to share...", required: true })}
      {field("photo", { label: "Your Photo (optional)", type: "file" })}
    </div>
  );

  if (type === "adoption") return (
    <div className="uf-fields">
      {sharedFields}
      {field("address", { label: "Home Address", type: "textarea", rows: 2, placeholder: "Your full address", required: true })}
      <div className="uf-row-2">
        {field("occupation",  { label: "Occupation",   placeholder: "Your profession",    required: true })}
        {field("familySize",  { label: "Family Size",  type: "number", placeholder: "No. of family members", required: true, min: "1" })}
      </div>
      <div className="uf-row-2">
        {field("houseType",   { label: "House Type",   placeholder: "Apartment / House / Rented / Owned", required: true })}
        {field("existingPets",{ label: "Existing Pets",placeholder: "Any pets currently at home?" })}
      </div>
      {field("experience", { label: "Pet Ownership Experience", type: "textarea", rows: 3, placeholder: "Describe your experience with pets...", required: true })}
      {field("reason",     { label: "Reason for Adoption",      type: "textarea", rows: 3, placeholder: "Why do you want to adopt?", required: true })}
      {field("photo", { label: "Your Photo (optional)", type: "file" })}
    </div>
  );

  return null;
}

/* ── Main ContactPage ─────────────────────────────────────── */
function ContactPage() {
  const { content, addSubmission } = useSiteContent();
  const location = useLocation();
  const [activeType, setActiveType] = useState("contact");
  const [formValues, setFormValues] = useState(FORM_DEFAULTS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [thankYou, setThankYou] = useState(null); // { name, type }
  const formRef = useRef(null);

  /* Scroll to form section on hash change */
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    const typeMatch = FORM_TYPES.find((t) => t.id === hash);
    if (typeMatch) {
      setActiveType(typeMatch.id);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, [location.hash]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [activeType]: { ...prev[activeType], [field]: value },
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const values = formValues[activeType];
      await addSubmission(activeType, values);
      const submitterName = values.name || "";
      setFormValues((prev) => ({ ...prev, [activeType]: FORM_DEFAULTS[activeType] }));
      setThankYou({ name: submitterName, type: activeType });
      window.dispatchEvent(new CustomEvent("ngo-form-submitted", { detail: { type: activeType } }));
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeConfig = FORM_TYPES.find((t) => t.id === activeType);

  return (
    <>
      <PageBanner title="Contact Us" />

      {/* Map */}
      <div className="row no-margin">
        <iframe
          title="Wings and Tails location"
          style={{ width: "100%", display: "block" }}
          src="https://www.google.com/maps?q=Techzone%207%2C%20Greater%20Noida%20West&z=13&output=embed"
          height="420"
          loading="lazy"
        />
      </div>

      <div className="contact-rooo">
        <div className="container">
          <div className="row contact-main-row">

            {/* ── Left: Info card ── */}
            <div className="col-lg-4 col-md-5">
              <div className="contact-info-card contact-info-card--new">
                <div className="cic-logo">
                  <i className="fas fa-dove" />
                </div>
                <h2>{content.org.name}</h2>
                <p className="cic-tagline">{content.org.tagline}</p>

                <div className="cic-details">
                  <div className="cic-row">
                    <i className="fas fa-certificate" />
                    <span>{content.org.legalType}</span>
                  </div>
                  <div className="cic-row">
                    <i className="fas fa-map-marker-alt" />
                    <span>{content.org.location}</span>
                  </div>
                  <div className="cic-row">
                    <i className="fas fa-phone-alt" />
                    <a href={`tel:${content.org.phone}`}>{content.org.phone}</a>
                  </div>
                  <div className="cic-row">
                    <i className="fas fa-envelope" />
                    <a href={`mailto:${content.org.email}`}>{content.org.email}</a>
                  </div>
                  <div className="cic-row">
                    <i className="fas fa-clock" />
                    <span>{content.org.hours}</span>
                  </div>
                  <div className="cic-row">
                    <i className="fas fa-globe" />
                    <a href={`https://${content.org.website}`} target="_blank" rel="noreferrer">{content.org.website}</a>
                  </div>
                </div>

                <div className="cic-trust">
                  <div className="cic-trust-badge"><i className="fas fa-shield-alt" /> Section 8 Registered</div>
                  <div className="cic-trust-badge"><i className="fas fa-receipt" /> 80G Tax Exemption</div>
                  <div className="cic-trust-badge"><i className="fas fa-file-alt" /> 12A Registration</div>
                </div>

                <p className="cic-intro">{content.forms.contactIntro}</p>
              </div>
            </div>

            {/* ── Right: Unified form ── */}
            <div className="col-lg-8 col-md-7" ref={formRef}>
              <div className="unified-form-card">

                {/* Type selector tabs */}
                <div className="uf-tabs" role="tablist" aria-label="Form type">
                  {FORM_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={activeType === t.id}
                      className={`uf-tab ${activeType === t.id ? "uf-tab--active" : ""}`}
                      style={activeType === t.id ? { "--tab-color": t.color } : {}}
                      onClick={() => { setActiveType(t.id); setError(""); }}
                    >
                      <i className={t.icon} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>

                {/* Form header */}
                <div className="uf-header" style={{ "--header-color": activeConfig.color }}>
                  <div className="uf-header-icon">
                    <i className={activeConfig.icon} />
                  </div>
                  <div>
                    <h2 className="uf-title">{activeConfig.label}</h2>
                    <p className="uf-subtitle">
                      {activeType === "contact"   && "Send us a message and we'll respond within 24 hours."}
                      {activeType === "volunteer" && "Join our rescue team. We'll be in touch within 2 business days."}
                      {activeType === "donation"  && "Your donation directly helps animals in need. Every rupee counts."}
                      {activeType === "sponsor"   && "Sponsor a dog and cover their shelter, food, and medical care."}
                      {activeType === "adoption"  && "Give a rescued animal a forever home. We'll review your application within 48 hours."}
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
                  <FormFields
                    type={activeType}
                    values={formValues[activeType]}
                    onChange={handleChange}
                    content={content}
                  />

                  {error && (
                    <div className="uf-error" role="alert">
                      <i className="fas fa-exclamation-circle" /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-success uf-submit"
                    disabled={submitting}
                    style={{ background: activeConfig.color, borderColor: activeConfig.color }}
                  >
                    {submitting ? (
                      <><i className="fas fa-spinner fa-spin" /> Submitting...</>
                    ) : (
                      <>
                        <i className={activeConfig.icon} />
                        {activeType === "contact"   && " Send Message"}
                        {activeType === "volunteer" && " Apply as Volunteer"}
                        {activeType === "donation"  && " Submit Donation Intent"}
                        {activeType === "sponsor"   && " Send Sponsorship Request"}
                        {activeType === "adoption"  && " Apply for Adoption"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Thank-you modal */}
      {thankYou && (
        <ThankYouModal
          name={thankYou.name}
          formType={thankYou.type}
          onClose={() => setThankYou(null)}
        />
      )}
    </>
  );
}

export default ContactPage;
