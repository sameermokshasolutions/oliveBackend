// import { Request, Response, NextFunction } from 'express';
// // import { CompanyType } from '../models/CompanyType';
// import createHttpError from 'http-errors';
// import CompanyType from '../models/CompanyType';
// // import { CompanyType } from '../models/attribute.model';

// export const getAllCompanyTypes = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const companyTypes = await CompanyType.find();
//     res.status(200).json({
//       success: true,
//       message: 'Company type fetched successfully',
//       data: companyTypes
//     });
//   } catch (error) {
//     next(createHttpError(500, 'Something went wrong'));
//   }
// };

// export const getCompanyTypeById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const companyType = await CompanyType.findById(req.params.id);
//     if (!companyType) {
//       next(createHttpError(404, 'Company type not found'));
//     }
    
//     res.status(200).json({
//       success: true,
//       message: 'Company type by id fethed successfully',
//       data: companyType
//     });
//   } catch (error) {
//     next(createHttpError(500, 'Error while fetching company type by ID'));
//   }
// };

// export const createCompanyType = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { name } = req.body;
    
//     if (!name) {
//       next(createHttpError(400, 'Name is required'));
//     }
    
//     const companyType = await CompanyType.create({ name });
    
//     res.status(201).json({
//       success: true,
//       message: 'Company type created successfully',
//       data: companyType
//     });
//   } catch (error) {
//     // Handle duplicate key error
//     // if (error.code === 11000) {
//       return next(createHttpError(400, 'Company type with this name already exists'));
//     // }
//     // next(error);
//   }
// };

// export const updateCompanyType = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { name } = req.body;
    
//     if (!name) {
//       next(createHttpError(400, 'Name is required'));
//     }
    
//     const companyType = await CompanyType.findByIdAndUpdate(
//       req.params.id,
//       { name },
//       { new: true, runValidators: true }
//     );
    
//     if (!companyType) {
//       next(createHttpError(404, 'Company type not found'));
//     }
    
//     res.status(200).json({
//       success: true,
//       message: 'Company type updated successfully',
//       data: companyType
//     });
//   } catch (error) {
//     // Handle duplicate key error
//     // if (error.code === 11000) {
//       return next(createHttpError(400, 'Company type with this name already exists'));
//     // }
//     // next(error);
//   }
// };

// export const deleteCompanyType = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const companyType = await CompanyType.findByIdAndDelete(req.params.id);
    
//     if (!companyType) {
//       next(createHttpError(404, 'Company type not found'));
//     }
    
//     res.status(200).json({
//       success: true,
//       message: 'Company type deleted successfully'
//     });
//   } catch (error) {
//     next(createHttpError(500, 'Error while deleting company type'));
//   }
// };

import { Request, Response, NextFunction } from "express";
import CompanyType from "../models/CompanyType";
import createHttpError from "http-errors";

export const getAllCompanyTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyTypes = await CompanyType.find({ isDeleted: false });
    res.status(200).json({
      success: true,
      message: "Company types fetched successfully",
      data: companyTypes,
    });
  } catch (error) {
    next(createHttpError(500, "Something went wrong"));
  }
};

export const getCompanyTypeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyType = await CompanyType.findOne({ _id: req.params.id, isDeleted: false });
    if (!companyType) {
      return next(createHttpError(404, "Company type not found"));
    }
    res.status(200).json({
      success: true,
      message: "Company type fetched successfully",
      data: companyType,
    });
  } catch (error) {
    next(createHttpError(500, "Error while fetching company type by ID"));
  }
};

export const createCompanyType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(createHttpError(400, "Name is required"));
    }
    const existingCompanyType = await CompanyType.findOne({ name });
    if (existingCompanyType) {
      if (existingCompanyType.isDeleted) {
        existingCompanyType.isDeleted = false;
        await existingCompanyType.save();
        res.status(200).json({
          success: true,
          message: "Company type restored successfully",
          data: existingCompanyType,
        });
      }
      return next(createHttpError(400, "Company type with this name already exists"));
    }
    const companyType = await CompanyType.create({ name });
    res.status(201).json({
      success: true,
      message: "Company type created successfully",
      data: companyType,
    });
  } catch (error) {
    next(createHttpError(500, "Error while creating company type"));
  }
};

export const updateCompanyType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(createHttpError(400, "Name is required"));
    }
    const companyType = await CompanyType.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name },
      { new: true, runValidators: true }
    );
    if (!companyType) {
      return next(createHttpError(404, "Company type not found"));
    }
    res.status(200).json({
      success: true,
      message: "Company type updated successfully",
      data: companyType,
    });
  } catch (error) {
    next(createHttpError(500, "Error while updating company type"));
  }
};

export const deleteCompanyType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyType = await CompanyType.findById(req.params.id);
    if (!companyType) {
      return next(createHttpError(404, "Company type not found"));
    }
    companyType.isDeleted = true;
    await companyType.save();
    res.status(200).json({
      success: true,
      message: "Company type soft deleted successfully",
    });
  } catch (error) {
    next(createHttpError(500, "Error while soft deleting company type"));
  }
};
