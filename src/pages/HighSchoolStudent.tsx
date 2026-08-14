import CategoryLanding from "../components/CategoryLanding.tsx";

export default function HighSchoolStudent() {
  return (
    <CategoryLanding
      tableName="high_school_students"
      heroImage="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920"
      heroTitle="High School Hub"
      heroSubtitle="Your path to university starts here."
      // Changed from Blue gradients to Green/Black logic
      gradientFrom="from-[#16a34a]" 
      gradientTo="to-black"
      iconColor="text-[#16a34a]"
      ctaLabel="Explore Scholarships"
      ctaPath="/scholarships"
      selfPath="/high-school"
    />
  );
}