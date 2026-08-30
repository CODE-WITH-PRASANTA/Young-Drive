const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Vehicle = require("../models/Vehicle");

const BOOKING_STATUSES = [
  "Confirmed",
  "Ongoing",
  "Completed",
  "Cancelled",
  "Pending",
];

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const addDays = (date, days) => {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
};

const getRange = (rangeKey) => {
  const now = new Date();
  const today = startOfDay(now);
  const currentEnd = addDays(today, 1);

  if (rangeKey === "month") {
    const currentStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const previousEnd = currentStart;
    const previousStart = new Date(
      previousEnd.getTime() - (currentEnd.getTime() - currentStart.getTime()),
    );

    return {
      key: "month",
      label: "This Month",
      comparisonLabel: "previous period",
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
    };
  }

  if (rangeKey === "year") {
    const currentStart = new Date(today.getFullYear(), 0, 1);
    const previousStart = new Date(today.getFullYear() - 1, 0, 1);
    const previousEnd = new Date(
      previousStart.getTime() + (currentEnd.getTime() - currentStart.getTime()),
    );

    return {
      key: "year",
      label: "This Year",
      comparisonLabel: "last year",
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
    };
  }

  const currentStart = addDays(today, -6);

  return {
    key: "week",
    label: "Last 7 Days",
    comparisonLabel: "previous 7 days",
    currentStart,
    currentEnd,
    previousStart: addDays(currentStart, -7),
    previousEnd: currentStart,
  };
};

const getVehicleName = (booking) => {
  const vehicle = booking.vehicle || {};

  return (
    booking.vehicleName ||
    [vehicle.vehicleBrand || vehicle.brand || vehicle.make, vehicle.vehicleModel || vehicle.model]
      .filter(Boolean)
      .join(" ") ||
    vehicle.name ||
    vehicle.title ||
    "Vehicle"
  );
};

const serializeBooking = (booking) => ({
  _id: booking._id,
  bookingId: booking.bookingId || String(booking._id),
  customerName: booking.customerName || booking.fullName || booking.customer?.name || "Customer",
  email: booking.email || booking.customer?.email || "",
  vehicleName: getVehicleName(booking),
  vehicleColor: booking.vehicle?.color || booking.vehicleColor || "",
  pickupDate: booking.pickupDate || booking.bookingDate || null,
  pickupTime: booking.pickupTime || "",
  dropoffDate: booking.dropoffDate || booking.returnDate || null,
  dropoffTime: booking.dropoffTime || "",
  amount: Number(booking.amount) || 0,
  status: booking.status || "Pending",
  paymentStatus: booking.paymentStatus || "Unpaid",
  createdAt: booking.createdAt,
});

