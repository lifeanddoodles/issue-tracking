import mongoose from "mongoose";
import { IProjectDocument } from "../../shared/interfaces/index.js";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
    },
    description: {
      type: String,
    },
    company: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Company",
      required: true,
      validate: {
        validator: function (value: string | mongoose.Types.ObjectId) {
          // Check if value is either a string or an ObjectId
          if (value === null) return true;
          return (
            typeof value === "string" ||
            value instanceof mongoose.Types.ObjectId
          );
        },
        message: "Company must be either a string or an ObjectId",
      },
    },
    services: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Service",
    },
    team: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    tickets: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Ticket",
    },
  },
  { timestamps: true }
);

projectSchema.pre("validate", async function (next) {
  // Get the company ID associated with this project
  const projectId = this._id;
  const project = (await mongoose
    .model("Project")
    .findById(projectId)
    .populate("company")
    .select("employees")) as IProjectDocument & {
    company: { employees: mongoose.Types.ObjectId[] };
  };

  if (!project) {
    return next();
  }

  // Check if each team member is an employee of the same company
  for (const memberId of this.team) {
    if (!project.company.employees.includes(memberId)) {
      this.invalidate(
        "team",
        "Team members must be employees of the same company."
      );
      throw Error("Team members must be employees of the same company.");
    }
  }

  next();
});

export default mongoose.model<IProjectDocument>("Project", projectSchema);
