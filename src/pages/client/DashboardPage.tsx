import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  LinearProgress,
  Stack,
  Button,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Message,
  Event,
  AccessTime,
  Check,
  Notifications,
  NavigateNext,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import {
  getKPIs,
  getRecentActivities,
  getPropertyPerformance,
  getMonthlySales,
  getUpcomingAppointments,
} from "../../redux/slices/clientDashboardSlice";
import { PageLayout } from "../../components/layout/PageLayout";

// Activity Type Icon
const getActivityIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return <Event sx={{ color: "#4facfe" }} />;
    case "inquiry":
      return <Message sx={{ color: "#667eea" }} />;
    case "tour":
      return <AccessTime sx={{ color: "#f093fb" }} />;
    case "booking":
      return <Check sx={{ color: "#43e97b" }} />;
    case "message":
      return <Notifications sx={{ color: "#ffa500" }} />;
    default:
      return <Notifications />;
  }
};

// KPI Card Component
const DashboardKPICard: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  change: number;
  changeType: "increase" | "decrease";
  color: string;
}> = ({ label, value, unit, change, changeType, color }) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
      }}
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "120px",
          height: "120px",
          opacity: 0.05,
          borderRadius: "50%",
          transform: "translate(50%, -50%)",
          backgroundColor: color,
        }}
      />
      <CardContent sx={{ position: "relative" }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography
          variant="h3"
          fontWeight="700"
          sx={{ mb: 1 }}
          style={{ color }}
        >
          {value}
        </Typography>
        {unit && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            {unit}
          </Typography>
        )}
        <Chip
          icon={changeType === "increase" ? <TrendingUp /> : <TrendingDown />}
          label={`${Math.abs(change)}%`}
          size="small"
          sx={{
            backgroundColor:
              changeType === "increase" ? "#43e97b20" : "#ff6b6b20",
            color: changeType === "increase" ? "#43e97b" : "#ff6b6b",
            fontWeight: 600,
          }}
        />
      </CardContent>
    </Card>
  );
};

// Activity Status Badge
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return { bg: "#ffa50020", color: "#ffa500" };
    case "completed":
      return { bg: "#43e97b20", color: "#43e97b" };
    case "cancelled":
      return { bg: "#ff6b6b20", color: "#ff6b6b" };
    default:
      return { bg: "#667eea20", color: "#667eea" };
  }
};

