export const getColourHex = (colourName) => {
  const map = {
    Black: "#000000",
    White: "#FFFFFF",
    Blue: "#1E3A8A",
    "Navy Blue": "#0F172A",
    Grey: "#6B7280",
    Red: "#DC2626",
    Green: "#16A34A",
    Yellow: "#CA8A04",
    Pink: "#DB2777",
    Purple: "#9333EA",
    Brown: "#78350F",
    Beige: "#F5F5DC",
  };
  return map[colourName] || "#E5E7EB";
};