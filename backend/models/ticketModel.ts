import mongoose from "mongoose";
import { ITicketDocument } from "../../shared/interfaces/index.js";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    attachments: {
      type: [String],
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
      validate: {
        validator: function (value: string | mongoose.Types.ObjectId) {
          // Check if value is either a string or an ObjectId
          return (
            typeof value === "string" ||
            value instanceof mongoose.Types.ObjectId
          );
        },
        message: "Assignee must be either a string or an ObjectId",
      },
    },
    reporter: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
      validate: {
        validator: function (value: string | mongoose.Types.ObjectId) {
          // Check if value is either a string or an ObjectId
          return (
            typeof value === "string" ||
            value instanceof mongoose.Types.ObjectId
          );
        },
        message: "Reporter must be either a string or an ObjectId",
      },
    },
    externalReporter: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
      validate: {
        validator: function (value: string | mongoose.Types.ObjectId) {
          // Check if value is either a string or an ObjectId
          return (
            typeof value === "string" ||
            value instanceof mongoose.Types.ObjectId
          );
        },
        message: "External reporter must be either a string or an ObjectId",
      },
    },
    status: {
      type: String,
      default: "OPEN",
      enum: ["OPEN", "IN_PROGRESS", "CLOSED"],
      required: true,
    },
    priority: {
      type: String,
      default: "MEDIUM",
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },
    assignToTeam: {
      type: String,
      enum: ["DEVELOPMENT", "QUALITY_ASSURANCE", "PRODUCT", "CUSTOMER_SUCCESS"],
    },
    ticketType: {
      type: String,
      default: "ISSUE",
      enum: ["ISSUE", "BUG", "FEATURE_REQUEST", "FOLLOW_UP"],
    },
    estimatedTime: {
      type: Number,
    },
    deadline: {
      type: Date,
    },
    isSubtask: {
      type: Boolean,
      default: false,
    },
    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  { timestamps: true }
);

ticketSchema.statics.aggregateTicketsWithProjectsAndServices = async function (
  query,
  options = {}
) {
  const { sort, skip, limit } = options;
  const pipeline = [];

  const projectLookup = [
    {
      $lookup: {
        from: "projects",
        let: { ticketId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$$ticketId", "$tickets"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              company: 1,
            },
          },
        ],
        as: "projectInfo",
      },
    },
    {
      $unwind: { path: "$projectInfo", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "companies",
        let: { companyId: "$projectInfo.company" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$companyId"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "projectInfo.company",
      },
    },
    {
      $unwind: {
        path: "$projectInfo.company",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "projectInfo.company._id",
        foreignField: "company",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
            },
          },
        ],
        as: "projectInfo.company.employees",
      },
    },
    {
      $addFields: {
        projectInfo: {
          $cond: {
            if: { $eq: ["$projectInfo", {}] },
            then: "$$REMOVE",
            else: "$projectInfo",
          },
        },
      },
    },
  ];

  const serviceLookup = [
    {
      $lookup: {
        from: "services",
        let: { ticketId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$$ticketId", "$tickets"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: "$name",
            },
          },
        ],
        as: "serviceInfo",
      },
    },
    {
      $unwind: {
        path: "$serviceInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  pipeline.push(...projectLookup);
  pipeline.push(...serviceLookup);

  if (query) {
    pipeline.push({
      $match: query,
    });
  }

  if (sort) {
    pipeline.push({ $sort: sort });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  if (skip !== undefined) {
    pipeline.push({ $skip: skip });
  }

  if (limit !== undefined) {
    pipeline.push({ $limit: limit });
  }

  return this.aggregate(pipeline);
};

export default mongoose.model<ITicketDocument>("Ticket", ticketSchema);
