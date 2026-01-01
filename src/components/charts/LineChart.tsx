import { useState, useEffect } from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  name: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  height?: number
  color?: string
  showGrid?: boolean
  className?: string
}

export default function LineChart({
  data,
  height = 200,
  color = '#13ec80',
  showGrid = true,
  className = '',
}: LineChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`w-full ${className}`} style={{ height }} />
  }

  return (
    <div className={`w-full min-w-0 ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
          )}
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: '#1e293b', fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: color }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
