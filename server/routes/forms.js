import express from "express";
import { body, validationResult } from "express-validator";
import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import Submission from "../models/Submission.js";
import { sendSubmissionEmail } from "../utils/email.js";

const router = express.Router();
const uploadsDirectory = path.resolve("public/uploads");

fs.mkdirSync(uploadsDirectory, { recursive: true });

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

const validators = {
  contact: [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").trim().isEmail().withMessage("Valid email is required."),
    body("phone").optional({ checkFalsy: true }).trim(),
    body("subject").optional({ checkFalsy: true }).trim(),
    body("message").trim().notEmpty().withMessage("Message is required."),
  ],
  volunteer: [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").trim().isEmail().withMessage("Valid email is required."),
    body("phone").trim().notEmpty().withMessage("Phone is required."),
    body("age").isInt({ min: 18 }).withMessage("Must be at least 18 years old."),
    body("experience").trim().notEmpty().withMessage("Experience is required."),
    body("interest").trim().notEmpty().withMessage("Interest area is required."),
    body("availability").trim().notEmpty().withMessage("Availability is required."),
  ],
  donation: [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").trim().isEmail().withMessage("Valid email is required."),
    body("phone").trim().notEmpty().withMessage("Phone is required."),
    body("donationType").trim().notEmpty().withMessage("Donation type is required."),
    body("amount").trim().notEmpty().withMessage("Amount is required."),
  ],
  sponsor: [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").trim().isEmail().withMessage("Valid email is required."),
    body("phone").trim().notEmpty().withMessage("Phone is required."),
    body("dogName").trim().notEmpty().withMessage("Dog selection is required."),
    body("commitment").trim().notEmpty().withMessage("Commitment details are required."),
    body("message").trim().notEmpty().withMessage("Message is required."),
  ],
  adoption: [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").trim().isEmail().withMessage("Valid email is required."),
    body("phone").trim().notEmpty().withMessage("Phone is required."),
    body("address").trim().notEmpty().withMessage("Address is required."),
    body("occupation").trim().notEmpty().withMessage("Occupation is required."),
    body("familySize").isInt({ min: 1 }).withMessage("Family size is required."),
    body("experience").trim().notEmpty().withMessage("Pet experience is required."),
    body("reason").trim().notEmpty().withMessage("Reason for adoption is required."),
  ],
};

router.post("/:type", upload.single("photo"), async (req, res) => {
  const { type } = req.params;
  const typeValidators = validators[type];

  if (!typeValidators) {
    return res.status(400).json({ error: "Invalid form type." });
  }

  await Promise.all(typeValidators.map((validator) => validator.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const values = req.body;
    const confirmationToken = crypto.randomBytes(24).toString("hex");

    const submissionData = {
      type,
      values,
      confirmationToken,
    };

    if (req.file) {
      submissionData.image = `/uploads/${req.file.filename}`;
    }

    const submission = await Submission.create(submissionData);
    await sendSubmissionEmail(submission);

    res.json(submission);
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ error: "Unable to save submission." });
  }
});

router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.confirmed === "true") {
      query.confirmed = true;
    }
    if (req.query.status === "active") {
      query.$or = [{ status: "active" }, { status: { $exists: false } }];
    } else if (req.query.status) {
      query.status = req.query.status;
    }

    const submissions = await Submission.find(query).sort({ createdAt: -1 });

    const needsBackfill = submissions.some((submission) => !submission.status);
    if (needsBackfill) {
      await Promise.all(
        submissions
          .filter((submission) => !submission.status)
          .map((submission) => {
            submission.status = "active";
            return submission.save();
          }),
      );
    }

    res.json(submissions);
  } catch (error) {
    console.error("Error loading submissions:", error);
    res.status(500).json({ error: "Unable to load submissions." });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Submission.deleteMany({});
    res.json({ message: "All submissions cleared." });
  } catch (error) {
    console.error("Error clearing submissions:", error);
    res.status(500).json({ error: "Unable to clear submissions." });
  }
});

router.delete("/deleted/history", async (req, res) => {
  try {
    const result = await Submission.deleteMany({ status: "deleted" });
    res.json({ message: "Deleted form history cleared.", deletedCount: result.deletedCount || 0 });
  } catch (error) {
    console.error("Error clearing deleted form history:", error);
    res.status(500).json({ error: "Unable to clear deleted form history." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found." });
    }

    submission.status = "deleted";
    submission.deletedAt = new Date();
    await submission.save();

    res.json({ message: "Submission deleted.", submission });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ error: "Unable to delete submission." });
  }
});

router.post("/confirm/:id", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found." });
    }

    if (submission.confirmed) {
      return res.json({ message: "Submission already confirmed." });
    }

    submission.confirmed = true;
    submission.status = "active";
    submission.rejectedAt = undefined;
    await submission.save();

    res.json({ message: "Submission confirmed." });
  } catch (error) {
    console.error("Error confirming submission:", error);
    res.status(500).json({ error: "Unable to confirm submission." });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "rejected", "deleted"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found." });
    }

    submission.status = status;

    if (status === "deleted") {
      submission.deletedAt = new Date();
    } else if (!submission.deletedAt || status === "active") {
      submission.deletedAt = undefined;
    }

    if (status === "rejected") {
      submission.rejectedAt = new Date();
      submission.confirmed = false;
    } else if (status === "active") {
      submission.rejectedAt = undefined;
    }

    await submission.save();

    res.json({ message: `Submission marked as ${status}.`, submission });
  } catch (error) {
    console.error("Error updating submission status:", error);
    res.status(500).json({ error: "Unable to update submission status." });
  }
});

router.get("/confirm/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;
    const submission = await Submission.findById(id);

    if (!submission || submission.confirmationToken !== token) {
      return res.status(404).send(`
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; padding: 2rem;">
            <h1>Confirmation failed</h1>
            <p>The confirmation link is invalid or has already expired.</p>
          </body>
        </html>
      `);
    }

    if (submission.confirmed) {
      return res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; padding: 2rem;">
            <h1>Already confirmed</h1>
            <p>We already received your confirmation. Thank you.</p>
          </body>
        </html>
      `);
    }

    submission.confirmed = true;
    await submission.save();

    res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; color: #333; padding: 2rem;">
          <h1>Request confirmed</h1>
          <p>Your request has been confirmed successfully. Thank you for taking this step.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error confirming submission:", error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; color: #333; padding: 2rem;">
          <h1>Confirmation error</h1>
          <p>An error occurred while confirming your request.</p>
        </body>
      </html>
    `);
  }
});



export default router;
