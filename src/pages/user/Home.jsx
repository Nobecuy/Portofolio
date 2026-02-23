import Progress from "../../components/Progress";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-16">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Hi, I'm{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Nobe
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Frontend Developer & Creative Coder
        </p>
      </section>

      {/* Progress Section */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            My Progress
          </h2>
          <Progress />
        </div>
      </section>
    </div>
  );
};

export default Home;
