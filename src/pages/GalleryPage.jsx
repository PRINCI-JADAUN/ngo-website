import { useState } from "react";
import PageBanner from "../components/PageBanner";
import { useSiteContent } from "../context/SiteContentContext";

function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox] = useState(null); // { image, title }
  const { content } = useSiteContent();

  const filteredItems =
    activeCategory === "all"
      ? content.galleryItems.filter((item) => item.status !== "deleted")
      : content.galleryItems.filter(
          (item) => item.category === activeCategory && item.status !== "deleted"
        );

  return (
    <>
      <PageBanner title="Gallery" />

      <div id="portfolio" className="gallery">
        <div className="container">

          {/* Filter bar */}
          <div className="row">
            <div className="gallery-filter">
              {content.galleryCategories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  className={`btn btn-default filter-button ${
                    activeCategory === category.value ? "active-gallery-filter" : ""
                  }`}
                  onClick={() => setActiveCategory(category.value)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Count badge */}
          <div className="gallery-count-row">
            <span className="gallery-count-badge">
              <i className="fas fa-images" /> {filteredItems.length} photo{filteredItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Grid */}
          {filteredItems.length === 0 ? (
            <div className="gallery-empty">
              <i className="fas fa-camera" />
              <p>No photos in this category yet.</p>
            </div>
          ) : (
            <div className="row gallery-grid">
              {filteredItems.map((item, idx) => (
                <div
                  className="gallery_product col-lg-3 col-md-4 col-sm-6 col-xs-6"
                  key={item.id || item.title + idx}
                >
                  <div
                    className="gallery-card gallery-card--clickable"
                    onClick={() => setLightbox({ image: item.image, title: item.title })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setLightbox({ image: item.image, title: item.title })}
                    aria-label={`View ${item.title}`}
                  >
                    <img src={item.image} className="img-responsive" alt={item.title} />
                    <div className="gallery-overlay">
                      <i className="fas fa-expand-alt" />
                    </div>
                    <div className="gallery-caption">
                      <strong>{item.title}</strong>
                      <span className="gallery-cat-tag">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
        >
          <div className="gallery-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="gallery-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <i className="fas fa-times" />
            </button>
            <img src={lightbox.image} alt={lightbox.title} />
            <p className="gallery-lightbox-caption">{lightbox.title}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default GalleryPage;
