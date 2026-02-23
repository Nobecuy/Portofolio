const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 transition-colors duration-500" />
      
      {/* Aurora effect 1 - Purple */}
      <div 
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/40 rounded-full blur-[120px]"
        style={{ animation: 'aurora1 15s ease-in-out infinite' }}
      />
      
      {/* Aurora effect 2 - Pink */}
      <div 
        className="absolute top-1/4 -right-40 w-[400px] h-[400px] bg-pink-600/35 rounded-full blur-[100px]"
        style={{ animation: 'aurora2 18s ease-in-out infinite' }}
      />
      
      {/* Aurora effect 3 - Blue */}
      <div 
        className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-blue-600/30 rounded-full blur-[100px]"
        style={{ animation: 'aurora3 20s ease-in-out infinite' }}
      />
      
      {/* Aurora effect 4 - Cyan */}
      <div 
        className="absolute -bottom-40 right-1/3 w-[450px] h-[450px] bg-cyan-500/30 rounded-full blur-[100px]"
        style={{ animation: 'aurora4 22s ease-in-out infinite' }}
      />
      
      {/* Additional center glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]"
        style={{ animation: 'pulse-glow 8s ease-in-out infinite' }}
      />
    </div>
  );
};

export default AuroraBackground;
