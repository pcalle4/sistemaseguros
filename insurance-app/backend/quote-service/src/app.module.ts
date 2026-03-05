import { Module } from '@nestjs/common';
import { CreateQuoteUseCase } from './application/use-cases/create-quote.usecase';
import { GetQuoteUseCase } from './application/use-cases/get-quote.usecase';
import { ListCoveragesUseCase } from './application/use-cases/list-coverages.usecase';
import { ListInsuranceTypesUseCase } from './application/use-cases/list-insurance-types.usecase';
import { ListLocationsUseCase } from './application/use-cases/list-locations.usecase';
import { CatalogsValidatorService } from './application/services/catalogs-validator.service';
import { PremiumCalculatorService } from './application/services/premium-calculator.service';
import { CLOCK } from './domain/ports/clock';
import { CATALOGS_REPOSITORY } from './domain/ports/catalogs.repository';
import { QUOTES_REPOSITORY } from './domain/ports/quotes.repository';
import { UUID_GENERATOR } from './domain/ports/uuid.generator';
import { SystemClock } from './infrastructure/adapters/clock/system.clock';
import { UuidGeneratorAdapter } from './infrastructure/adapters/uuid/uuid.generator';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { PrismaCatalogsRepository } from './infrastructure/repositories/prisma-catalogs.repository';
import { PrismaQuotesRepository } from './infrastructure/repositories/prisma-quotes.repository';
import { CatalogsController } from './presentation/controllers/catalogs.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { QuotesController } from './presentation/controllers/quotes.controller';
import { AppLogger } from './shared/logging/logger';

@Module({
  imports: [PrismaModule],
  controllers: [CatalogsController, QuotesController, HealthController],
  providers: [
    AppLogger,
    PremiumCalculatorService,
    CatalogsValidatorService,
    ListInsuranceTypesUseCase,
    ListCoveragesUseCase,
    ListLocationsUseCase,
    CreateQuoteUseCase,
    GetQuoteUseCase,
    {
      provide: CATALOGS_REPOSITORY,
      useClass: PrismaCatalogsRepository,
    },
    {
      provide: QUOTES_REPOSITORY,
      useClass: PrismaQuotesRepository,
    },
    {
      provide: UUID_GENERATOR,
      useClass: UuidGeneratorAdapter,
    },
    {
      provide: CLOCK,
      useClass: SystemClock,
    },
  ],
})
export class AppModule {}