const sumSuccessfulPayments = async (match) => {
  const result = await Payment.aggregate([
    {
      $match: {
        ...match,
        status: "Successful",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return result[0]?.total || 0;
};

const getComparison = (current, previous) => {
  if (!previous) {
    return {
      percent: null,
      direction: current > 0 ? "up" : "neutral",
    };
  }

  const percent = Number((((current - previous) / previous) * 100).toFixed(1));

  return {
    percent: Math.abs(percent),
    direction: percent > 0 ? "up" : percent < 0 ? "down" : "neutral",
  };
};

const buildChart = (range, bookings) => {
  const currentDuration = range.currentEnd.getTime() - range.currentStart.getTime();
  let labels = [];
  let bucketCount = 0;

  if (range.key === "week") {
    bucketCount = 7;
    labels = Array.from({ length: bucketCount }, (_, index) =>
      new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
        addDays(range.currentStart, index),
      ),
    );
  } else if (range.key === "month") {
    bucketCount = Math.max(1, Math.ceil(currentDuration / (7 * 24 * 60 * 60 * 1000)));
    labels = Array.from({ length: bucketCount }, (_, index) => `Week ${index + 1}`);
  } else {
    bucketCount = new Date().getMonth() + 1;
    labels = Array.from({ length: bucketCount }, (_, index) =>
      new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        new Date(range.currentStart.getFullYear(), index, 1),
      ),
    );
  }

  const current = Array(bucketCount).fill(0);
  const previous = Array(bucketCount).fill(0);

  const getBucketIndex = (date, start) => {
    if (range.key === "week") {
      return Math.floor((startOfDay(date).getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    }

    if (range.key === "month") {
      return Math.floor((startOfDay(date).getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
    }

    return date.getMonth();
  };

  bookings.forEach(({ createdAt }) => {
    const date = new Date(createdAt);

    if (date >= range.currentStart && date < range.currentEnd) {
      const index = getBucketIndex(date, range.currentStart);
      if (index >= 0 && index < bucketCount) current[index] += 1;
    }

    if (date >= range.previousStart && date < range.previousEnd) {
      const index = getBucketIndex(date, range.previousStart);
      if (index >= 0 && index < bucketCount) previous[index] += 1;
    }
  });

  return {
    labels,
    current,
    previous,
    currentLabel: range.label,
    previousLabel: range.comparisonLabel.replace(/^./, (letter) => letter.toUpperCase()),
  };
};

/*
  GET /api/dashboard?range=week|month|year

  The dashboard is protected because it exposes business-wide booking and
  payment totals. The range controls the metrics, chart and status split;
  recent bookings always show the latest activity.
*/
exports.getDashboard = async (req, res) => {
  try {
    const range = getRange(req.query.range);
    const currentBookingMatch = {
      createdAt: { $gte: range.currentStart, $lt: range.currentEnd },
    };
    const previousBookingMatch = {
      createdAt: { $gte: range.previousStart, $lt: range.previousEnd },
    };
    const currentPaymentMatch = {
      paymentDate: { $gte: range.currentStart, $lt: range.currentEnd },
    };
    const previousPaymentMatch = {
      paymentDate: { $gte: range.previousStart, $lt: range.previousEnd },
    };

    const [
      totalBookings,
      previousBookings,
      totalRevenue,
      previousRevenue,
      totalVehicles,
      vehiclesAdded,
      activeBookings,
      confirmedBookings,
      ongoingBookings,
      statusGroups,
      chartBookings,
      recentBookings,
    ] = await Promise.all([
      Booking.countDocuments(currentBookingMatch),
      Booking.countDocuments(previousBookingMatch),
      sumSuccessfulPayments(currentPaymentMatch),
      sumSuccessfulPayments(previousPaymentMatch),
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ createdAt: currentBookingMatch.createdAt }),
      Booking.countDocuments({ status: { $in: ["Confirmed", "Ongoing"] } }),
      Booking.countDocuments({ status: "Confirmed" }),
      Booking.countDocuments({ status: "Ongoing" }),
      Booking.aggregate([
        { $match: currentBookingMatch },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Booking.find({
        createdAt: { $gte: range.previousStart, $lt: range.currentEnd },
      })
        .select("createdAt")
        .lean(),
      Booking.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({ path: "vehicle", model: "Listing" })
        .lean(),
    ]);

    const statusCounts = new Map(statusGroups.map((item) => [item._id, item.count]));
    const statusDistribution = BOOKING_STATUSES.map((status) => {
      const count = statusCounts.get(status) || 0;
      return {
        status,
        count,
        pct: totalBookings ? Number(((count / totalBookings) * 100).toFixed(1)) : 0,
      };
    });

    return res.status(200).json({
      success: true,
      period: {
        key: range.key,
        label: range.label,
        comparisonLabel: range.comparisonLabel,
      },
      stats: {
        totalBookings: {
          value: totalBookings,
          comparison: getComparison(totalBookings, previousBookings),
        },
        totalRevenue: {
          value: totalRevenue,
          comparison: getComparison(totalRevenue, previousRevenue),
        },
        totalVehicles: {
          value: totalVehicles,
          added: vehiclesAdded,
        },
        activeBookings: {
          value: activeBookings,
          confirmed: confirmedBookings,
          ongoing: ongoingBookings,
        },
      },
      chart: buildChart(range, chartBookings),
      statusDistribution,
      recentBookings: recentBookings.map(serializeBooking),
    });
  } catch (error) {
    console.error("GET DASHBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard data.",
    });
  }
};
