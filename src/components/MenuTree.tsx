import { Link } from "react-router-dom";
const MenuTree = ({ items, level = 0}) => {
  if (!items) return null;

  // Функция для определения правильного пути по slug и типу объекта
  const getItemPath = (item) => {
    // Если slug содержит полный URL, извлекаем pathname
    if (item.slug && item.slug.includes('http')) {
      return new URL(item.slug).pathname;
    }

    // Определяем путь по типу объекта WordPress
    if (item.object === 'post' && item.type === 'post') {
      return `/promotion/${item.slug}`;
    }
    if (item.object === 'doctors') {
      return `/doctors/${item.slug}`;
    }
    if (item.object === 'services') {
      return `/services/${item.slug}`;
    }

    // Для страниц и других типов используем slug напрямую или pathname из URL
    if (item.url) {
      try {
        return new URL(item.url).pathname;
      } catch {
        return item.slug || '/';
      }
    }

    return item.slug || '/';
  };

 return (
    <>
      {items.map((item, index) => (
        <div className="space-y-2" key={item.ID || `menu-item-${index}`}>
            <Link
                to={getItemPath(item)}
                className={
                level > 0
                    ? "block select-none rounded-md p-3 text-base leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    : "block font-medium text-lg text-foreground hover:text-primary transition-colors py-2"
                }
            >
                {item.title}
            </Link>

            {item.child_items?.length > 0 && (
                <div className="ml-4">
                    <MenuTree items={item.child_items} level={level + 1} />
                </div>
            )}
        </div>
      ))}
    </>
  );
};

export default MenuTree;

