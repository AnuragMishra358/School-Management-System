import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#22C55E", "#EF4444"]; // Green for Present, Red for Absent

export const AttendancePieChart = ({ data }) => {
  return (
    <div className="flex justify-center items-center">
  <PieChart width={250} height={250}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      outerRadius={100}
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>

    {/* Tooltip with dark mode */}
    <Tooltip
      contentStyle={{
        backgroundColor: "var(--tw-bg-opacity,1) #fff",
        color: "#111827",
      }}
      wrapperClassName="dark:bg-gray-800 dark:text-gray-100"
    />

    {/* Legend with dark mode */}
    <Legend
      wrapperStyle={{
        color: "inherit",
      }}
      className="dark:text-gray-200 text-gray-800"
    />
  </PieChart>
</div>

  );
};
