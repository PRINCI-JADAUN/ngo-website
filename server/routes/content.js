import express from "express";
import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import Content from "../models/Content.js";
import { defaultSiteContent } from "../../src/data/siteData.js";

const router = express.Router();
const uploadsDirectory = path.resolve("public/uploads");

fs.mkdirSync(uploadsDirectory, { recursive: true });

function ensureManagedCollection(items, type) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => ({
    id: item.id || `${type}-${index}-${crypto.randomUUID()}`,
    status: item.status || "active",
    createdAt: item.createdAt || item.uploadedAt || new Date().toISOString(),
    deletedAt: item.deletedAt || null,
    ...item,
  }));
}

function normalizeContentData(data) {
  // Always sync services, quickActions, coreActivities, team, sponsorship, org
  // from siteData defaults — these are not user-editable via admin panel
  // so they should always reflect the latest siteData.js values.
  return {
    ...data,
    // Static content — always use latest from siteData
    services:       defaultSiteContent.services,
    quickActions:   defaultSiteContent.quickActions,
    coreActivities: defaultSiteContent.coreActivities,
    team:           defaultSiteContent.team,
    sponsorship:    defaultSiteContent.sponsorship,
    org:            defaultSiteContent.org,
    mission:        defaultSiteContent.mission,
    vision:         defaultSiteContent.vision,
    missionImage:   defaultSiteContent.missionImage,
    visionImage:    defaultSiteContent.visionImage,
    about:          defaultSiteContent.about,
    heroSlides:     defaultSiteContent.heroSlides,
    stats:          defaultSiteContent.stats,
    forms:          defaultSiteContent.forms,
    galleryCategories: defaultSiteContent.galleryCategories,
    // Dynamic collections — managed via admin panel, keep DB version
    galleryItems: ensureManagedCollection(data.galleryItems, "gallery"),
    stories:      ensureManagedCollection(data.stories,      "story"),
    pets:         ensureManagedCollection(data.pets || [],    "pet"),
  };
}

async function getContentDocument() {
  let content = await Content.findOne();

  if (!content) {
    content = await Content.create({ data: normalizeContentData(defaultSiteContent) });
    return content;
  }

  const normalizedData = normalizeContentData(content.data || {});
  const currentData = JSON.stringify(content.data || {});
  const nextData = JSON.stringify(normalizedData);

  if (currentData !== nextData) {
    content.data = normalizedData;
    content.markModified("data");
    await content.save();
  }

  return content;
}

// Configure multer for file uploads
const upload = multer({
  dest: uploadsDirectory,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.get("/", async (req, res) => {
  try {
    const content = await getContentDocument();

    res.json(content.data);
  } catch (error) {
    console.error("Error loading content:", error);
    res.status(500).json({ error: "Unable to load site content." });
  }
});

// Force-reset all static content from siteData defaults (keeps gallery/stories/pets)
router.post("/reset-static", async (req, res) => {
  try {
    const content = await getContentDocument();
    content.data = normalizeContentData(content.data || {});
    content.markModified("data");
    await content.save();
    res.json({ success: true, message: "Static content reset from siteData defaults." });
  } catch (error) {
    console.error("Error resetting static content:", error);
    res.status(500).json({ error: "Unable to reset static content." });
  }
});

// HARD RESET — wipes entire MongoDB content document and re-seeds from siteData
// This makes everyone see the same clean state as siteData.js
router.post("/hard-reset", async (req, res) => {
  try {
    await Content.deleteMany({});
    const fresh = await Content.create({ data: normalizeContentData(defaultSiteContent) });
    res.json({ success: true, message: "Full reset complete. Database re-seeded from siteData.", data: fresh.data });
  } catch (error) {
    console.error("Hard reset failed:", error);
    res.status(500).json({ error: "Hard reset failed." });
  }
});

router.put("/", async (req, res) => {
  try {
    const normalizedPayload = normalizeContentData(req.body || {});
    const updated = await Content.findOneAndUpdate(
      {},
      { data: normalizedPayload },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(updated.data);
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ error: "Unable to update site content." });
  }
});

router.post("/gallery/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: "Title and category are required." });
    }

    const content = await getContentDocument();

    const newGalleryItem = {
      id: crypto.randomUUID(),
      image: `/uploads/${req.file.filename}`,
      category,
      title,
      status: "active",
      createdAt: new Date().toISOString(),
      deletedAt: null,
    };

    if (!content.data.galleryItems) {
      content.data.galleryItems = [];
    }
    content.data.galleryItems.unshift(newGalleryItem);
    content.markModified("data");

    await content.save();

    res.json({ success: true, item: newGalleryItem });
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    res.status(500).json({ error: "Unable to upload gallery image." });
  }
});

