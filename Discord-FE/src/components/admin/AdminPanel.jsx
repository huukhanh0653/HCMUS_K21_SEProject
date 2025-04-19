import { useState, useEffect } from "react";
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
import UserService from "../../services/UserService";
import ServerChannelService from "../../services/ServerChannelService";

export default function AdminPanel() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [serverData, setServerData] = useState([]);
  const [memberActivity, setMemberActivity] = useState([]);
  const [moderationData, setModerationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61"];
  const tickValues =
    language === "en"
      ? ["Day 1", "Day 10", "Day 20", "Day 30"]
      : ["Ngày 1", "Ngày 10", "Ngày 20", "Ngày 30"];

  const userId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        // Fetch server data
        const serverResponse = await ServerChannelService.getAllServers(userId);
        const servers = serverResponse.servers || [];

        // Initialize 30 days of the month
        const serverDataFormatted = Array.from({ length: 30 }, (_, i) => ({
          day: language === "en" ? `Day ${i + 1}` : `Ngày ${i + 1}`,
          Servers: 0,
        }));

        // Count servers per day
        servers.forEach((server) => {
          const createdAt = new Date(server.created_at);
          const dayIndex = createdAt.getDate() - 1;
          if (dayIndex >= 0 && dayIndex < 30) {
            serverDataFormatted[dayIndex].Servers += 1;
          }
        });

        setServerData(serverDataFormatted);

        // Fetch member activity
        const users = await UserService.getUsers();

        // Initialize 4 weeks
        const memberDataFormatted = Array.from({ length: 4 }, (_, i) => ({
          week: language === "en" ? `Week ${i + 1}` : `Tuần ${i + 1}`,
          Members: 0,
        }));

        // Count members per week
        users.forEach((user) => {
          const createdAt = new Date(user.created_at);
          const dayOfMonth = createdAt.getDate();
          const weekIndex = Math.floor((dayOfMonth - 1) / 7);
          if (weekIndex >= 0 && weekIndex < 4) {
            memberDataFormatted[weekIndex].Members += 1;
          }
        });

        setMemberActivity(memberDataFormatted);

        // Fetch role distribution
        const roleCounts = await Promise.all(
          servers.map(async (server) => {
            const { members } = await ServerChannelService.searchServerMember(
              server.id
            );
            return members.map((member) => member.role || "Unknown");
          })
        );

        const flattenedRoleCounts = roleCounts.flat();
        const roleDistribution = flattenedRoleCounts.reduce((acc, roleName) => {
          acc[roleName] = (acc[roleName] || 0) + 1;
          return acc;
        }, {});

        const totalRoles = flattenedRoleCounts.length;
        const moderationDataFormatted = Object.entries(roleDistribution).map(
          ([name, count]) => ({
            name: t(`roles.${name}`, { defaultValue: name }),
            value:
              totalRoles > 0
                ? Number(((count / totalRoles) * 100).toFixed(1))
                : 0,
          })
        );

        setModerationData(moderationDataFormatted);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(t("Failed to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, userId, t]);

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto w-full">
          {loading ? (
            <div className="p-6">{t("Loading...")}</div>
          ) : error ? (
            <div className="p-6 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 lg:p-8">
              {/* Server Analytics */}
              <Card className="p-6 lg:p-8">
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl">
                    {t("Server Analytics")}
                  </CardTitle>
                  <CardDescription className="text-foreground">
                    {t("Overview of servers created by days of the month")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={serverData}>
                      <CartesianGrid
                        stroke="hsl(var(--border))"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="day"
                        stroke="hsl(var(--foreground))"
                        ticks={tickValues}
                        tickFormatter={(value) =>
                          value.replace(language === "en" ? "Day" : "Ngày", "")
                        }
                      />
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
                        dot={({ cx, cy, payload }) =>
                          tickValues.includes(payload.day) ? (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={3}
                              fill="hsl(var(--primary))"
                            />
                          ) : null
                        }
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
                    {t(
                      "Overview of members joining community by weeks of the month"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={memberActivity}>
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

              {/* Roles Monitoration (unchanged) */}
              <Card className="p-6 lg:p-8">
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl">
                    {t("Roles Monitoration")}
                  </CardTitle>
                  <CardDescription className="text-foreground">
                    {t("Percentage of roles of members in the servers")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {moderationData.length === 0 ? (
                    <div className="text-center text-foreground">
                      {t("No role data available")}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
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
                        <Tooltip
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                        <Legend
                          verticalAlign="bottom"
                          align="center"
                          layout="vertical"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
