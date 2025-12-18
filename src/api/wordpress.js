// api/wordpress.js
import axios from 'axios';

export const wordpressAPI = {
    async getPosts(lang = 'en') {
        // Для WPML
        const response = await axios.get(
            `https://your-wordpress-site.com/wp-json/wp/v2/posts?lang=${lang}`
        );

        // Для WPGraphQL
        const graphqlQuery = {
            query: `
        query GetPosts($language: LanguageCodeFilterEnum!) {
          posts(where: { language: $language }) {
            nodes {
              title
              content
              language {
                code
                name
              }
            }
          }
        }
      `,
            variables: { language: lang.toUpperCase() }
        };

        return response.data;
    },

    async getTranslations(lang) {
        // Можно использовать:
        // 1. Отдельный endpoint для переводов
        // 2. WordPress Options API
        // 3. Файлы переводов (JSON)
        const response = await axios.get(
            `https://your-wordpress-site.com/wp-json/your-plugin/v1/translations/${lang}`
        );
        return response.data;
    }
};