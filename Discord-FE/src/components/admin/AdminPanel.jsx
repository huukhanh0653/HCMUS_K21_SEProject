/**
 * v0 by Vercel.
 * @see https://v0.dev/t/6Hb9KBuFmpM
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Link } from "react-router-dom";
import { Button } from "../ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { useNavigate } from "react-router-dom";
import { LineChart, Cell, Line, BarChart, Bar, PieChart, Pie, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
export default function AdminPanel() {
  const navigate = useNavigate();
  const newMembersData = [
    { day: "Day 1", Servers: 5 },
    { day: "Day 5", Servers: 20 },
    { day: "Day 10", Servers: 50 },
    { day: "Day 15", Servers: 100 },
    { day: "Day 20", Servers: 250 },
    { day: "Day 25", Servers: 350 },
    { day: "Day 30", Servers: 456 },
  ];
  
  const weeklyActivity = [
    { week: "Week 1", Members: 10 },
    { week: "Week 2", Members: 25 },
    { week: "Week 3", Members: 40 },
    { week: "Week 4", Members: 60 },
  ];
  

  const roleData = [
    { name: "Custom Roles", Roles: 45 },
    { name: "Highest Role", Roles: 10 },
    { name: "Lowest Role", Roles: 1 },
  ];

  const moderationData = [
    { name: "Pending Bans", value: 5 },
    { name: "Muted Members", value: 12 },
    { name: "Reported Messages", value: 23 },
    { name: "Deleted Messages", value: 87 },
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
                <CardTitle className="text-lg lg:text-xl">Server Analytics</CardTitle>
                <CardDescription className="text-foreground">Overview of your server's performance and activity.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={newMembersData}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }} />
                    <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="Servers" stroke="hsl(var(--primary))" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Member Activity */}
            <Card className="p-6 lg:p-8">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Member Activity</CardTitle>
                <CardDescription className="text-foreground">Recent activity and engagement from your members.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                    <XAxis dataKey="week" stroke="hsl(var(--foreground))"/>
                    <YAxis stroke="hsl(var(--foreground))"/>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}/>
                    <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }}/>
                    <Bar dataKey="Members" fill="#82ca9d" stroke="hsl(var(--primary))"/>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Moderation Tools */}
            <Card className="p-6 lg:p-8">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Moderation Tools</CardTitle>
                <CardDescription className="text-foreground">Manage and monitor your server's moderation activities.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart >
                    <Pie
                      dataKey="value"
                      data={moderationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                    >
                      {moderationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}`, name]} />
                    <Legend verticalAlign="bottom" align="center" layout="vertical"/>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Roles Management */}
            <Card className="p-6 lg:p-8">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Roles Management</CardTitle>
                <CardDescription className="text-foreground">Create, edit, and manage roles for your server members.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={roleData}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3"/>
                    <XAxis type="number" stroke="hsl(var(--foreground))"/>
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--foreground))"/>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))"}}/>
                    <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }}/>
                    <Bar dataKey="Roles" fill="#ff7300" stroke="hsl(var(--border))"/>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  )
}

function DiscIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}


function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function MoveHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  )
}


function PlayIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}


function PowerIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </svg>
  )
}


function ServerIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  )
}


function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

