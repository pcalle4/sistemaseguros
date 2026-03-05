import { Injectable } from '@nestjs/common';
import { CatalogItem, CatalogsRepository } from '../../domain/ports/catalogs.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaCatalogsRepository implements CatalogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listInsuranceTypes(): Promise<CatalogItem[]> {
    return this.prisma.insuranceType.findMany({
      select: { code: true, name: true },
      orderBy: { code: 'asc' },
    });
  }

  async listCoveragesByInsuranceType(insuranceTypeCode: string): Promise<CatalogItem[]> {
    return this.prisma.coverage.findMany({
      where: { insuranceTypeCode },
      select: { code: true, name: true },
      orderBy: { code: 'asc' },
    });
  }

  async listLocations(): Promise<CatalogItem[]> {
    return this.prisma.location.findMany({
      select: { code: true, name: true },
      orderBy: { code: 'asc' },
    });
  }

  async existsInsuranceType(code: string): Promise<boolean> {
    const total = await this.prisma.insuranceType.count({ where: { code } });
    return total > 0;
  }

  async existsCoverageForInsuranceType(insuranceTypeCode: string, coverageCode: string): Promise<boolean> {
    const total = await this.prisma.coverage.count({
      where: {
        insuranceTypeCode,
        code: coverageCode,
      },
    });

    return total > 0;
  }

  async existsLocation(code: string): Promise<boolean> {
    const total = await this.prisma.location.count({ where: { code } });
    return total > 0;
  }
}
