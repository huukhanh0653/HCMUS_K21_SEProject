/**
 * v0 by Vercel.
 * @see https://v0.dev/t/6Hb9KBuFmpM
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  LineChart,
  Cell,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../layout/LanguageProvider";

export default function AdminPanel() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const newMembersData = [
    { day: "Day 1", Servers: 5 },
    { day: "Day 5", Servers: 20 },
    { day: "Day 10", Servers: 50 },
    { day: "Day 15", Servers: 100 },
    { day: "Day 20", Servers: 250 },
    { day: "Day 25", Servers: 350 },
    { day: "Day 30", Servers: 456 },
  ];
  const viNewMembersData = [
    { day: "Ngày 1", Servers: 5 },
    { day: "Ngày 5", Servers: 20 },
    { day: "Ngày 10", Servers: 50 },
    { day: "Ngày 15", Servers: 100 },
    { day: "Ngày 20", Servers: 250 },
    { day: "Ngày 25", Servers: 350 },
    { day: "Ngày 30", Servers: 456 },
  ];
  const weeklyActivity = [
    { week: "Week 1", Members: 10 },
    { week: "Week 2", Members: 25 },
    { week: "Week 3", Members: 40 },
    { week: "Week 4", Members: 60 },
  ];
  const viWeeklyActivity = [
    { week: "Tuần 1", Members: 10 },
    { week: "Tuần 2", Members: 25 },
    { week: "Tuần 3", Members: 40 },
    { week: "Tuần 4", Members: 60 },
  ];

  const moderationData = [
    { name: "Pending Bans", value: 5 },
    { name: "Muted Members", value: 12 },
    { name: "Reported Messages", value: 23 },
    { name: "Deleted Messages", value: 87 },
  ];
  const viModerationData = [
    { name: "Lệnh ban đang chờ xử lý", value: 5 },
    { name: "Thành viên bị tắt tiếng", value: 12 },
    { name: "Tin nhắn bị tố cáo", value: 23 },
    { name: "Tin nhắn đã xóa", value: 87 },
  ];
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61"];

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto w-full">
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 lg:p-8">
            {/* Server Analytics */}
            <Card className="p-6 lg:p-8">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">
                  {t("Server Analytics")}
                </CardTitle>
                <CardDescription className="text-foreground">
                  {t(`Overview of your server's performance and activity.`)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={language == "en" ? newMembersData : viNewMembersData}
                  >
                    <CartesianGrid
                      stroke="hsl(var(--border))"
                      strokeDasharray="3 3"
                    />
                    <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        color: "hsl(var(--card-foreground))",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Servers"
                      stroke="hsl(var(--primary))"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Member Activity */}
            <Card className="p-6 lg:p-8">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">
                  {t("Member Activity")}
                </CardTitle>
                <CardDescription className="text-foreground">
                  {t("Recent activity and engagement from your members.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={language == "en" ? weeklyActivity : viWeeklyActivity}
                  >
                    <CartesianGrid
                      stroke="hsl(var(--border))"
                      strokeDasharray="3 3"
                    />
                    <XAxis dataKey="week" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        color: "hsl(var(--card-foreground))",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="Members"
                      fill="#82ca9d"
                      stroke="hsl(var(--primary))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Moderation Tools */}
            <Card className="p-6 lg:p-8">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">
                  {t("Moderation Tools")}
                </CardTitle>
                <CardDescription className="text-foreground">
                  {t(`Manage and monitor your server's moderation activities.`)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    {language == "en" ? (
                      <Pie
                        dataKey="value"
                        data={moderationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        label={({ name, percent }) =>
                          `${(percent * 100).toFixed(1)}%`
                        }
                      >
                        {moderationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    ) : (
                      <Pie
                        dataKey="value"
                        data={viModerationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        label={({ name, percent }) =>
                          `${(percent * 100).toFixed(1)}%`
                        }
                      >
                        {viModerationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    )}
                    <Tooltip formatter={(value, name) => [`${value}`, name]} />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      layout="vertical"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
