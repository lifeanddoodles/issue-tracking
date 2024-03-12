import mongoose from "mongoose";
import {
  ICompanyDocument,
  Tier,
  UserRole,
} from "../../shared/interfaces/index.js";
import {
  idIsInIdsArray,
  isAlreadyListedAsEmployeeInACompany,
} from "../utils/index.ts";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      validate: {
        validator: function (value: string) {
          const urlRegex =
            /^(https?:\/\/)?(www\.)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
          return urlRegex.test(value);
        },
      },
    },
    subscriptionStatus: {
      type: String,
      default: "TRIAL",
      enum: [
        "TRIAL",
        "ONBOARDING",
        "ACTIVE",
        "PENDING_DOWNGRADE",
        "DOWNGRADING",
        "PENDING_UPGRADE",
        "UPGRADING",
        "PENDING_RENEWAL",
        "PENDING_CANCELLATION",
        "CANCELLED",
        "CHURNED",
      ],
    },
    tier: {
      type: String,
      enum: [Tier.FREE, Tier.PRO, Tier.ENTERPRISE],
      default: Tier.FREE,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zip: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    employees: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    projects: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Project",
    },
    dba: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    industry: {
      type: String,
      enum: [
        "HEALTHCARE",
        "EDUCATION",
        "FINANCE",
        "E_COMMERCE",
        "MANUFACTURING",
        "HOSPITALITY",
      ],
    },
    assignedRepresentative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function (value: string, doc: ICompanyDocument) {
          if (doc.tier === Tier.FREE) {
            return false;
          }
          return mongoose.Types.ObjectId.isValid(value);
        },
      },
    },
  },
  { timestamps: true }
);

companySchema.pre("findOneAndUpdate", async function (next) {
  try {
    // Access the query object to get the ID of the document being updated
    const companyId = this.getQuery()._id;
    const authUser = this.getOptions().user;
    const employeeId = this.getOptions().employeeId;
    const authUserId = authUser?._id.toString();
    const isAdmin = authUser?.role === UserRole.ADMIN;

    if (employeeId) {
      const newEmployeeId = employeeId;

      // Find company
      const company = await mongoose
        .model("Company")
        .findById(companyId)
        .select("employees");

      // Handle company not found
      if (!company) {
        throw new Error("Company not found");
      }

      const authUserIsEmployee = idIsInIdsArray(company.employees, authUserId);

      // Handle authenticated user not authorized for request
      if (!isAdmin && !authUserIsEmployee) {
        throw new Error("Not Authorized");
      }

      // Handle if request is not authorized because new employee
      // is listed as an employee of an existing company
      const alreadyListedAsEmployeeInACompany =
        await isAlreadyListedAsEmployeeInACompany(newEmployeeId);

      if (alreadyListedAsEmployeeInACompany) {
        throw new Error(
          "Not Authorized. Employee already listed as employee of an existing company."
        );
      }
    }

    // If authorized, proceed with the update
    next();
  } catch (error: unknown) {
    throw new Error((error as Error).message); // Pass any errors to the next middleware
  }
});

export default mongoose.model<ICompanyDocument>("Company", companySchema);
