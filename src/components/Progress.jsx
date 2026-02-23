import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getLevelFromPercentage } from "../utils/levelMapping";

// Mapping color field to gradient classes (same as Dashboard.jsx)
const getColorClass = (color) => {
  const colorMap = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    pink: "from-pink-500 to-rose-500",
    green: "from-green-500 to-emerald-500",
    yellow: "from-yellow-500 to-amber-500",
    red: "from-red-500 to-orange-500",
  };
  return colorMap[color] || "from-blue-500 to-cyan-500";
};

export default function Progress() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "progress"), (snapshot) => {
      setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-6 mt-10 space-y-4">
      {data.map((item) => {
        const level = getLevelFromPercentage(item.percentage);
        // Use custom color from database, fallback to blue if not set
        const colorClass = getColorClass(item.color) || getColorClass("blue");
        return (
          <div key={item.id}>
            <div className="flex justify-between mb-1">
              <span className="text-white font-medium">{item.title}</span>
              <span className="text-gray-400 text-sm font-medium">{level}</span>
            </div>
            <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-700 bg-gradient-to-r ${colorClass}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
