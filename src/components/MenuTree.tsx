import { Link } from "react-router-dom";
const MenuTree = ({ items, level = 0}) => {
  if (!items) return null;

 return (
    <>
      {items.map((item, index) => (
        <div className="" key={item.ID || `menu-item-${index}`}>
            
            <Link
                to={item.url}
                className={
                level > 0
                    ? "block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    : "block font-bold text-base text-primary transition-colors"
                }
            >
                {item.title}
            </Link>

            {item.child_items?.length > 0 && (
                <MenuTree items={item.child_items} level={level + 1} />
            )}
           
        </div>
      ))}
    </>
  );
};

export default MenuTree;

