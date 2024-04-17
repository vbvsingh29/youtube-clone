const Progress_Bar = ({ progressPercentage }) => {
  return (
    <div className="h-5 w-full bg-gray-300">
      <div
        style={{ width: `${progressPercentage}%` }}
        className={`h-full ${
          progressPercentage < 70 ? "bg-blue-600" : "bg-green-600"
        }`}
      ></div>
    </div>
  );
};

export default Progress_Bar;
