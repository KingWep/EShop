import { Construction } from "../components/icons";

const PlaceholderPage = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-up">
    <div className="icon-bg w-16 h-16 mb-4">
      <Construction className="w-8 h-8 text-primary" />
    </div>
    <h1 className="text-xl font-bold text-foreground">{title}</h1>
    <p className="text-sm text-muted-foreground mt-1.5">
      {description ?? "This page is under construction. Check back soon!"}
    </p>
  </div>
);

export default PlaceholderPage;
