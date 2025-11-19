import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "5 порад для здорового серця",
    excerpt: "Кардіолог розповідає про найважливіші правила профілактики серцево-судинних захворювань",
    author: "Дмитро Петренко",
    date: "15 березня 2024",
    category: "Кардіологія",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Догляд за шкірою в різні пори року",
    excerpt: "Експертні рекомендації дерматолога щодо сезонного догляду за обличчям",
    author: "Марія Сидоренко",
    date: "10 березня 2024",
    category: "Дерматологія",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Важливість профілактичних обстежень",
    excerpt: "Чому регулярні медичні огляди можуть врятувати ваше життя",
    author: "Олена Коваленко",
    date: "5 березня 2024",
    category: "Профілактика",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Сучасні методи косметології",
    excerpt: "Огляд найефективніших процедур для омолодження шкіри",
    author: "Марія Сидоренко",
    date: "1 березня 2024",
    category: "Косметологія",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Реабілітація після травм",
    excerpt: "Поради хірурга щодо швидкого та ефективного відновлення",
    author: "Андрій Іваненко",
    date: "25 лютого 2024",
    category: "Хірургія",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Як підготуватися до планової операції",
    excerpt: "Детальний гайд від досвідченого хірурга",
    author: "Андрій Іваненко",
    date: "20 лютого 2024",
    category: "Хірургія",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=400&fit=crop",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4">Блог</h1>
              <p className="text-muted-foreground text-lg">
                Корисні статті про здоров'я від наших фахівців
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge>{post.category}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
