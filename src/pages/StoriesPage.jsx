import { useState } from "react";
import { NavLink } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import { useSiteContent } from "../context/SiteContentContext";

const STORY_CATEGORIES = [
  { label: "All Stories", value: "all" },
  { label: "Rescue",      value: "rescue" },
  { label: "Adoption",    value: "adoption" },
  { label: "Feeding",     value: "feeding" },
  { label: "Awareness",   value: "awareness" },
];

// Map keywords in title/excerpt to a category for filtering
function inferCategory(post) {
  if (post.category) return post.category;
  const text = `${post.title} ${post.excerpt}`.toLowerCase();
  if (text.includes("rescue") || text.includes("injur") || text.includes("trap") || text.includes("bird")) return "rescue";
  if (text.includes("adopt") || text.includes("home") || text.includes("family") || text.includes("foster")) return "adoption";
  if (text.includes("feed") || text.includes("roti") || text.includes("food") || text.includes("hunger")) return "feeding";
  return "awareness";
}

function StoriesPage() {
  const { content } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState("all");

  const allStories = content.stories.filter((post) => post.status !== "deleted");
  const filtered = activeCategory === "all"
    ? allStories
    : allStories.filter((post) => inferCategory(post) === activeCategory);

  return (
    <>
      <PageBanner title="Stories" />

      {/* Category filter */}
      <div className="stories-filter-bar">
        <div className="container">
          <div className="gallery-filter">
            {STORY_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`btn btn-default filter-button ${activeCategory === cat.value ? "active-gallery-filter" : ""}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="our-blog">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="stories-empty">
              <i className="fas fa-book-open" />
              <p>No stories in this category yet.</p>
            </div>
          ) : (
            <div className="blog-row row">
              {filtered.map((post) => (
                <div className="col-md-4 col-sm-6" key={post.title + post.date}>
                  <div className="single-blog">
                    <figure>
                      <img src={post.image} alt={post.title} />
                      <span className="story-cat-badge">{inferCategory(post)}</span>
                    </figure>
                    <div className="blog-detail">
                      <small>{content.org.name} | {post.date}</small>
                      <h4>{post.title}</h4>
                      <p>{post.excerpt}</p>
                      <div className="link">
                        <NavLink to="/contact">Get involved</NavLink>
                        <i className="fas fa-long-arrow-alt-right" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <div className="stories-cta-strip">
        <div className="container">
          <h3>Have a story to share?</h3>
          <p>If you've rescued, fostered, or adopted an animal with our help, we'd love to feature your story.</p>
          <NavLink to="/contact" className="btn btn-success">Share Your Story</NavLink>
        </div>
      </div>
    </>
  );
}

export default StoriesPage;
