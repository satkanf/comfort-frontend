import { Heart, Award, Users, Clock } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Про нашу клініку</h2>
          <p className="text-muted-foreground text-lg">
            Comfort Clinic — це сучасний медичний центр, де поєднуються передові технології та індивідуальний підхід до кожного пацієнта
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Турбота про пацієнтів</h3>
            <p className="text-muted-foreground">Індивідуальний підхід та увага до кожної деталі</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Досвідчені фахівці</h3>
            <p className="text-muted-foreground">Команда професіоналів з багаторічним досвідом</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Понад 10 000 пацієнтів</h3>
            <p className="text-muted-foreground">Довіра тисяч задоволених клієнтів</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Зручний графік</h3>
            <p className="text-muted-foreground">Працюємо без вихідних для вашого комфорту</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Наша місія</h3>
              <p className="text-muted-foreground mb-4">
                Ми прагнемо зробити якісну медичну допомогу доступною для кожного. Наша команда працює з найсучаснішим обладнанням та використовує передові методики лікування.
              </p>
              <p className="text-muted-foreground">
                В Comfort Clinic ми віримо, що здоров'я — це найцінніший скарб, тому докладаємо всіх зусиль, щоб забезпечити найвищий рівень медичного обслуговування.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Наші цінності</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Професіоналізм та постійний розвиток</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Сучасне обладнання та інноваційні технології</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Індивідуальний підхід до кожного пацієнта</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Прозорість та чесність у всьому</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
