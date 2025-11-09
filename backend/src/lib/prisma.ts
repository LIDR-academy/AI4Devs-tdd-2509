/**
 * Prisma Client Singleton Instance
 * 
 * This file exports a single instance of PrismaClient to be used across the application.
 * Using a singleton ensures optimal connection pooling and prevents multiple instances.
 * 
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */

import { PrismaClient } from '@prisma/client';

/**
 * Singleton instance of Prisma Client
 */
const prisma = new PrismaClient();

export default prisma;