export const DashboardPage: React.FC = () => {
  const kpis = useSelector(getKPIs);
  const recentActivities = useSelector(getRecentActivities);
  const propertyPerformance = useSelector(getPropertyPerformance);
  const monthlySales = useSelector(getMonthlySales);
  const upcomingAppointments = useSelector(getUpcomingAppointments);

  // Year filter and month filtering up to current month
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const availableYears = useMemo(
    () => Array.from(new Set(monthlySales.map((m) => m.year))).sort(),
    [monthlySales]
  );
  const currentMonthIndex = new Date().getMonth(); // 0-11
  const filteredMonths = useMemo(() => {
    const months = monthlySales
      .filter((m) => m.year === selectedYear)
      .sort(
        (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
      );
    if (selectedYear === currentYear) {
      return months.filter(
        (m) => monthOrder.indexOf(m.month) <= currentMonthIndex
      );
    }
    return months;
  }, [monthlySales, selectedYear]);

  const maxMonthlySales = useMemo(() => {
    const values = filteredMonths.flatMap((m) => [
      m.inquiries,
      m.appointments,
      m.completedAppointments,
      m.virtualTours,
    ]);
    return values.length ? Math.max(...values) : 0;
  }, [filteredMonths]);

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your business overview at a glance."
    >
      <Grid container spacing={3}>
        {/* ==================== KPI CARDS ==================== */}
        {kpis.map((kpi) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.id}>
            <DashboardKPICard
              label={kpi.label}
              value={kpi.value}
              unit={kpi.unit}
              change={kpi.change}
              changeType={kpi.changeType}
              color={kpi.color}
            />
          </Grid>
        ))}
        {/* ==================== RECENT ACTIVITIES ==================== */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                } as any}
              >
                <Typography variant="h6" fontWeight="600">
                  Recent Activities
                </Typography>
                <Button
                  size="small"
                  endIcon={<NavigateNext />}
                  sx={{ color: "#667eea", textTransform: "none" }}
                >
                  View All
                </Button>
              </Box>

              <Stack spacing={2}>
                {recentActivities.slice(0, 5).map((activity) => {
                  const statusColor = getStatusColor(activity.status);
                  return (
                    <Box
                      key={activity.id}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        p: 1.5,
                        backgroundColor: "#f9fafb",
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Box sx={{ mr: 2, mt: 0.5 }}>
                        {getActivityIcon(activity.type)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body2" fontWeight="600">
                            {activity.title}
                          </Typography>
                          <Chip
                            label={activity.status}
                            size="small"
                            sx={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.color,
                              height: 20,
                              fontSize: "0.7rem",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          {activity.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.userName} •{" "}
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* ==================== UPCOMING APPOINTMENTS ==================== */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  Upcoming Appointments
                </Typography>
                <Button
                  size="small"
                  endIcon={<NavigateNext />}
                  sx={{ color: "#667eea", textTransform: "none" }}
                >
                  View All
                </Button>
              </Box>

              <Stack spacing={1.5}>
                {upcomingAppointments.map((appointment) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case "scheduled":
                        return { bg: "#4facfe20", color: "#4facfe" };
                      case "completed":
                        return { bg: "#43e97b20", color: "#43e97b" };
                      case "cancelled":
                        return { bg: "#ff6b6b20", color: "#ff6b6b" };
                      case "rescheduled":
                        return { bg: "#ffa50020", color: "#ffa500" };
                      default:
                        return { bg: "#667eea20", color: "#667eea" };
                    }
                  };

                  const statusColor = getStatusColor(appointment.status);

                  return (
                    <Box
                      key={appointment.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        backgroundColor: "#f9fafb",
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body2" fontWeight="600">
                            {appointment.clientName}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {appointment.projectName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#667eea", fontWeight: 600 }}
                          >
                            {appointment.flatType}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Event sx={{ fontSize: "0.9rem", color: "#999" }} />
                          <Typography variant="caption" color="text.secondary">
                            {appointment.appointmentDate} at {appointment.appointmentTime}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={appointment.status.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.color,
                          height: 24,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* ==================== MONTHLY TRENDS CHART ==================== */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  Monthly Trends
                </Typography>
                <Select
                  size="small"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  sx={{ minWidth: 120 }}
                >
                  {availableYears.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-around", gap: 2 }}
              >
                {filteredMonths.map((month) => (
                  <Tooltip
                    key={month.month}
                    title={`${month.month}: Inquiries ${month.inquiries} • Total Appointments ${month.appointments} • Completed Appointments ${month.completedAppointments} • Virtual Tours ${month.virtualTours}`}
                    placement="top"
                  >
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        alignItems: "flex-end",
                        height: "120px",
                        mb: 1,
                      }}
                    >
                      {/* Inquiries Bar */}
                      <Box
                        sx={{
                          width: "8px",
                          height: `${
                            maxMonthlySales
                              ? (month.inquiries / maxMonthlySales) * 100
                              : 0
                          }%`,
                          backgroundColor: "#667eea",
                          borderRadius: "4px 4px 0 0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        title={`Inquiries: ${month.inquiries}`}
                      />
                      {/* Total Appointments Bar */}
                      <Box
                        sx={{
                          width: "8px",
                          height: `${
                            maxMonthlySales
                              ? (month.appointments / maxMonthlySales) * 100
                              : 0
                          }%`,
                          backgroundColor: "#4facfe",
                          borderRadius: "4px 4px 0 0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        title={`Total Appointments: ${month.appointments}`}
                      />
                      {/* Completed Appointments Bar */}
                      <Box
                        sx={{
                          width: "8px",
                          height: `${
                            maxMonthlySales
                              ? (month.completedAppointments / maxMonthlySales) * 100
                              : 0
                          }%`,
                          backgroundColor: "#43e97b",
                          borderRadius: "4px 4px 0 0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        title={`Completed Appointments: ${month.completedAppointments}`}
                      />
                      {/* Virtual Tours Bar */}
                      <Box
                        sx={{
                          width: "8px",
                          height: `${
                            maxMonthlySales
                              ? (month.virtualTours / maxMonthlySales) * 100
                              : 0
                          }%`,
                          backgroundColor: "#f093fb",
                          borderRadius: "4px 4px 0 0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        title={`Virtual Tours: ${month.virtualTours}`}
                      />
                    </Box>
                      <Typography
                        variant="caption"
                        fontWeight="600"
                        color="text.secondary"
                      >
                        {month.month}
                      </Typography>
                    </Box>
                  </Tooltip>
                ))}
              </Box>

              {/* Legend */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 3,
                  mt: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: "#667eea",
                      borderRadius: "2px",
                    }}
                  />
                  <Typography variant="caption">Inquiries</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: "#4facfe",
                      borderRadius: "2px",
                    }}
                  />
                  <Typography variant="caption">Total Appointments</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: "#43e97b",
                      borderRadius: "2px",
                    }}
                  />
                  <Typography variant="caption">Completed Appointments</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: "#f093fb",
                      borderRadius: "2px",
                    }}
                  />
                  <Typography variant="caption">Virtual Tours</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* ==================== PROPERTIES STATUS ==================== */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Properties Status
              </Typography>

              <Stack spacing={1.5}>
                {propertyPerformance.map((property) => {
                  const statusColor =
                    property.status === "high"
                      ? "#43e97b"
                      : property.status === "medium"
                      ? "#ffa500"
                      : "#ff6b6b";

                  return (
                    <Box key={property.id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight="500" sx={{ flex: 1 }}>
                          {property.projectName}
                        </Typography>
                        <Chip
                          label={property.status.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: statusColor,
                            color: "white",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            height: 24,
                            flexShrink: 0,
                          }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={property.conversionRate}
                        sx={{
                          height: 6,
                          backgroundColor: "#e5e7eb",
                          borderRadius: 3,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: statusColor,
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {property.appointments} appointments
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight="600"
                          color="text.secondary"
                        >
                          {property.conversionRate}%
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {" "}
      </Grid>
    </PageLayout>
  );
};
