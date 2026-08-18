import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["contact", "volunteer", "donation", "sponsor", "adoption"],
    },
    values: {
      type: Object,
      required: true,
    },
    image: {
      type: String, // Path to uploaded image
    },
    status: {
      type: String,
      enum: ["active", "rejected", "deleted"],
      default: "active",
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    rejectedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
    confirmationToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
export default Submission;
