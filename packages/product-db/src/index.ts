export { prisma } from "./client.js";
export * from "../generated/prisma/models.js";
export * as PrismaTypes from "../generated/prisma/internal/prismaNamespace.js";

// Re-export commonly used types with simpler names
export type { ProductModel as Product, CategoryModel as Category } from "../generated/prisma/models.js";
