import { useState, useEffect } from "react";
import { progressService } from "../../firebase";

const Progress = () => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const data = await progressService.getAll();
      setProgressList(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      pink: "from-pink-500 to-pink-600",
      green: "from-green-500 to-green-600",
      yellow: "from-yellow-500 to-yellow-600",
      red: "from-red-500 to-red-600",
    };
    return colorMap[color] || "from-blue-500 to-blue-600";
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Progress{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Belajar
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Tracking perjalanan pembelajaran saya
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progressList.map((item, index) => (
              <div
                key={item.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all hover:transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-2xl font-bold text-purple-400">
                    {item.percentage}%
                  </span>
                </div>

                <p className="text-gray-400 mb-6 leading-relaxed">
                  {item.description}
                </p>

                {/* Animated Progress Bar */}
                <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getColorClass(item.color)} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${item.percentage}%`,
                      animation: "loadProgress 1s ease-out forwards",
                    }}
                  />
                </div>

                {/* Status Badge */}
                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`text-sm ${item.percentage === 100 ? "text-green-400" : "text-yellow-400"}`}
                  >
                    {item.percentage === 100
                      ? "✅ Completed"
                      : "🚀 In Progress"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes loadProgress {
          from { width: 0; }
          to { width: var(--progress-width); }
        }
      `}</style>
    </div>
  );
};

export default Progress;
