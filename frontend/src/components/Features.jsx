import { Image, Heading, FormInput, Eye } from "lucide-react";

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="flex-1 text-center">
    <div className="mx-auto w-16 h-16 rounded-xl bg-white shadow flex items-center justify-center mb-4">
      <Icon size={26} className="text-blue-500" />
    </div>

    <h4 className="font-semibold">{title}</h4>

    <p className="text-sm text-slate-500 mt-2">{desc}</p>
  </div>
);

export default function Features() {
  return (
    <div className="grid md:grid-cols-4 gap-8 py-10">

      <Feature
        icon={Image}
        title="Image Alt Checks"
        desc="Detects missing or empty alt attributes on images"
      />

      <Feature
        icon={Heading}
        title="Heading Hierarchy"
        desc="Validates proper heading structure and order"
      />

      <Feature
        icon={FormInput}
        title="Form Accessibility"
        desc="Ensures inputs have associated labels"
      />

      <Feature
        icon={Eye}
        title="Contrast Hints"
        desc="Flags inline styles for manual contrast review"
      />

    </div>
  );
}