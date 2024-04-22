import bcrypt from "bcrypt";
import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import {
  ICommentDocument,
  ICompanyDocument,
  IProjectDocument,
  IServiceDocument,
  ITicketDocument,
  IUserDocument,
} from "./interfaces/index.ts";

// Load env vars
dotenv.config();

// Load models
import Comment from "./models/commentModel.ts";
import Company from "./models/companyModel.ts";
import Project from "./models/projectModel.ts";
import Service from "./models/serviceModel.ts";
import Ticket from "./models/ticketModel.ts";
import User from "./models/userModel.ts";
// import Notification from "./models/notificationModel.ts";

// Connect to DB
mongoose.connect(process.env.MONGO_DB_URI as string);

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/backend/_data/users.json`, "utf-8")
);
const services = JSON.parse(
  fs.readFileSync(`${__dirname}/backend/_data/services.json`, "utf-8")
);
const companies = JSON.parse(
  fs.readFileSync(`${__dirname}/backend/_data/companies.json`, "utf-8")
);
const projects = JSON.parse(
  fs.readFileSync(`${__dirname}/backend/_data/projects.json`, "utf-8")
);
const tickets = JSON.parse(
  fs.readFileSync(`${__dirname}/backend/_data/tickets.json`, "utf-8")
);
const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/backend/_data/comments.json`, "utf-8")
);
// TODO: Load notifications
// const notifications = JSON.parse(
//   fs.readFileSync(`${__dirname}/backend/_data/notifications.json`, "utf-8")
// );

async function getUsersWithHashedPassword() {
  return Promise.all(
    (users as IUserDocument[]).map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = bcrypt.hash(user.password as string, salt);
      return {
        ...user,
        password: hashedPassword,
      };
    })
  );
}

async function addEmployeesToCompanies(users: IUserDocument[]) {
  return Promise.all(
    users.map(async (user) => {
      const emailSplit = user.email.split("@");
      const domainName = emailSplit[1];

      await Company.updateOne(
        { url: { $regex: new RegExp(domainName as string, "i") } },
        { $push: { employees: user._id } }
      );
    })
  );
}

async function addCompanyToUsers(companies: ICompanyDocument[]) {
  return companies.forEach(async (company) => {
    const urlSplit = (company.url as string).split("://");
    const domainName = urlSplit[1] as string;

    await User.updateMany(
      { email: { $regex: new RegExp(domainName, "i") } },
      { $set: { company: company._id } }
    );
  });
}

async function addProjectsToCompanies(
  projects: IProjectDocument[],
  companies: ICompanyDocument[]
) {
  return Promise.all(
    projects.map(async (project) => {
      return companies.forEach(async (company) => {
        const emailSplit = (company.email as string).split("@");
        const domainName = emailSplit[1];

        if ((project.url as string).includes(domainName as string)) {
          await Project.updateOne(
            { _id: project._id },
            {
              $set: {
                company: company._id,
              },
            }
          );
          await Company.updateOne(
            { _id: company._id },
            {
              $push: {
                projects: project._id,
              },
            }
          );
        }
      });
    })
  );
}

async function addServicesToProjects(
  services: IServiceDocument[],
  projects: IProjectDocument[]
) {
  return Promise.all(
    projects.map(async (project) => {
      const projectDescription = project.description as string;

      return services.forEach(async (service) => {
        const serviceTextToRemove = `- ${service.name}`;
        const serviceDescription = service.description as string;

        if (projectDescription.includes(serviceTextToRemove)) {
          await Project.updateOne(
            { _id: project._id },
            {
              $push: { services: service._id },
              $set: {
                description: serviceDescription
                  .replace(serviceTextToRemove, "")
                  .trim(),
              },
            }
          );
        }
      });
    })
  );
}

async function addTicketsToProjects(
  projects: IProjectDocument[],
  tickets: ITicketDocument[]
) {
  return Promise.all(
    projects.map(async (project) => {
      const projectTextToRemove = `Project: ${project.name}`;

      await Promise.all(
        tickets.map(async (ticket) => {
          if (ticket.description.includes(projectTextToRemove)) {
            await Project.updateOne(
              { _id: project._id },
              {
                $push: { tickets: ticket._id },
              }
            );
            await Ticket.updateOne(
              { _id: ticket._id },
              {
                $set: {
                  description: ticket.description
                    .replace(`\n${projectTextToRemove}`, "")
                    .trim(),
                },
              }
            );
          }
        })
      );
    })
  );
}

