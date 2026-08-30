import { useCallback, useEffect, useState } from "react";
import DashboardHome from "../../Components/DashboardHome/DashboardHome";
import DashboardSection from "../../Components/DashboardSection/DashboardSection";
import API from "../../api/axios";

const Dashboard = () => {
  const [period, setPeriod] = useState("week");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/dashboard", {
        params: { range: period },
        signal,
      });
      setDashboard(response.data);
    } catch (requestError) {
      if (requestError.name !== "CanceledError") {
        setError(requestError.response?.data?.message || "Unable to load the dashboard data.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(controller.signal);
    return () => controller.abort();
  }, [loadDashboard]);

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <DashboardHome dashboard={dashboard} period={period} onPeriodChange={setPeriod} />
      <DashboardSection
        bookings={dashboard?.recentBookings || []}
        loading={loading}
        onBookingChanged={() => loadDashboard()}
      />
    </div>
  );
};

export default Dashboard;
