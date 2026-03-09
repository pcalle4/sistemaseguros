import { CreateQuoteUseCase } from '../../application/use-cases/create-quote';
import { GetCoveragesUseCase } from '../../application/use-cases/get-coverages';
import { GetInsuranceTypesUseCase } from '../../application/use-cases/get-insurance-types';
import { GetLocationsUseCase } from '../../application/use-cases/get-locations';
import { IssuePolicyUseCase } from '../../application/use-cases/issue-policy';
import { LoginUseCase } from '../../application/use-cases/login';
import { apiClient } from '../http/axios-client';
import { AuthApiRepository } from '../repositories/auth-api.repository';
import { CatalogsApiRepository } from '../repositories/catalogs-api.repository';
import { PoliciesApiRepository } from '../repositories/policies-api.repository';
import { QuotesApiRepository } from '../repositories/quotes-api.repository';

const catalogsRepository = new CatalogsApiRepository(apiClient);
const quotesRepository = new QuotesApiRepository(apiClient);
const policiesRepository = new PoliciesApiRepository(apiClient);
const authRepository = new AuthApiRepository(apiClient);

export const services = {
  getInsuranceTypes: new GetInsuranceTypesUseCase(catalogsRepository),
  getCoverages: new GetCoveragesUseCase(catalogsRepository),
  getLocations: new GetLocationsUseCase(catalogsRepository),
  createQuote: new CreateQuoteUseCase(quotesRepository),
  login: new LoginUseCase(authRepository),
  issuePolicy: new IssuePolicyUseCase(policiesRepository),
};