// TODO: add team members to projects

async function addTicketsToServices(
  services: IServiceDocument[],
  tickets: ITicketDocument[]
) {
  return Promise.all(
    services.map(async (service) => {
      const serviceTextToRemove = `Service: ${service.name}`;

      await Promise.all(
        tickets.map(async (ticket) => {
          if (ticket.description.includes(serviceTextToRemove)) {
            await Service.updateOne(
              { _id: service._id },
              {
                $push: { tickets: ticket._id },
              }
            );
            await Ticket.updateOne(
              { _id: ticket._id },
              {
                $set: {
                  description: ticket.description
                    .replace(`\n${serviceTextToRemove}`, "")
                    .trim(),
                },
              }
            );
          }
        })
      );
    })
  );
}

async function addCommentsToTickets(
  tickets: ITicketDocument[],
  comments: ICommentDocument[]
) {
  return Promise.all(
    tickets.map(async (ticket) => {
      const ticketTitleRegex = RegExp(ticket.title, "i");

      return comments.forEach(async (comment) => {
        if (ticketTitleRegex.test(comment.message)) {
          await Comment.updateOne(
            { _id: comment._id },
            {
              $set: {
                ticketId: ticket._id,
                message: comment.message.replace(ticket.title, "").trim(),
              },
            }
          );
        }
      });
    })
  );
}

async function addUsersToComments(
  users: IUserDocument[],
  comments: ICommentDocument[]
) {
  return Promise.all(
    users.map(async (user) => {
      const fullName = `${user.firstName} ${user.lastName}`;

      return comments.forEach(async () => {
        await Comment.updateMany(
          { author: { $eq: fullName } },
          { $set: { author: user._id } }
        );
      });
    })
  );
}

async function addUserIdToTicketProperty(key: string, users: IUserDocument[]) {
  return Promise.all(
    users.map(async (user) => {
      const fullName = `${user.firstName} ${user.lastName}`;

      await Ticket.updateMany(
        { [key]: { $eq: fullName } },
        { $set: { [key]: user._id } }
      );
    })
  );
}

// Import into DB
const importData = async () => {
  try {
    const usersWithHashedPassword = await getUsersWithHashedPassword();
    const createdUsers = await User.create(usersWithHashedPassword);
    const createdServices = await Service.create(services);
    await Company.create(companies);
    const createdProjects = await Project.create(projects);
    const createdTickets = await Ticket.create(tickets, {
      validateBeforeSave: false,
    });
    const createdComments = await Comment.create(comments, {
      validateBeforeSave: false,
    });
    // TODO: Add notifications
    // await Notification.create(notifications);

    await addEmployeesToCompanies(createdUsers);
    const companiesWithEmployees = await Company.find();

    await addCompanyToUsers(companiesWithEmployees);
    const usersWithCompany = await User.find();

    await addProjectsToCompanies(
      createdProjects as unknown as IProjectDocument[],
      companiesWithEmployees
    );
    const projectsWithCompanies = await Project.find();

    await addServicesToProjects(
      createdServices as unknown as IServiceDocument[],
      projectsWithCompanies
    );
    const projectsWithServices = await Project.find();

    await addTicketsToProjects(projectsWithServices, createdTickets);
    const ticketsWithProjects = await Ticket.find();

    await addTicketsToServices(
      createdServices as unknown as IServiceDocument[],
      ticketsWithProjects
    );
    await addCommentsToTickets(ticketsWithProjects, createdComments);
    await addUsersToComments(usersWithCompany, createdComments);

    await addUserIdToTicketProperty("assignee", usersWithCompany);
    await addUserIdToTicketProperty("reporter", usersWithCompany);
    await addUserIdToTicketProperty("externalReporter", usersWithCompany);

    console.log("Data imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Service.deleteMany();
    await Company.deleteMany();
    await Project.deleteMany();
    await Ticket.deleteMany();
    await Comment.deleteMany();
    // TODO: Delete notifications
    // await Notification.deleteMany();

    console.log("Data destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
