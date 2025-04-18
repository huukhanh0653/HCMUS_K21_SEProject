/**
 * v0 by Vercel.
 * @see https://v0.dev/t/6Hb9KBuFmpM
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
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

        const serverDataFormatted = servers
          .reduce((acc, server) => {
            const createdAt = new Date(server.created_at);
            const day = `Ngày ${createdAt.getDate()}`;
            const existing = acc.find((item) => item.day === day);
            if (existing) {
              existing.Servers += 1;
            } else {
              acc.push({ day, Servers: 1 });
            }
            return acc;
          }, [])
          .slice(0, 7);

        setServerData(
          language === "en"
            ? serverDataFormatted.map((item) => ({
                ...item,
                day: item.day.replace("Ngày", "Day"),
              }))
            : serverDataFormatted
        );

        // Fetch member activity
        const users = await UserService.getUsers();

        const memberDataFormatted = users
          .reduce((acc, user) => {
            const created_at = new Date(user.created_at);
            const week = Math.ceil(created_at.getDate() / 7);
            const weekKey = `Tuần ${week}`;
            const existing = acc.find((item) => item.week === weekKey);
            if (existing) {
              existing.Members += 1;
            } else {
              acc.unshift({ week: weekKey, Members: 1 });
            }
            return acc;
          }, [])
          .slice(0, 4);

        setMemberActivity(
          language === "en"
            ? memberDataFormatted.map((item) => ({
                ...item,
                week: item.week.replace("Tuần", "Week"),
              }))
            : memberDataFormatted
        );

        // Fetch role distribution across all servers
        const roleCounts = await Promise.all(
          servers.map(async (server) => {
            const memberResponse =
              await ServerChannelService.searchServerMember(server.id);
            const members = Array.isArray(memberResponse)
              ? memberResponse
              : memberResponse.members || [];
            if (!Array.isArray(members)) {
              console.warn(
                `Invalid members data for server ${server.id}:`,
                members
              );
              return [];
            }
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

              {/* Roles Monitoration */}
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
