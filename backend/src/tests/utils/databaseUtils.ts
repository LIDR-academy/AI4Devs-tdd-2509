/**
 * Database Test Utilities
 * Helper functions for database setup, cleanup, and test isolation
 */

import { PrismaClient } from '@prisma/client';

export class DatabaseTestUtils {
  private static prisma: PrismaClient;

  /**
   * Initialize test database connection
   */
  static async setup(): Promise<PrismaClient> {
    if (!this.prisma) {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5433/lti_test'
          }
        }
      });
      await this.prisma.$connect();
    }
    return this.prisma;
  }

  /**
   * Clean up all test data from database
   */
  static async cleanup(): Promise<void> {
    if (this.prisma) {
      // Delete in correct order due to foreign key constraints
      await this.prisma.resume.deleteMany({});
      await this.prisma.workExperience.deleteMany({});
      await this.prisma.education.deleteMany({});
      await this.prisma.candidate.deleteMany({});
    }
  }

  /**
   * Close database connection
   */
  static async teardown(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
  }

  /**
   * Get Prisma client instance
   */
  static getPrismaClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Create test candidate in database
   */
  static async createTestCandidate(candidateData: any) {
    const prisma = this.getPrismaClient();
    return await prisma.candidate.create({
      data: {
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
        phone: candidateData.phone,
        address: candidateData.address,
        educations: candidateData.educations ? {
          create: candidateData.educations.map((edu: any) => ({
            institution: edu.institution,
            title: edu.title,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null
          }))
        } : undefined,
        workExperiences: candidateData.workExperiences ? {
          create: candidateData.workExperiences.map((exp: any) => ({
            company: exp.company,
            position: exp.position,
            description: exp.description,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null
          }))
        } : undefined,
        resumes: candidateData.cv ? {
          create: [{
            filePath: candidateData.cv.filePath,
            fileType: candidateData.cv.fileType,
            uploadDate: new Date()
          }]
        } : undefined
      },
      include: {
        educations: true,
        workExperiences: true,
        resumes: true
      }
    });
  }

  /**
   * Delete test candidate by email
   */
  static async deleteTestCandidateByEmail(email: string): Promise<void> {
    const prisma = this.getPrismaClient();
    const candidate = await prisma.candidate.findUnique({
      where: { email }
    });
    
    if (candidate) {
      await prisma.resume.deleteMany({
        where: { candidateId: candidate.id }
      });
      await prisma.workExperience.deleteMany({
        where: { candidateId: candidate.id }
      });
      await prisma.education.deleteMany({
        where: { candidateId: candidate.id }
      });
      await prisma.candidate.delete({
        where: { id: candidate.id }
      });
    }
  }

  /**
   * Check if candidate exists by email
   */
  static async candidateExists(email: string): Promise<boolean> {
    const prisma = this.getPrismaClient();
    const candidate = await prisma.candidate.findUnique({
      where: { email }
    });
    return !!candidate;
  }

  /**
   * Get candidate by email with all relations
   */
  static async getCandidateByEmail(email: string) {
    const prisma = this.getPrismaClient();
    return await prisma.candidate.findUnique({
      where: { email },
      include: {
        educations: true,
        workExperiences: true,
        resumes: true
      }
    });
  }

  /**
   * Execute in transaction for test isolation
   */
  static async executeInTransaction<T>(
    operation: (prisma: PrismaClient) => Promise<T>
  ): Promise<T> {
    const prisma = this.getPrismaClient();
    return await prisma.$transaction(async (tx) => {
      return await operation(tx as PrismaClient);
    });
  }
}