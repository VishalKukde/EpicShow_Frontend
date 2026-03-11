interface CategoryHeroProps {
  title: string;
  subtitle: string;
}

export default function CategoryHero({ title, subtitle }: CategoryHeroProps) {
  return (
    <section className="bg-background px-6 pb-16 pt-28 text-center">
      <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4">
        {title}
      </h1>
      <p className="text-gray-500 max-w-xl mx-auto">
        {subtitle}
      </p>
    </section>
  );
}
