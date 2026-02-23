// Utility untuk mapping persentase ke level learning
export const getLevelFromPercentage = (percentage) => {
  if (percentage >= 90) return "Expert";
  if (percentage >= 75) return "Advanced";
  if (percentage >= 60) return "Intermediate";
  if (percentage >= 40) return "Learning";
  if (percentage >= 20) return "Beginner";
  return "Just Started";
};

export const getLevelColor = (level) => {
  const colorMap = {
    "Expert": "from-red-500 to-orange-500",
    "Advanced": "from-purple-500 to-pink-500", 
    "Intermediate": "from-blue-500 to-cyan-500",
    "Learning": "from-green-500 to-emerald-500",
    "Beginner": "from-yellow-500 to-amber-500",
    "Just Started": "from-gray-500 to-slate-500"
  };
  return colorMap[level] || "from-blue-500 to-blue-600";
};

export const getProgressColor = (percentage) => {
  if (percentage >= 90) return "from-red-500 to-orange-500";
  if (percentage >= 75) return "from-purple-500 to-pink-500";
  if (percentage >= 60) return "from-blue-500 to-cyan-500";
  if (percentage >= 40) return "from-green-500 to-emerald-500";
  if (percentage >= 20) return "from-yellow-500 to-amber-500";
  return "from-gray-500 to-slate-500";
};
