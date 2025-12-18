import { Link } from "react-router-dom";
import ServicesMenu from "./ServicesMenu";
import { useEffect, useState } from "react";


export default function FooterMenu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("https://comfort.satkan.site/wp-json/menus/v1/menus/footer-menu")
      .then(res => res.json())
      .then(data => setMenu(data.items || []));
  }, []);
  return (
    <>
        {menu.map((item, index) => (
            <Link
              key={index}
              to={new URL(item.url).pathname}
              className="text-primary-foreground text-hover transition-colors"
            >
              {item.title}
            </Link>
        ))}
    </>
    
  )
}