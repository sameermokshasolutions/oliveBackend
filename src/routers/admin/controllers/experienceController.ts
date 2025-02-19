// import Experience from "../models/Experience";
// import createHttpError from "http-errors";
// import { Request, Response, NextFunction } from "express";
// import mongoose from "mongoose";

// export const getAllExperience = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const sortOrder = 1;

//     const experience = await Experience.find().sort({ sort: sortOrder });
//     res.status(200).json({ success: true, data: experience });
//   } catch (error) {
//     next(error);
//   }
// };

// // export const createExperience = async (
// //   req: Request,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   try {
// //     const existingSort = await Experience.findOne({ sort: req.body.sort });
// //     if (existingSort) {
// //       throw createHttpError(409, "Sort already added");
// //     }
// //     const newExperience = await Experience.create(req.body);
// //     res.status(201).json({
// //       success: true,
// //       message: "Experience level created successfully",
// //       data: newExperience,
// //     });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// export const createExperience = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { name, sort } = req.body;

//     // Check if experience with same name already exists
//     const existingName = await Experience.findOne({ name }).session(session);
//     if (existingName) {
//       next(createHttpError(409, "Experience name already exists"));
//     }

//     // Get all experiences that need to be updated
//     const experiencesToUpdate = await Experience.find(
//       { sort: { $gte: sort } },
//       null,
//       { session }
//     ).sort({ sort: -1 }); // Sort in descending order

//     // Update sort numbers from highest to lowest to avoid conflicts
//     for (const exp of experiencesToUpdate) {
//       await Experience.findByIdAndUpdate(
//         exp._id,
//         { sort: exp.sort + 1 },
//         { session, new: true }
//       );
//     }

//     // Create new experience
//     const newExperience = new Experience({ name, sort });
//     await newExperience.save({ session });

//     await session.commitTransaction();

//     res.status(201).json({
//       success: true,
//       message: "Experience level created successfully",
//       data: newExperience,
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// export const createExperienceInBulk = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { start, end } = req.body;

//     if (start % 2 !== 0 || end % 2 !== 0) {
//       next(createHttpError(400, "Start and end must be even numbers"));
//     }

//     const lastExperience = await Experience.findOne().sort({ sort: -1 });
//     let sort = lastExperience ? lastExperience.sort + 1 : 1;

//     const experienceArray = [];

//     for (let i = start; i < end; i += 2) {
//       const name = `${i} to ${i + 2} years`;

//       const existingExperience = await Experience.findOne({
//         $or: [{ name }, { sort }],
//       });
//       if (existingExperience) {
//         throw createHttpError(
//           409,
//           `Experience with name "${name}" or sort "${sort}" already exists please enter different range.`
//         );
//       }

//       experienceArray.push({ name, sort });
//       sort += 1;
//     }
//     const data = await Experience.insertMany(experienceArray);

//     res.status(201).json({
//       success: true,
//       message: "Experience levels created successfully",
//       data,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// // export const updateExperience = async (
// //   req: Request,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   try {
// //     const updatedExperience = await Experience.findByIdAndUpdate(
// //       req.params.id,
// //       req.body,
// //       { new: true }
// //     );
// //     if (!updatedExperience)
// //       throw createHttpError(404, "Experience level not found");
// //     res.status(200).json({
// //       success: true,
// //       message: "Experience level updated successfully",
// //       data: updatedExperience,
// //     });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // export const deleteExperience = async (
// //   req: Request,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   try {
// //     const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
// //     if (!deletedExperience)
// //       throw createHttpError(404, "Experience level not found");
// //     res.status(200).json({
// //       success: true,
// //       message: "Experience level deleted successfully",
// //     });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// export const updateExperience = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { id } = req.params;
//     const { name, sort } = req.body;

//     // Find the experience to update
//     const experienceToUpdate = await Experience.findById(id).session(session);
//     if (!experienceToUpdate) {
//       throw createHttpError(404, "Experience level not found");
//     }

//     // If updating name, check if new name already exists
//     if (name && name !== experienceToUpdate.name) {
//       const existingName = await Experience.findOne({ name }).session(session);
//       if (existingName) {
//         throw createHttpError(409, "Experience name already exists");
//       }
//     }

//     // If sort number is being updated
//     if (sort && sort !== experienceToUpdate.sort) {
//       // Get all experiences that need to be updated
//       if (sort > experienceToUpdate.sort) {
//         // Moving to a higher sort number
//         // Decrease sort numbers for experiences between old and new position
//         await Experience.updateMany(
//           {
//             _id: { $ne: id },
//             sort: { $gt: experienceToUpdate.sort, $lte: sort }
//           },
//           { $inc: { sort: -1 } },
//           { session }
//         );
//       } else {
//         // Moving to a lower sort number
//         // Increase sort numbers for experiences between new and old position
//         await Experience.updateMany(
//           {
//             _id: { $ne: id },
//             sort: { $gte: sort, $lt: experienceToUpdate.sort }
//           },
//           { $inc: { sort: 1 } },
//           { session }
//         );
//       }
//     }

//     // Update the experience
//     const updatedExperience = await Experience.findByIdAndUpdate(
//       id,
//       { name, sort },
//       { new: true, session }
//     );

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: "Experience level updated successfully",
//       data: updatedExperience,
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// export const deleteExperience = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { id } = req.params;

//     // Find the experience to delete
//     const experienceToDelete = await Experience.findById(id).session(session);
//     if (!experienceToDelete) {
//       throw createHttpError(404, "Experience level not found");
//     }