router.post("/stories/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const { title, excerpt, date } = req.body;
    if (!title || !excerpt) {
      return res.status(400).json({ error: "Title and excerpt are required." });
    }

    const content = await getContentDocument();

    const newStory = {
      id: crypto.randomUUID(),
      image: `/uploads/${req.file.filename}`,
      title,
      excerpt,
      date: date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "active",
      createdAt: new Date().toISOString(),
      deletedAt: null,
    };

    if (!content.data.stories) {
      content.data.stories = [];
    }
    content.data.stories.unshift(newStory);
    content.markModified("data");

    await content.save();

    res.json({ success: true, story: newStory });
  } catch (error) {
    console.error("Error uploading story:", error);
    res.status(500).json({ error: "Unable to upload story." });
  }
});

router.delete("/deleted/history", async (req, res) => {
  try {
    const content = await getContentDocument();
    const galleryItems = content.data.galleryItems || [];
    const stories = content.data.stories || [];

    const deletedGalleryCount = galleryItems.filter((item) => item.status === "deleted").length;
    const deletedStoriesCount = stories.filter((item) => item.status === "deleted").length;

    content.data.galleryItems = galleryItems.filter((item) => item.status !== "deleted");
    content.data.stories = stories.filter((item) => item.status !== "deleted");
    content.markModified("data");
    await content.save();

    res.json({
      message: "Deleted content history cleared.",
      deletedGalleryCount,
      deletedStoriesCount,
    });
  } catch (error) {
    console.error("Error clearing deleted content history:", error);
    res.status(500).json({ error: "Unable to clear deleted content history." });
  }
});

// ── Pet management routes ──────────────────────────────────

router.post("/pets/add", upload.single("image"), async (req, res) => {
  try {
    const { name, age, breed, traits, status, description } = req.body;
    if (!name || !breed) {
      return res.status(400).json({ error: "Name and breed are required." });
    }
    const content = await getContentDocument();
    if (!content.data.pets) content.data.pets = [];

    const newPet = {
      id: crypto.randomUUID(),
      name,
      age: age || "Unknown",
      breed,
      traits: traits ? (Array.isArray(traits) ? traits : traits.split(",").map((t) => t.trim())) : [],
      status: status || "Available",
      description: description || "",
      image: req.file ? `/uploads/${req.file.filename}` : "/images/ngo/dog-portrait.jpg",
      petStatus: "active",
      createdAt: new Date().toISOString(),
      deletedAt: null,
    };

    content.data.pets.unshift(newPet);
    content.markModified("data");
    await content.save();
    res.json({ success: true, pet: newPet });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ error: "Unable to add pet." });
  }
});

router.patch("/pets/:id/adoption-status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Available | Foster | Medical | Adopted | Removed
    const content = await getContentDocument();
    const pet = (content.data.pets || []).find((p) => p.id === id);
    if (!pet) return res.status(404).json({ error: "Pet not found." });

    pet.status = status;
    if (status === "Adopted" || status === "Removed") {
      pet.petStatus = "deleted";
      pet.deletedAt = new Date().toISOString();
    } else {
      pet.petStatus = "active";
      pet.deletedAt = null;
    }
    content.markModified("data");
    await content.save();
    res.json({ success: true, pet });
  } catch (error) {
    console.error("Error updating pet status:", error);
    res.status(500).json({ error: "Unable to update pet status." });
  }
});

router.delete("/pets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const content = await getContentDocument();
    const pet = (content.data.pets || []).find((p) => p.id === id);
    if (!pet) return res.status(404).json({ error: "Pet not found." });
    pet.petStatus = "deleted";
    pet.deletedAt = new Date().toISOString();
    content.markModified("data");
    await content.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing pet:", error);
    res.status(500).json({ error: "Unable to remove pet." });
  }
});

router.patch("/:section/:id/status", async (req, res) => {
  try {
    const { section, id } = req.params;
    const { status } = req.body;
    const collectionKey = section === "gallery" ? "galleryItems" : section === "stories" ? "stories" : section === "pets" ? "pets" : null;

    if (!collectionKey) {
      return res.status(400).json({ error: "Invalid content section." });
    }

    if (!["active", "deleted"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const content = await getContentDocument();
    const targetItem = content.data[collectionKey]?.find((item) => item.id === id);

    if (!targetItem) {
      return res.status(404).json({ error: "Content item not found." });
    }

    if (collectionKey === "pets") {
      targetItem.petStatus = status;
    } else {
      targetItem.status = status;
    }
    targetItem.deletedAt = status === "deleted" ? new Date().toISOString() : null;
    content.markModified("data");
    await content.save();

    res.json({ success: true, item: targetItem });
  } catch (error) {
    console.error("Error updating content item status:", error);
    res.status(500).json({ error: "Unable to update content item status." });
  }
});

export default router;
