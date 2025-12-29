// Test hook that returns static data
export const useTestData = () => {
    const mockData = {
        acf: {
            add_block: [
                { acf_fc_layout: 'gallery', gallery_add: ['/image1.jpg', '/image2.jpg'] },
                { acf_fc_layout: 'about_services' },
                { acf_fc_layout: 'home_doctors' },
                { acf_fc_layout: 'home_form' }
            ]
        }
    };

    return {
        pageData: mockData,
        loading: false,
        error: null
    };
};

