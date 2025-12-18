import {useMultilangData} from "@/hooks/useMultilangData.ts";

export const useMultilangBlock = (blockType: string, slug: string = 'golovna') => {
    return useMultilangData({ slug, blockType });
};

// hooks/useMultilangServices.ts (обновленная версия)
export const useMultilangServices = (slug: string = 'golovna') => {
    const result = useMultilangData({
        slug,
        blockType: 'about_services',
        acfField: 'services'
    });

    return {
        services: result.data || [],
        loading: result.loading,
        error: result.error,
        blockData: result.blockData
    };
};
// export default  useMultilangBlock;