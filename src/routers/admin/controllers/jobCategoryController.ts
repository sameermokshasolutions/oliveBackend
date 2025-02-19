// import JobCategory from "../models/JobCategory";
// import createHttpError from "http-errors";
// import { Request, Response, NextFunction } from "express";
// import EmployerProfile from "../../employer/models/EmployerProfile";
// import mongoose from "mongoose";

// interface AuthenticatedRequest extends Request {
//   user?: {
//     id: string;
//   };
// }

// export const getAllJobCategories = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // const userId = req.user?.id
//     // // fetching company type from Employer Profile
//     // const employerProfile = await EmployerProfile.find({userId}).select('company_type')
//     // console.log(employerProfile)
//     const categories = await JobCategory.find().populate({
//       path: "companyType",
//       select: "name",
//     });
//     res.status(200).json({ success: true, data: categories });
//   } catch (error) {
//     next(createHttpError(500, "Something went wrong"));
//   }
// };

// // Function to get job categories by company type
// export const getJobCategoriesByCompanyType = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       next(createHttpError(400, "Unauthorized user"));
//     }

//     const matchConditions: any = {};

//     const employerProfile = await EmployerProfile.findOne({ userId });

//     if (employerProfile && employerProfile.companyType) {
//       matchConditions.companyType = employerProfile.companyType;
//     }

//     console.log(employerProfile?.companyType);

//     const categories = await JobCategory.find(matchConditions);

//     if (!categories.length) {
//       res.status(200).json({
//         success: true,
//         message: "No job categories found for this company type",
//         data: [],
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: categories,
//     });
//   } catch (error) {
//     next(createHttpError(500, "Error fetching job categories"));
//   }
// };

// export const createJobCategory = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const companyType = req.body;
//     if (!companyType) {
//       throw createHttpError(400, "Please provide company type");
//     }

//     const newCategory = await JobCategory.create(req.body);
//     res.status(201).json({
//       success: true,
//       message: "Job category created successfully",
//       data: newCategory,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateJobCategory = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const companyType = req.body;
//     if (!companyType) {
//       throw createHttpError(400, "Please provide company type");
//     }

//     const updatedCategory = await JobCategory.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedCategory) throw createHttpError(404, "Job category not found");
//     res.status(200).json({
//       success: true,
//       message: "Job category updated successfully",
//       data: updatedCategory,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteJobCategory = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const deletedCategory = await JobCategory.findByIdAndDelete(req.params.id);
//     if (!deletedCategory) throw createHttpError(404, "Job category not found");
//     res
//       .status(200)
//       .json({ success: true, message: "Job category deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

import JobCategory from "../models/JobCategory";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import EmployerProfile from "../../employer/models/EmployerProfile";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const getAllJobCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await JobCategory.find({ isDeleted: false }).populate({
      path: "companyType",
      select: "name",
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(createHttpError(500, "Something went wrong"));
  }
};

// export const getJobCategoriesByCompanyType = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       return next(createHttpError(400, "Unauthorized user"));
//     }

//     const employerProfile = await EmployerProfile.findOne({ userId });
//     if (!employerProfile || !employerProfile.companyType) {
//         res.status(200).json({
//         success: true,
//         message: "No job categories found for this company type",
//         data: [],
//       });
//     }

//     const categories = await JobCategory.find({
//       companyType: employerProfile.companyType,
//       isDeleted: false,
//     });

//     res.status(200).json({ success: true, data: categories });
//   } catch (error) {
//     next(createHttpError(500, "Error fetching job categories"));
//   }
// };

export const getJobCategoriesByCompanyType = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(createHttpError(400, "Unauthorized user"));
    }

    // Fetch employer profile
    const employerProfile = await EmployerProfile.findOne({ userId });

    // Ensure employerProfile exists before accessing companyType
    const matchConditions: any = { isDeleted: false };

    if (employerProfile?.companyType) {
      matchConditions.companyType = employerProfile.companyType;
    }

    // Fetch job categories based on the company type
    const categories = await JobCategory.find(matchConditions);

    res.status(200).json({
      success: true,
      message: categories.length
        ? "Job categories fetched successfully"
        : "No job categories found for this company type",
      data: categories,
    });
  } catch (error) {
    next(createHttpError(500, "Error fetching job categories"));
  }
};

export const createJobCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, companyType } = req.body;
    if (!name || !companyType) {
      next(createHttpError(400, "Please provide name and company type"));
    }

    const newCategory = await JobCategory.create({ name, companyType });
    res.status(201).json({
      success: true,
      message: "Job category created successfully",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, companyType } = req.body;
    if (!name || !companyType) {
        next(createHttpError(400, "Please provide name and company type"));
    }

    const updatedCategory = await JobCategory.findByIdAndUpdate(
      req.params.id,
      { name, companyType },
      { new: true }
    );

    if (!updatedCategory) next(createHttpError(404, "Job category not found"));
    res.status(200).json({
      success: true,
      message: "Job category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJobCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedCategory = await JobCategory.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedCategory) next(createHttpError(404, "Job category not found"));
    res.status(200).json({
      success: true,
      message: "Job category soft deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};