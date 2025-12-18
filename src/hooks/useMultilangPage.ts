// hooks/useMultilangPage.ts
import { useMultilangData } from './useMultilangData';

export const useMultilangPage = (slug: string = 'golovna') => {
    return useMultilangData({ slug });
};


