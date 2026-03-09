import { useCallback, useEffect, useState } from 'react';
import { normalizeApiError } from '../../core/utils/error-mapper';
import type { CatalogItem } from '../../domain/entities/catalog';
import { services } from '../../infrastructure/container/services';
import { useUiStore } from '../store/ui.store';

export function useCatalogs() {
  const setGlobalError = useUiStore((state) => state.setGlobalError);
  const clearGlobalError = useUiStore((state) => state.clearGlobalError);
  const [insuranceTypes, setInsuranceTypes] = useState<CatalogItem[]>([]);
  const [locations, setLocations] = useState<CatalogItem[]>([]);
  const [coverages, setCoverages] = useState<CatalogItem[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingCoverages, setIsLoadingCoverages] = useState(false);
  const [catalogsError, setCatalogsError] = useState<string | null>(null);
  const [coveragesError, setCoveragesError] = useState<string | null>(null);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState('');

  const loadInitialCatalogs = useCallback(async () => {
    setIsLoadingInitial(true);
    setCatalogsError(null);
    clearGlobalError();

    try {
      const [insuranceTypesResponse, locationsResponse] = await Promise.all([
        services.getInsuranceTypes.execute(),
        services.getLocations.execute(),
      ]);

      setInsuranceTypes(insuranceTypesResponse.items);
      setLocations(locationsResponse.items);
    } catch (error) {
      const mappedError = normalizeApiError(error);
      setCatalogsError(mappedError.message);
      setGlobalError(mappedError.message);
    } finally {
      setIsLoadingInitial(false);
    }
  }, [clearGlobalError, setGlobalError]);

  const loadCoverages = useCallback(
    async (insuranceType: string) => {
      setSelectedInsuranceType(insuranceType);

      if (!insuranceType) {
        setCoverages([]);
        setCoveragesError(null);
        return;
      }

      setIsLoadingCoverages(true);
      setCoveragesError(null);

      try {
        const response = await services.getCoverages.execute(insuranceType);
        setCoverages(response.items);
      } catch (error) {
        const mappedError = normalizeApiError(error);
        setCoverages([]);
        setCoveragesError(mappedError.message);
      } finally {
        setIsLoadingCoverages(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadInitialCatalogs();
  }, [loadInitialCatalogs]);

  return {
    insuranceTypes,
    locations,
    coverages,
    isLoadingInitial,
    isLoadingCoverages,
    catalogsError,
    coveragesError,
    selectedInsuranceType,
    loadInitialCatalogs,
    loadCoverages,
  };
}
