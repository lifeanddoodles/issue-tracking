import { NextFunction, Request, Response } from "express";
import { Model, PopulateOptions, Query } from "mongoose";
import { FormattedResultsProps } from "../../shared/interfaces";

const createQueryString = (reqQuery: any) => {
  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  return JSON.parse(queryStr);
};

const getSortOption = (sort?: string) => {
  if (!sort) return { createdAt: -1 };

  return sort
    .split(",")
    .reduce((acc: Record<string, number>, sortField: string) => {
      const [field, order] = sortField.split(":");
      acc[field as string] = order === "desc" ? -1 : 1;
      return acc;
    }, {});
};

const getPaginationOptions = (page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  return { startIndex, limit };
};

const formatResults =
  <T>(
    model: Model<T>,
    populate?: (string | PopulateOptions)[],
    options?: { staticsFnName?: string; replaceFind?: boolean }
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let query;

    const page = parseInt(req.query.page as string, 10) || 1;
    let limit = parseInt(req.query.limit as string, 10);
    let startIndex;
    if (limit) {
      const { startIndex: startIndexVal, limit: limitVal } =
        getPaginationOptions(page, limit);
      startIndex = startIndexVal;
      limit = limitVal;
    }

    // Copy req.query
    const reqQuery = { ...req.query };
    // Create query string
    const queryStr = createQueryString(reqQuery);

    // Finding resource
    if (!options) {
      query = model.find(queryStr);
    }

    // Select Fields
    if (req.query.select && query instanceof Query) {
      const fields = (req.query.select as string).split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    let sort;

    if (req.query.sort && query instanceof Query) {
      const sortBy = (req.query.sort as string).split(",").join(" ");
      query = query.sort(sortBy);
    } else if (query instanceof Query) {
      query = query.sort("-createdAt");
    } else {
      sort = getSortOption(req.query.sort as string);
    }

    // Pagination
    const total = await model.countDocuments(queryStr);

    if (query instanceof Query && startIndex && limit) {
      query = query.skip(startIndex).limit(limit);
    } else if (options?.staticsFnName && options.replaceFind) {
      console.log("----------\n", startIndex, "\n----------\n");
      const paginationOptions =
        startIndex !== undefined && limit ? { skip: startIndex, limit } : {};
      query = (model as Model<T> & { [key: string]: any })[
        options.staticsFnName
      ](queryStr, { sort, ...paginationOptions });
    }

    // Populate
    if (populate) {
      if (query instanceof Query) {
        query = query.populate(populate);
      } else {
        query = model.populate(await query, populate as PopulateOptions[]);
      }
    }

    // Executing query
    const results = await query;

    // Pagination result
    const pagination: Record<string, unknown> = {};

    if (startIndex && limit) {
      if (startIndex + limit < total) {
        pagination.next = {
          page: page + 1,
          limit,
        };
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit,
        };
      }
    }

    (
      res as Response & { formattedResults: FormattedResultsProps }
    ).formattedResults = {
      success: true,
      count: total,
      ...(pagination ? { pagination } : {}),
      data: results,
    };

    next();
  };

export default formatResults;
