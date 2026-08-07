import CategoryLanding from "../components/CategoryLanding";

export default function UniversityStudent() {
  return (
    <CategoryLanding
      tableName="university_students"
      heroImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920"
      heroTitle="Welcome"
      heroSubtitle="Discover scholarships and opportunities for university students in Lebanon!"
      gradientFrom="from-[#42A5F5]"
      gradientTo="to-indigo-500"
      iconColor="text-[#42A5F5]"
      ctaLabel="Explore Scholarships"
      ctaPath="/scholarships"
      selfPath="/university"
    />
  );
}