//     // Delete the experience
//     await Experience.findByIdAndDelete(id, { session });

//     // Update sort numbers for remaining experiences
//     await Experience.updateMany(
//       { sort: { $gt: experienceToDelete.sort } },
//       { $inc: { sort: -1 } },
//       { session }
//     );

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: "Experience level deleted successfully",
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// /*
// const addExperienceLevel = async (name, sortOrder) => {
//   // Shift existing sortOrders if necessary
//   await ExperienceLevel.updateMany(
//     { sortOrder: { $gte: sortOrder } },
//     { $inc: { sortOrder: 1 } }
//   );

//   const newLevel = new ExperienceLevel({ name, sortOrder });
//   await newLevel.save();
// };

// const deleteExperienceLevel = async (id) => {
//   const level = await ExperienceLevel.findById(id);
//   await ExperienceLevel.deleteOne({ _id: id });

//   // Shift remaining sortOrders
//   await ExperienceLevel.updateMany(
//     { sortOrder: { $gt: level.sortOrder } },
//     { $inc: { sortOrder: -1 } }
//   );
// };
// */
import Experience from "../models/Experience";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// Get all experiences
export const getAllExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const experiences = await Experience.find().sort({ sort: 1 });
    res.status(200).json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    return next(createHttpError(500, "Failed to fetch experiences"));
  }
};

// Create single experience
export const createExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, sort } = req.body;

    // Check if name exists
    const existingName = await Experience.findOne({ name }).session(session);
    if (existingName) {
      return next(createHttpError(409, "Experience name already exists"));
    }

    // Get all experiences with a lock for update
    const experiences = await Experience.find()
      .sort({ sort: 1 })
      .session(session);

    // Find the appropriate position for the new sort number
    const targetSort =
      parseInt(sort) > experiences.length + 1
        ? experiences.length + 1
        : parseInt(sort);

    // Instead of updating each document individually, use updateMany with a filter
    await Experience.updateMany(
      { sort: { $gte: targetSort } },
      { $inc: { sort: 1 } },
      { session }
    );

    // Create new experience
    const newExperience = new Experience({
      name,
      sort: targetSort,
    });
    await newExperience.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Experience level created successfully",
      data: newExperience,
    });
  } catch (error) {
    await session.abortTransaction();
    return next(createHttpError(500, "Failed to create experience"));
  } finally {
    session.endSession();
  }
};

// Create bulk experiences
export const createExperienceInBulk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { start, end } = req.body;
    if (start % 2 !== 0 || end % 2 !== 0) {
      return next(createHttpError(400, "Start and end must be even numbers"));
    }

    const existingExperiences = await Experience.find()
      .sort({ sort: 1 })
      .session(session);

    const experienceArray = [];
    let nextSort = existingExperiences.length + 1;

    for (let i = start; i < end; i += 2) {
      const name = `${i} to ${i + 2} years`;

      const existingName = await Experience.findOne({ name }).session(session);
      if (existingName) {
        return next(
          createHttpError(409, `Experience with name "${name}" already exists`)
        );
      }

      experienceArray.push({
        name,
        sort: nextSort++,
      });
    }

    const data = await Experience.insertMany(experienceArray, { session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Experience levels created successfully",
      data,
    });
  } catch (error) {
    await session.abortTransaction();
    return next(createHttpError(500, "Failed to create bulk experiences"));
  } finally {
    session.endSession();
  }
};

// Update experience
export const updateExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { name, sort } = req.body;

    const experienceToUpdate = await Experience.findById(id).session(session);
    if (!experienceToUpdate) {
      return next(createHttpError(404, "Experience level not found"));
    }

    if (name && name !== experienceToUpdate.name) {
      const existingName = await Experience.findOne({ name }).session(session);
      if (existingName) {
        return next(createHttpError(409, "Experience name already exists"));
      }
    }

    if (sort && sort !== experienceToUpdate.sort) {
      const newSort = parseInt(sort);
      const experiences = await Experience.find()
        .sort({ sort: 1 })
        .session(session);

      if (newSort > experienceToUpdate.sort) {
        for (const exp of experiences) {
          if (exp.sort > experienceToUpdate.sort && exp.sort <= newSort) {
            await Experience.findByIdAndUpdate(
              exp._id,
              { $inc: { sort: -1 } },
              { session }
            );
          }
        }
      } else {
        for (const exp of experiences) {
          if (exp.sort >= newSort && exp.sort < experienceToUpdate.sort) {
            await Experience.findByIdAndUpdate(
              exp._id,
              { $inc: { sort: 1 } },
              { session }
            );
          }
        }
      }
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      { name, sort },
      { new: true, session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Experience level updated successfully",
      data: updatedExperience,
    });
  } catch (error) {
    await session.abortTransaction();
    return next(createHttpError(500, "Failed to update experience"));
  } finally {
    session.endSession();
  }
};

// Delete experience
export const deleteExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const experienceToDelete = await Experience.findById(id).session(session);
    if (!experienceToDelete) {
      return next(createHttpError(404, "Experience level not found"));
    }

    await Experience.findByIdAndDelete(id, { session });

    await Experience.updateMany(
      { sort: { $gt: experienceToDelete.sort } },
      { $inc: { sort: -1 } },
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Experience level deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    return next(createHttpError(500, "Failed to delete experience"));
  } finally {
    session.endSession();
  }
};
