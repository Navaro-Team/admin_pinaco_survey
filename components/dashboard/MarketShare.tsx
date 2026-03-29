import { Cell, PieChart, Pie, Label } from "recharts";

export function MarketShare() {
  const data = [
    { name: 'PINACO', value: 80 },
    { name: 'GS', value: 20 },
  ];

  const COLORS = ['#0f766e', '#ebe6e7'];

  return (
    <PieChart width={248} height={248} className="flex items-center justify-center">
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={112}
        innerRadius={72}
        dataKey="value"
      >
        <Label value="80/20" position="center" fontSize={16} fontWeight="bold" color="#fff" />
        {data.map((_entry, index) => <Cell key={index} fill={COLORS[index]} className="border-none focus:outline-none! focus:ring-0!" />)}
      </Pie>
    </PieChart>)
}