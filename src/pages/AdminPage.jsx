import { useEffect, useState } from "react";
import { useSiteContent } from "../context/SiteContentContext";
import "../admin.css";

/* ─────────────────────────────────────────────────────────────
   TOAST SYSTEM
───────────────────────────────────────────────────────────── */
function Toast({ toasts, remove }) {
  return (
    <div className="ap-toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`ap-toast ap-toast--${t.type}`}>
          <i className={t.type === "success" ? "fas fa-check-circle" : t.type === "error" ? "fas fa-times-circle" : "fas fa-info-circle"} />
          <span>{t.message}</span>
          <button onClick={() => remove(t.id)} aria-label="Close"><i className="fas fa-times" /></button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3800);
  };
  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  return { toasts, add, remove };
}

/* ─────────────────────────────────────────────────────────────
   CONFIRM DIALOG
───────────────────────────────────────────────────────────── */
function ConfirmDialog({ config, onClose }) {
  if (!config) return null;
  return (
    <div className="ap-dialog-backdrop" onClick={onClose}>
      <div className="ap-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="ap-dialog-icon ap-dialog-icon--warn"><i className="fas fa-exclamation-triangle" /></div>
        <h3>{config.title}</h3>
        <p>{config.message}</p>
        <div className="ap-dialog-actions">
          <button className="ap-btn ap-btn--ghost" onClick={onClose}>Cancel</button>
          <button className={`ap-btn ap-btn--${config.danger ? "danger" : "primary"}`} onClick={() => { config.onConfirm(); onClose(); }}>
            {config.label || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   IMAGE LIGHTBOX
───────────────────────────────────────────────────────────── */
function Lightbox({ src, title, onClose }) {
  if (!src) return null;
  return (
    <div className="ap-dialog-backdrop" onClick={onClose}>
      <div className="ap-lightbox" onClick={(e) => e.stopPropagation()}>
        <button className="ap-lightbox-close" onClick={onClose}><i className="fas fa-times" /></button>
        <img src={src} alt={title} />
        {title && <p>{title}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, color, onClick }) {
  return (
    <button className={`ap-stat${onClick ? " ap-stat--clickable" : ""}`} style={{ "--sc": color }} onClick={onClick} type="button">
      <div className="ap-stat-icon"><i className={icon} /></div>
      <div className="ap-stat-body">
        <span className="ap-stat-val">{value}</span>
        <span className="ap-stat-label">{label}</span>
        {sub && <span className="ap-stat-sub">{sub}</span>}
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION: DASHBOARD
───────────────────────────────────────────────────────────── */
function DashboardSection({ submissions, content, setSection, toast }) {
  const total      = submissions.length;
  const confirmed  = submissions.filter((s) => s.confirmed).length;
  const pending    = submissions.filter((s) => !s.confirmed && s.status === "active").length;
  const donations  = submissions.filter((s) => s.type === "donation" && s.confirmed).length;
  const adoptions  = submissions.filter((s) => s.type === "adoption").length;
  const volunteers = submissions.filter((s) => s.type === "volunteer").length;
  const activePets = (content.pets || []).filter((p) => p.petStatus !== "deleted" && p.status !== "Adopted").length;
  const gallery    = (content.galleryItems || []).filter((i) => i.status !== "deleted").length;
  const stories    = (content.stories || []).filter((s) => s.status !== "deleted").length;

  const recent = submissions.slice(0, 6);

  const typeColor = { contact:"#6366f1", volunteer:"#10b981", donation:"#f59e0b", sponsor:"#8b5cf6", adoption:"#ec4899" };
  const typeIcon  = { contact:"fas fa-envelope", volunteer:"fas fa-hands-helping", donation:"fas fa-hand-holding-heart", sponsor:"fas fa-paw", adoption:"fas fa-home" };

  const handleReset = async () => {
    try {
      await fetch("/api/content/reset-static", { method: "POST" });
      toast.add("Static content synced from latest siteData.", "success");
    } catch {
      toast.add("Sync failed.", "error");
    }
  };

  return (
    <div className="ap-section">
      <div className="ap-section-head">
        <div>
          <h2>Live Dashboard</h2>
          <p>Real-time overview of Wings &amp; Tails operations</p>
        </div>
        <button className="ap-btn ap-btn--ghost ap-btn--sm" onClick={handleReset}>
          <i className="fas fa-sync-alt" /> Sync Content
        </button>
      </div>

      {/* Stat grid */}
      <div className="ap-stat-grid">
        <StatCard icon="fas fa-inbox"              label="Total Submissions"  value={total}      color="#6366f1" onClick={() => setSection("submissions")} />
        <StatCard icon="fas fa-check-circle"        label="Confirmed"          value={confirmed}  color="#10b981" onClick={() => setSection("submissions")} />
        <StatCard icon="fas fa-clock"               label="Pending Review"     value={pending}    color="#f59e0b" sub="Needs admin action" onClick={() => setSection("submissions")} />
        <StatCard icon="fas fa-hand-holding-heart"  label="Confirmed Donations" value={donations} color="#ec4899" onClick={() => setSection("submissions")} />
        <StatCard icon="fas fa-paw"                 label="Pets Available"     value={activePets} color="#8b5cf6" onClick={() => setSection("pets")} />
        <StatCard icon="fas fa-home"                label="Adoption Requests"  value={adoptions}  color="#14b8a6" onClick={() => setSection("submissions")} />
        <StatCard icon="fas fa-images"              label="Gallery Photos"     value={gallery}    color="#0ea5e9" onClick={() => setSection("gallery")} />
        <StatCard icon="fas fa-book-open"           label="Published Stories"  value={stories}    color="#f97316" onClick={() => setSection("stories")} />
      </div>

      {/* Recent submissions */}
      <div className="ap-card" style={{ marginTop: 24 }}>
        <div className="ap-card-head">
          <h3><i className="fas fa-stream" /> Recent Activity</h3>
          <button className="ap-btn ap-btn--ghost ap-btn--sm" onClick={() => setSection("submissions")}>View all</button>
        </div>
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead><tr><th>Name</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={4} className="ap-empty">No submissions yet</td></tr>
              ) : recent.map((s) => (
                <tr key={s._id}>
                  <td><strong>{s.values?.name || "—"}</strong></td>
                  <td>
                    <span className="ap-type-badge" style={{ background: (typeColor[s.type] || "#6366f1") + "22", color: typeColor[s.type] || "#6366f1" }}>
                      <i className={typeIcon[s.type] || "fas fa-file"} /> {s.type}
                    </span>
                  </td>
                  <td>{new Date(s.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>
                    <span className={`ap-status-pill ap-status-pill--${s.status === "deleted" ? "danger" : s.status === "rejected" ? "warn" : s.confirmed ? "success" : "info"}`}>
                      {s.status === "deleted" ? "Deleted" : s.status === "rejected" ? "Rejected" : s.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Volunteer summary */}
      <div className="ap-2col" style={{ marginTop: 18 }}>
        <div className="ap-card">
          <div className="ap-card-head"><h3><i className="fas fa-hands-helping" /> Volunteers</h3></div>
          <div className="ap-big-num" style={{ color:"#10b981" }}>{volunteers}</div>
          <p className="ap-card-hint">Total volunteer applications received</p>
        </div>
        <div className="ap-card">
          <div className="ap-card-head"><h3><i className="fas fa-paw" /> Adoption Queue</h3></div>
          <div className="ap-big-num" style={{ color:"#ec4899" }}>{adoptions}</div>
          <p className="ap-card-hint">Animals waiting for adoption applications</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION: SUBMISSIONS
───────────────────────────────────────────────────────────── */
function SubmissionsSection({ submissions, refreshSubmissions, toast, setConfirm }) {
  const [search, setSearch]       = useState("");
  const [typeF,  setTypeF]        = useState("all");
  const [statusF, setStatusF]     = useState("all");
  const [expanded, setExpanded]   = useState(null);
  const [lightbox, setLightbox]   = useState(null);

  const typeColor = { contact:"#6366f1", volunteer:"#10b981", donation:"#f59e0b", sponsor:"#8b5cf6", adoption:"#ec4899" };
  const typeIcon  = { contact:"fas fa-envelope", volunteer:"fas fa-hands-helping", donation:"fas fa-hand-holding-heart", sponsor:"fas fa-paw", adoption:"fas fa-home" };

  const filtered = submissions.filter((s) => {
    const text = [s.values?.name, s.values?.email, s.values?.phone, s.type].filter(Boolean).join(" ").toLowerCase();
    return (typeF === "all" || s.type === typeF)
      && (statusF === "all" || (statusF === "confirmed" ? s.confirmed : (s.status || "active") === statusF))
      && (!search.trim() || text.includes(search.toLowerCase()));
  });

  const act = async (id, action) => {
    try {
      let res;
      if (action === "confirm")   res = await fetch(`/api/forms/confirm/${id}`, { method: "POST" });
      else if (action === "delete") res = await fetch(`/api/forms/${id}`, { method: "DELETE" });
      else res = await fetch(`/api/forms/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: action }) });
      if (!res.ok) throw new Error();
      await refreshSubmissions();
      setExpanded(null);
      toast.add(`Submission ${action === "confirm" ? "confirmed" : action === "delete" ? "deleted" : "updated"} successfully.`);
    } catch { toast.add("Action failed.", "error"); }
  };

  const pillClass = (s) => s.status === "deleted" ? "danger" : s.status === "rejected" ? "warn" : s.confirmed ? "success" : "info";
  const pillLabel = (s) => s.status === "deleted" ? "Deleted" : s.status === "rejected" ? "Rejected" : s.confirmed ? "Confirmed" : "Pending";

  return (
    <div className="ap-section">
      <div className="ap-section-head">
        <div><h2>Submissions</h2><p>All form submissions — filter, review, confirm or remove</p></div>
      </div>

      {/* Filters */}
      <div className="ap-filters">
        <div className="ap-search-wrap"><i className="fas fa-search" /><input type="search" placeholder="Search name, email, phone…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <select value={typeF} onChange={(e) => setTypeF(e.target.value)}>
          <option value="all">All types</option>
          {["contact","volunteer","donation","sponsor","adoption"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="deleted">Deleted</option>
        </select>
        <button className="ap-btn ap-btn--ghost ap-btn--sm" onClick={() => { setSearch(""); setTypeF("all"); setStatusF("all"); }}>Clear</button>
      </div>

      {/* Count */}
      <p className="ap-results-count">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</p>

      {/* Cards */}
      <div className="ap-sub-list">
        {filtered.length === 0 ? <div className="ap-empty-state"><i className="fas fa-inbox" /><p>No submissions match these filters</p></div>
        : filtered.map((s) => (
          <div className={`ap-sub-card${expanded === s._id ? " ap-sub-card--open" : ""}`} key={s._id}>
            <button className="ap-sub-card-head" onClick={() => setExpanded(expanded === s._id ? null : s._id)}>
              <div className="ap-sub-card-icon" style={{ background: (typeColor[s.type] || "#6366f1") + "18", color: typeColor[s.type] || "#6366f1" }}>
                <i className={typeIcon[s.type] || "fas fa-file"} />
              </div>
              <div className="ap-sub-card-info">
                <strong>{s.values?.name || "Unknown"}</strong>
                <span>{s.values?.email || s.type}</span>
              </div>
              <div className="ap-sub-card-meta">
                <span className={`ap-status-pill ap-status-pill--${pillClass(s)}`}>{pillLabel(s)}</span>
                <small>{new Date(s.createdAt).toLocaleDateString("en-IN")}</small>
              </div>
              <i className={`fas fa-chevron-${expanded === s._id ? "up" : "down"} ap-sub-chevron`} />
            </button>

            {expanded === s._id && (
              <div className="ap-sub-card-body">
                <div className="ap-detail-grid">
                  {Object.entries(s.values || {}).map(([k, v]) => (
                    <div className="ap-detail-item" key={k}>
                      <span>{k.replace(/([A-Z])/g, " $1")}</span>
                      <strong>{v?.toString() || "—"}</strong>
                    </div>
                  ))}
                </div>
                {s.image && (
                  <button className="ap-img-thumb" onClick={() => setLightbox({ src: s.image, title: s.values?.name })}>
                    <img src={s.image} alt="submission" />
                    <span>View photo</span>
                  </button>
                )}
                <div className="ap-sub-actions">
                  {!s.confirmed && s.status !== "deleted" && (
                    <button className="ap-btn ap-btn--success ap-btn--sm" onClick={() => act(s._id, "confirm")}><i className="fas fa-check" /> Confirm</button>
                  )}
                  {s.status !== "rejected" && s.status !== "deleted" && (
                    <button className="ap-btn ap-btn--warn ap-btn--sm" onClick={() => setConfirm({ title:"Reject this submission?", message:"It will be hidden from live sections but kept in history.", label:"Reject", onConfirm: () => act(s._id, "rejected") })}><i className="fas fa-ban" /> Reject</button>
                  )}
                  {s.status !== "deleted" && (
                    <button className="ap-btn ap-btn--danger ap-btn--sm" onClick={() => setConfirm({ title:"Delete this submission?", message:"It will be soft-deleted and kept in history.", label:"Delete", danger:true, onConfirm: () => act(s._id, "delete") })}><i className="fas fa-trash" /> Delete</button>
                  )}
                  {s.status !== "active" && (
                    <button className="ap-btn ap-btn--ghost ap-btn--sm" onClick={() => act(s._id, "active")}><i className="fas fa-undo" /> Restore</button>
                  )}
                </div>
                <div className="ap-timeline">
                  <span>Submitted: {new Date(s.createdAt).toLocaleString("en-IN")}</span>
                  {s.rejectedAt && <span>Rejected: {new Date(s.rejectedAt).toLocaleString("en-IN")}</span>}
                  {s.deletedAt  && <span>Deleted: {new Date(s.deletedAt).toLocaleString("en-IN")}</span>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox src={lightbox?.src} title={lightbox?.title} onClose={() => setLightbox(null)} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION: PETS
───────────────────────────────────────────────────────────── */
function PetsSection({ content, refreshContent, toast, setConfirm }) {
  const [petName, setPetName]       = useState("");
  const [petAge, setPetAge]         = useState("");
  const [petBreed, setPetBreed]     = useState("");
  const [petTraits, setPetTraits]   = useState("");
  const [petStatus, setPetStatus]   = useState("Available");
  const [petDesc, setPetDesc]       = useState("");
  const [petFile, setPetFile]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [lightbox, setLightbox]     = useState(null);

  const STATUS_OPTIONS = ["Available", "Foster", "Medical", "Adopted", "Removed"];
  const STATUS_COLOR = { Available:"#10b981", Foster:"#0ea5e9", Medical:"#f59e0b", Adopted:"#6366f1", Removed:"#ef4444" };

  const activePets  = (content.pets || []).filter((p) => p.petStatus !== "deleted" && p.status !== "Adopted" && p.status !== "Removed");
  const adoptedPets = (content.pets || []).filter((p) => p.status === "Adopted");

  const handleAdd = async () => {
    if (!petName.trim() || !petBreed.trim()) { toast.add("Name and breed are required.", "error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", petName); fd.append("age", petAge); fd.append("breed", petBreed);
      fd.append("traits", petTraits); fd.append("status", petStatus); fd.append("description", petDesc);
      if (petFile) fd.append("image", petFile);
      const res = await fetch("/api/content/pets/add", { method:"POST", body:fd });
      if (!res.ok) throw new Error();
      setPetName(""); setPetAge(""); setPetBreed(""); setPetTraits(""); setPetStatus("Available"); setPetDesc(""); setPetFile(null);
      await refreshContent();
      toast.add(`"${petName}" added to adoption profiles.`);
    } catch { toast.add("Failed to add pet.", "error"); }
    finally { setSaving(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/content/pets/${id}/adoption-status`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error();
      await refreshContent();
      toast.add(`Pet marked as ${status}.`);
    } catch { toast.add("Update failed.", "error"); }
  };

  const handleRemove = async (id, name) => {
    try {
      const res = await fetch(`/api/content/pets/${id}`, { method:"DELETE" });
      if (!res.ok) throw new Error();
      await refreshContent();
      toast.add(`"${name}" removed from profiles.`);
    } catch { toast.add("Remove failed.", "error"); }
  };

  return (
    <div className="ap-section">
      <div className="ap-section-head">
        <div><h2>Pet Profiles</h2><p>Add, manage, and track adoption status for every animal</p></div>
      </div>

      <div className="ap-2col ap-2col--wide">
        {/* Add form */}
        <div className="ap-card">
          <div className="ap-card-head"><h3><i className="fas fa-plus-circle" /> Add New Pet</h3></div>
          <div className="ap-form-grid">
            <div className="ap-field"><label>Name *</label><input value={petName} onChange={(e)=>setPetName(e.target.value)} placeholder="e.g. Husna" /></div>
            <div className="ap-field"><label>Age</label><input value={petAge} onChange={(e)=>setPetAge(e.target.value)} placeholder="e.g. ~3 yrs" /></div>
            <div className="ap-field ap-field--full"><label>Breed *</label><input value={petBreed} onChange={(e)=>setPetBreed(e.target.value)} placeholder="e.g. Indian Pariah Mix" /></div>
            <div className="ap-field"><label>Status</label>
              <select value={petStatus} onChange={(e)=>setPetStatus(e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="ap-field ap-field--full"><label>Traits <small>(comma-separated)</small></label><input value={petTraits} onChange={(e)=>setPetTraits(e.target.value)} placeholder="Gentle, Loves cuddles, Good with kids" /></div>
            <div className="ap-field ap-field--full"><label>Description</label><textarea rows={3} value={petDesc} onChange={(e)=>setPetDesc(e.target.value)} placeholder="Brief description about this pet…" /></div>
            <div className="ap-field ap-field--full"><label>Photo</label>
              <input type="file" accept="image/*" onChange={(e)=>setPetFile(e.target.files[0])} />
            </div>
          </div>
          <button className="ap-btn ap-btn--primary" onClick={handleAdd} disabled={saving}>
            {saving ? <><i className="fas fa-spinner fa-spin" /> Saving…</> : <><i className="fas fa-paw" /> Add Pet Profile</>}
          </button>
        </div>

        {/* Live pets */}
        <div className="ap-card">
          <div className="ap-card-head"><h3><i className="fas fa-list" /> Live Profiles ({activePets.length})</h3></div>
          {activePets.length === 0
            ? <div className="ap-empty-state"><i className="fas fa-paw" /><p>No active pets yet. Add one.</p></div>
            : <div className="ap-pet-list">
                {activePets.map((pet) => (
                  <div className="ap-pet-row" key={pet.id}>
                    <button className="ap-pet-img-btn" onClick={() => setLightbox({ src: pet.image, title: pet.name })}>
                      <img src={pet.image} alt={pet.name} />
                    </button>
                    <div className="ap-pet-info">
                      <strong>{pet.name}</strong>
                      <small>{pet.breed} · {pet.age}</small>
                      <span className="ap-pet-status-dot" style={{ color: STATUS_COLOR[pet.status] }}><i className="fas fa-circle" /> {pet.status}</span>
                    </div>
                    <div className="ap-pet-row-actions">
                      <select value={pet.status} onChange={(e) => setConfirm({ title:`Mark ${pet.name} as ${e.target.value}?`, message: ["Adopted","Removed"].includes(e.target.value) ? `This will remove ${pet.name} from the public homepage.` : `Status will update to ${e.target.value}.`, label:"Confirm", danger:["Adopted","Removed"].includes(e.target.value), onConfirm: () => handleStatus(pet.id, e.target.value) })}>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button className="ap-icon-btn ap-icon-btn--danger" title="Remove" onClick={() => setConfirm({ title:`Remove ${pet.name}?`, message:"This hides the pet permanently from the homepage.", label:"Remove", danger:true, onConfirm: () => handleRemove(pet.id, pet.name) })}>
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Adopted log */}
      {adoptedPets.length > 0 && (
        <div className="ap-card" style={{ marginTop:18 }}>
          <div className="ap-card-head"><h3><i className="fas fa-heart" /> Adopted Pets 🎉</h3></div>
          <div className="ap-pet-list">
            {adoptedPets.map((pet) => (
              <div className="ap-pet-row" key={pet.id}>
                <button className="ap-pet-img-btn" onClick={() => setLightbox({ src: pet.image, title: pet.name })}>
                  <img src={pet.image} alt={pet.name} />
                </button>
                <div className="ap-pet-info">
                  <strong>{pet.name}</strong>
                  <small>{pet.breed}</small>
                  <span style={{ color:"#10b981", fontSize:"0.76rem", fontWeight:700 }}><i className="fas fa-home" /> Adopted 🐾</span>
                </div>
                <button className="ap-btn ap-btn--ghost ap-btn--sm" onClick={() => handleStatus(pet.id, "Available")}>Restore</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Lightbox src={lightbox?.src} title={lightbox?.title} onClose={() => setLightbox(null)} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION: GALLERY
───────────────────────────────────────────────────────────── */
function GallerySection({ content, refreshContent, toast, setConfirm }) {
  const [file, setFile]       = useState(null);
  const [title, setTitle]     = useState("");
  const [category, setCategory] = useState("rescue");
  const [saving, setSaving]   = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const active  = (content.galleryItems || []).filter((i) => i.status !== "deleted");
  const deleted = (content.galleryItems || []).filter((i) => i.status === "deleted");

  const handleUpload = async () => {
    if (!file || !title.trim()) { toast.add("Select an image and enter a title.", "error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("image", file); fd.append("title", title); fd.append("category", category);
      const res = await fetch("/api/content/gallery/upload", { method:"POST", body:fd });
      if (!res.ok) throw new Error();
      setFile(null); setTitle("");
      await refreshContent();
      toast.add(`"${title}" added to gallery.`);
    } catch { toast.add("Upload failed.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, titleLabel) => {
    try {
      const res = await fetch(`/api/content/gallery/${id}/status`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status:"deleted" }) });
      if (!res.ok) throw new Error();
      await refreshContent();
      toast.add(`"${titleLabel}" removed from gallery.`);
    } catch { toast.add("Remove failed.", "error"); }
  };

  const handleRestore = async (id) => {
    try {
      const res = await fetch(`/api/content/gallery/${id}/status`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status:"active" }) });
      if (!res.ok) throw new Error();
      await refreshContent();
      toast.add("Gallery item restored.");
    } catch { toast.add("Restore failed.", "error"); }
  };

  return (
    <div className="ap-section">
      <div className="ap-section-head">
        <div><h2>Gallery</h2><p>Upload photos and manage what's visible on the public gallery page</p></div>
      </div>

      <div className="ap-2col ap-2col--wide">
        {/* Upload form */}
        <div className="ap-card">
          <div className="ap-card-head"><h3><i className="fas fa-cloud-upload-alt" /> Upload Photo</h3></div>
          <div className="ap-form-grid">
            <div className="ap-field ap-field--full">
              <label>Image *</label>
              <div className="ap-file-drop" onClick={() => document.getElementById("gal-file").click()}>
                {file ? <><i className="fas fa-image" /> {file.name}</> : <><i className="fas fa-cloud-upload-alt" /> Click to select image</>}
              </div>
              <input id="gal-file" type="file" accept="image/*" style={{display:"none"}} onChange={(e)=>setFile(e.target.files[0])} />
            </div>
            <div className="ap-field ap-field--full"><label>Title *</label><input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Describe this photo" /></div>
            <div className="ap-field ap-field--full"><label>Category</label>
              <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                {["rescue","shelter","feeding","awareness"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button className="ap-btn ap-btn--primary" onClick={handleUpload} disabled={saving}>
            {saving ? <><i className="fas fa-spinner fa-spin" /> Uploading…</> : <><i className="fas fa-upload" /> Upload to Gallery</>}
          </button>
        </div>

        {/* Stats */}
        <div className="ap-card">
          <div className="ap-card-head"><h3><i className="fas fa-chart-bar" /> Gallery Stats</h3></div>
          <div className="ap-stat-mini-grid">
            {["rescue","shelter","feeding","awareness"].map((cat) => {
              const count = active.filter((i) => i.category === cat).length;
              return <div key={cat} className="ap-stat-mini"><span>{cat}</span><strong>{count}</strong></div>;
            })}
          </div>
          <div className="ap-stat-mini-grid" style={{marginTop:12}}>
            <div className="ap-stat-mini"><span>Total Live</span><strong>{active.length}</strong></div>
            <div className="ap-stat-mini" style={{opacity:0.6}}><span>Deleted</span><strong>{deleted.length}</strong></div>
          </div>
        </div>
      </div>

      {/* Photo grid */}
      <div className="ap-card" style={{marginTop:18}}>
        <div className="ap-card-head"><h3><i className="fas fa-th" /> Live Photos ({active.length})</h3></div>
        {active.length === 0
          ? <div className="ap-empty-state"><i className="fas fa-images" /><p>No photos yet</p></div>
          : <div className="ap-gallery-grid">
              {active.map((item) => (
                <div className="ap-gallery-item" key={item.id || item.title}>
                  <button className="ap-gallery-img-btn" onClick={() => setLightbox({ src: item.image, title: item.title })}>
                    <img src={item.image} alt={item.title} />
                    <div className="ap-gallery-overlay"><i className="fas fa-expand-alt" /></div>
                  </button>
                  <div className="ap-gallery-item-foot">
                    <span>{item.title}</span>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span className="ap-cat-chip">{item.category}</span>
                      <button className="ap-icon-btn ap-icon-btn--danger" onClick={() => setConfirm({ title:`Remove "${item.title}"?`, message:"Removes from gallery but keeps in history.", label:"Remove", danger:true, onConfirm: () => handleDelete(item.id, item.title) })}><i className="fas fa-trash" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>

      {/* Deleted */}
      {deleted.length > 0 && (
        <div className="ap-card" style={{marginTop:18}}>
          <div className="ap-card-head"><h3><i className="fas fa-trash-restore" /> Deleted Photos ({deleted.length})</h3></div>
          <div className="ap-table-wrap"><table className="ap-table"><thead><tr><th>Title</th><th>Category</th><th></th></tr></thead>
          <tbody>{deleted.map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.category}</td><td><button className="ap-btn ap-btn--ghost ap-btn--sm" onClick={() => handleRestore(item.id)}>Restore</button></td></tr>)}</tbody>
          </table></div>
        </div>
      )}
      <Lightbox src={lightbox?.src} title={lightbox?.title} onClose={() => setLightbox(null)} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION: STORIES
───────────────────────────────────────────────────────────── */
function StoriesSection({ content, refreshContent, toast, setConfirm }) {
  const [file, setFile]         = useState(null);
  const [title, setTitle]       = useState("");
  const [excerpt, setExcerpt]   = useState("");
  const [saving, setSaving]     = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const active  = (content.stories || []).filter((s) => s.status !== "deleted");
  const deleted = (content.stories || []).filter((s) => s.status === "deleted");

  const handlePublish = async () => {
    if (!file || !title.trim() || !excerpt.trim()) { toast.add("Image, title, and excerpt are required.", "error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("image", file); fd.append("title", title); fd.append("excerpt", excerpt);
      const res = await fetch("/api/content/stories/upload", { method:"POST", body:fd });
      if (!res.ok) throw new Error();
      setFile(null); setTitle(""); setExcerpt("");
      await refreshContent();
      toast.add(`Story "${title}" published.`);
    } catch { toast.add("Publish failed.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, titleLabel) => {
    try {
      const res = await fetch(`/api/content/stories/${id}/status`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status:"deleted" }) });
      if (!res.ok) throw new Error();
      await refreshContent();
      toast.add(`"${titleLabel}" removed.`);
    } catch { toast.add("Remove failed.", "error"); }
  };

  const handleRestore = async (id) => {
    try {
      const res = await fetch(`/api/content/stories/${id}/status`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status:"active" }) });
      if (!res.ok) throw new Error();
      await refreshContent();
      toast.add("Story restored.");
    } catch { toast.add("Restore failed.", "error"); }
  };

  return (
    <div className="ap-section">
      <div className="ap-section-head">
        <div><h2>Stories</h2><p>Publish rescue and adoption stories to the public Stories page</p></div>
      </div>

      <div className="ap-2col ap-2col--wide">
        {/* Publish form */}
        <div className="ap-card">
          <div className="ap-card-head"><h3><i className="fas fa-pen-nib" /> Publish Story</h3></div>
          <div className="ap-form-grid">
            <div className="ap-field ap-field--full">
              <label>Cover Image *</label>
              <div className="ap-file-drop" onClick={() => document.getElementById("story-file").click()}>
                {file ? <><i className="fas fa-image" /> {file.name}</> : <><i className="fas fa-cloud-upload-alt" /> Click to select image</>}
              </div>
              <input id="story-file" type="file" accept="image/*" style={{display:"none"}} onChange={(e)=>setFile(e.target.files[0])} />
            </div>
            <div className="ap-field ap-field--full"><label>Story Title *</label><input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g. How Moti found a forever home" /></div>
            <div className="ap-field ap-field--full"><label>Excerpt *</label><textarea rows={4} value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} placeholder="A short summary displayed on the stories card…" /></div>
          </div>
          <button className="ap-btn ap-btn--primary" onClick={handlePublish} disabled={saving}>
            {saving ? <><i className="fas fa-spinner fa-spin" /> Publishing…</> : <><i className="fas fa-book-open" /> Publish Story</>}
          </button>
        </div>

        {/* Story cards */}
        <div className="ap-card">
          <div className="ap-card-head"><h3><i className="fas fa-list" /> Live Stories ({active.length})</h3></div>
          {active.length === 0
            ? <div className="ap-empty-state"><i className="fas fa-book-open" /><p>No stories published yet</p></div>
            : <div className="ap-story-list">
                {active.map((story) => (
                  <div className="ap-story-row" key={story.id || story.title}>
                    <button className="ap-pet-img-btn" onClick={() => setLightbox({ src: story.image, title: story.title })}>
                      <img src={story.image} alt={story.title} />
                    </button>
                    <div className="ap-pet-info">
                      <strong>{story.title}</strong>
                      <small>{story.date}</small>
                      <span style={{color:"#6b7280",fontSize:"0.78rem"}}>{story.excerpt?.slice(0,60)}…</span>
                    </div>
                    <button className="ap-icon-btn ap-icon-btn--danger" onClick={() => setConfirm({ title:`Remove story?`, message:`"${story.title}" will be hidden from the Stories page.`, label:"Remove", danger:true, onConfirm: () => handleDelete(story.id, story.title) })}>
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {deleted.length > 0 && (
        <div className="ap-card" style={{marginTop:18}}>
          <div className="ap-card-head"><h3><i className="fas fa-trash-restore" /> Deleted Stories ({deleted.length})</h3></div>
          <div className="ap-table-wrap"><table className="ap-table"><thead><tr><th>Title</th><th>Date</th><th></th></tr></thead>
          <tbody>{deleted.map((s) => <tr key={s.id}><td>{s.title}</td><td>{s.date}</td><td><button className="ap-btn ap-btn--ghost ap-btn--sm" onClick={() => handleRestore(s.id)}>Restore</button></td></tr>)}</tbody>
          </table></div>
        </div>
      )}
      <Lightbox src={lightbox?.src} title={lightbox?.title} onClose={() => setLightbox(null)} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN ADMIN PAGE SHELL
───────────────────────────────────────────────────────────── */
const NAV = [
  { id:"dashboard",   label:"Dashboard",   icon:"fas fa-chart-pie" },
  { id:"submissions", label:"Submissions", icon:"fas fa-inbox" },
  { id:"pets",        label:"Pets",        icon:"fas fa-paw" },
  { id:"gallery",     label:"Gallery",     icon:"fas fa-images" },
  { id:"stories",     label:"Stories",     icon:"fas fa-book-open" },
];

export default function AdminPage() {
  const { content, submissions, refreshSubmissions, refreshContent } = useSiteContent();
  const [section, setSection]   = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [confirm, setConfirm]   = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const toast = useToast();

  /* auto-refresh every 30s */
  useEffect(() => {
    const id = setInterval(async () => {
      await Promise.all([refreshSubmissions(), refreshContent()]);
      setLastSync(new Date());
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const handleRefresh = async () => {
    await Promise.all([refreshSubmissions(), refreshContent()]);
    setLastSync(new Date());
    toast.add("Dashboard refreshed.");
  };

  const pending = submissions.filter((s) => !s.confirmed && s.status === "active").length;

  const sectionProps = { content, submissions, refreshSubmissions, refreshContent, toast, setConfirm };

  return (
    <div className="ap-shell">
      {/* ── Sidebar ── */}
      <aside className={`ap-sidebar${sideOpen ? " ap-sidebar--open" : ""}`}>
        <div className="ap-sidebar-brand">
          <div className="ap-sidebar-logo"><i className="fas fa-dove" /></div>
          <div>
            <strong>Wings &amp; Tails</strong>
            <span>Admin Panel</span>
          </div>
          <button className="ap-sidebar-close" onClick={() => setSideOpen(false)}><i className="fas fa-times" /></button>
        </div>

        <nav className="ap-nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`ap-nav-item${section === n.id ? " ap-nav-item--active" : ""}`}
              onClick={() => { setSection(n.id); setSideOpen(false); }}
              type="button"
            >
              <i className={n.icon} />
              <span>{n.label}</span>
              {n.id === "submissions" && pending > 0 && (
                <span className="ap-nav-badge">{pending}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="ap-sidebar-footer">
          <a href="/" className="ap-nav-item" target="_blank" rel="noreferrer">
            <i className="fas fa-external-link-alt" />
            <span>View Website</span>
          </a>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sideOpen && <div className="ap-overlay" onClick={() => setSideOpen(false)} />}

      {/* ── Main ── */}
      <div className="ap-main">
        {/* Topbar */}
        <header className="ap-topbar">
          <button className="ap-hamburger" onClick={() => setSideOpen(true)} aria-label="Open menu">
            <i className="fas fa-bars" />
          </button>
          <div className="ap-topbar-title">
            {NAV.find((n) => n.id === section)?.label || "Dashboard"}
          </div>
          <div className="ap-topbar-right">
            {lastSync && <span className="ap-sync-time"><i className="fas fa-circle ap-sync-dot" /> {lastSync.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })}</span>}
            <button className="ap-btn ap-btn--ghost ap-btn--sm" onClick={handleRefresh}>
              <i className="fas fa-sync-alt" /> Refresh
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="ap-content">
          {section === "dashboard"   && <DashboardSection   {...sectionProps} setSection={setSection} />}
          {section === "submissions" && <SubmissionsSection {...sectionProps} />}
          {section === "pets"        && <PetsSection        {...sectionProps} />}
          {section === "gallery"     && <GallerySection     {...sectionProps} />}
          {section === "stories"     && <StoriesSection     {...sectionProps} />}
        </div>
      </div>

      {/* Modals */}
      <ConfirmDialog config={confirm} onClose={() => setConfirm(null)} />
      <Toast toasts={toast.toasts} remove={toast.remove} />
    </div>
  );
}
