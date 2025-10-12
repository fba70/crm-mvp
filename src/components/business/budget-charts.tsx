"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartNoAxesCombined } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts"

const chartConfig = {
  revenues: {
    label: "revenues",
    color: "violet",
  },
} satisfies ChartConfig

const data1 = [
  { name: "Jan", revenues: 4000 },
  { name: "Feb", revenues: 3000 },
  { name: "Mar", revenues: 4000 },
  { name: "Apr", revenues: 5000 },
  { name: "May", revenues: 8000 },
  { name: "Jun", revenues: 5000 },
  { name: "Jul", revenues: 3000 },
  { name: "Aug", revenues: 1500 },
  { name: "Sep", revenues: 5500 },
  { name: "Oct", revenues: 7000 },
]

const data2 = [
  { name: "Jan", clients: 4 },
  { name: "Feb", clients: 6 },
  { name: "Mar", clients: 7 },
  { name: "Apr", clients: 5 },
  { name: "May", clients: 5 },
  { name: "Jun", clients: 4 },
  { name: "Jul", clients: 2 },
  { name: "Aug", clients: 1 },
  { name: "Sep", clients: 3 },
  { name: "Oct", clients: 7 },
]

const data3 = [
  { name: "Automotive", clients: 4 },
  { name: "Retail", clients: 6 },
  { name: "E-commerce", clients: 7 },
  { name: "FMCG", clients: 5 },
  { name: "Real estate", clients: 5 },
]

export default function BudgetCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartNoAxesCombined size={24} />
          Budget and Statistics Charts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revs" className="w-full">
          <TabsList>
            <TabsTrigger value="revs">Monthly Revenues</TabsTrigger>
            <TabsTrigger value="deals">Client Deals</TabsTrigger>
            <TabsTrigger value="types">Client Types</TabsTrigger>
          </TabsList>
          <TabsContent value="revs">
            <ChartContainer
              config={chartConfig}
              className="h-[200px] w-[340px]"
            >
              <BarChart
                accessibilityLayer
                data={data1}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-90}
                  textAnchor="start"
                  dy={15}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="revenues" fill="#3b82f6" radius={4} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="deals">
            <ChartContainer
              config={chartConfig}
              className="h-[200px] w-[340px]"
            >
              <BarChart
                accessibilityLayer
                data={data2}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-90}
                  textAnchor="start"
                  dy={15}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="clients" fill="#ff8904" radius={4} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="types">
            <ChartContainer
              config={chartConfig}
              className="h-[200px] w-[340px]"
            >
              <PieChart
                width={340}
                height={200}
                margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
              >
                <Pie
                  data={data3}
                  dataKey="clients"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={(entry) => `${entry.name}: ${entry.clients}`}
                >
                  {data3.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#3b82f6", "#f97316", "#10b981", "#ef4444", "#8b5cf6"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
              </PieChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
