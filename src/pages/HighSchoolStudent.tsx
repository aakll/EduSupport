import CategoryLanding from "../components/CategoryLanding.tsx";

export default function HighSchoolStudent() {
  return (
    <CategoryLanding
      tableName="high_school_students"
      heroImage="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920"
      heroTitle="Welcome"
      heroSubtitle="Discover scholarships for high school students in Lebanon!"
      gradientFrom="from-[#4CAF50]"
      gradientTo="to-[#42A5F5]"
      iconColor="text-[#4CAF50]"
      ctaLabel="Explore Scholarships"
      ctaPath="/scholarships"
      selfPath="/high-school"
    />
  );
}