import Footer from "@/components/Footer";
import Header from "@/components/main-header";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className="min-h-screen"
        style={{
          display: "grid",
          // main (fills) | footer | scroll to top
          // header has position fix so its jumps out of the normal flow 
          // thats why grid will start affecting from the main that is relative
          gridTemplateRows: "1fr auto auto",
        }}
      >
        <Header />

        {/* Main content wrapper with padding to account for fixed/absolute header */}
        <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}