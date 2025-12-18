import React, { useMemo } from "react";
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
  Badge,
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
import { RootState } from "../../redux/store";
import {
  getKPIs,
  getRecentActivities,
  getPropertyPerformance,
  getMonthlySales,
  getTopInquiries,
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
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "120px",
          height: "120px",
          backgroundColor: color,
          opacity: 0.05,
          borderRadius: "50%",
          transform: "translate(50%, -50%)",
        }}
      />
      <CardContent sx={{ position: "relative" }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h3" fontWeight="700" sx={{ mb: 1, color }}>
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
  const topInquiries = useSelector(getTopInquiries);

  const maxMonthlySales = useMemo(
    () => Math.max(...monthlySales.map((m) => m.inquiries)),
    [monthlySales]
  );

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
                }}
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
        {/* ==================== TOP INQUIRIES ==================== */}
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
                  Top Inquiries
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
                {topInquiries.map((inquiry) => {
                  const getPriorityColor = (priority: string) => {
                    switch (priority) {
                      case "high":
                        return { bg: "#ff6b6b20", color: "#ff6b6b" };
                      case "medium":
                        return { bg: "#ffa50020", color: "#ffa500" };
                      case "low":
                        return { bg: "#667eea20", color: "#667eea" };
                      default:
                        return { bg: "#667eea20", color: "#667eea" };
                    }
                  };

                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case "pending":
                        return { bg: "#ffa50020", color: "#ffa500" };
                      case "contacted":
                        return { bg: "#667eea20", color: "#667eea" };
                      case "site-visit":
                        return { bg: "#4facfe20", color: "#4facfe" };
                      case "interested":
                        return { bg: "#43e97b20", color: "#43e97b" };
                      case "not-interested":
                        return { bg: "#ff6b6b20", color: "#ff6b6b" };
                      default:
                        return { bg: "#667eea20", color: "#667eea" };
                    }
                  };

                  const priorityColor = getPriorityColor(inquiry.priority);
                  const statusColor = getStatusColor(inquiry.status);

                  return (
                    <Box
                      key={inquiry.id}
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
                            {inquiry.clientName}
                          </Typography>
                          <Chip
                            label={inquiry.priority.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: priorityColor.bg,
                              color: priorityColor.color,
                              height: 20,
                              fontSize: "0.65rem",
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {inquiry.projectName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#667eea", fontWeight: 600 }}
                          >
                            {inquiry.flatType}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={inquiry.status.replace("-", " ").toUpperCase()}
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
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Monthly Trends
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-around", gap: 2 }}
              >
                {monthlySales.map((month) => (
                  <Box
                    key={month.month}
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
                            (month.inquiries / maxMonthlySales) * 100
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
                      {/* Appointments Bar */}
                      <Box
                        sx={{
                          width: "8px",
                          height: `${
                            (month.appointments / maxMonthlySales) * 100
                          }%`,
                          backgroundColor: "#4facfe",
                          borderRadius: "4px 4px 0 0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        title={`Appointments: ${month.appointments}`}
                      />
                      {/* Bookings Bar */}
                      <Box
                        sx={{
                          width: "8px",
                          height: `${
                            (month.bookings / maxMonthlySales) * 100
                          }%`,
                          backgroundColor: "#43e97b",
                          borderRadius: "4px 4px 0 0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        title={`Bookings: ${month.bookings}`}
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
                  <Typography variant="caption">Appointments</Typography>
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
                  <Typography variant="caption">Bookings</Typography>
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
