export const DEMOGRAPHICS_COMPLETED_STORAGE_KEY = 'demographics-completed';

export const hasCompletedDemographics = (): boolean => {
    return localStorage.getItem(DEMOGRAPHICS_COMPLETED_STORAGE_KEY) === 'true';
};

export const markDemographicsCompleted = (): void => {
    localStorage.setItem(DEMOGRAPHICS_COMPLETED_STORAGE_KEY, 'true');
};