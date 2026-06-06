const StatCard = ({ title, value }) => {
  return (
    <div 
      style={{ 
        backgroundColor: "rgba(30, 41, 59, 0.4)", 
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "16px",
        // Increased height and right-push alignment padding
        padding: "24px 28px", 
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.2s ease, background-color 0.2s ease"
      }}
    >
      {/* CARD TITLE - Small, neat uppercase look */}
      <span 
        style={{ 
          fontSize: "12px", 
          fontWeight: 600, 
          color: "#94a3b8", 
          textTransform: "uppercase",
          letterSpacing: "0.08em"
        }}
      >
        {title}
      </span>

      {/* CARD VALUE - Clean and bold font look */}
      <h2 
        style={{ 
          fontSize: "1.75rem", 
          fontWeight: 700, 
          color: "#ffffff", 
          margin: 0,
          letterSpacing: "-0.02em"
        }}
      >
        {value}
      </h2>
    </div>
  );
};

export default StatCard;