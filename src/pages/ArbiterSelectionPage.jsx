import Header from "../components/Header";
import Footer from "../components/Footer";
import ArbiterSelectionContent from "../components/arbiters/ArbiterSelectionContent";

function ArbiterSelectionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <ArbiterSelectionContent />
      </main>
      <Footer />
    </div>
  );
}

export default ArbiterSelectionPage;
