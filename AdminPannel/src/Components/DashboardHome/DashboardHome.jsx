import React, { useState, useRef, useEffect, useMemo } from "react";
import "./DashboardHome.css";

/* ------------------------------------------------------------------ */
/*  Icons                                                             */
/* ------------------------------------------------------------------ */
const Icon = {
  users: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  calendarCheck: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 15l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  car: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.5" y="11" width="19" height="6" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="17.5" r="1.6" fill="currentColor" />
      <circle cx="17" cy="17.5" r="1.6" fill="currentColor" />
    </svg>
  ),
  chevronDown: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowUp: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dash: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Static Data                                                       */
/* ------------------------------------------------------------------ */
const STATS = [
  { key: "bookings", label: "Total Bookings", value: "128", change: "18.5% vs last week", trend: "up", icon: "users", tone: "red" },
  { key: "revenue", label: "Total Revenue", value: "$48,560", change: "24.7% vs last week", trend: "up", icon: "calendar", tone: "blue" },
  { key: "vehicles", label: "Total Vehicles", value: "42", change: "+2 added this week", trend: "neutral", icon: "car", tone: "green" },
  { key: "active", label: "Active Bookings", value: "32", change: "12.3% vs last week", trend: "up", icon: "calendarCheck", tone: "purple" },
];

const DATE_RANGES = [
  "May 12 - May 18, 2025",
  "May 19 - May 25, 2025",
  "May 5 - May 11, 2025",
  "Apr 28 - May 4, 2025",
];

const CHART_PERIODS = {
  "This Week": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    current: [38, 48, 63, 50, 40, 60, 55],
    previous: [20, 35, 42, 30, 20, 42, 38],
    currentLabel: "This Week",
    previousLabel: "Last Week",
  },
  "This Month": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    current: [44, 58, 51, 66],
    previous: [30, 41, 36, 48],
    currentLabel: "This Month",
    previousLabel: "Last Month",
  },
  "This Year": {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    current: [52, 61, 47, 70],
    previous: [38, 45, 33, 55],
    currentLabel: "This Year",
    previousLabel: "Last Year",
  },
};

const STATUS_META = {
  Confirmed: { color: "#22c55e", tone: "green" },
  Ongoing: { color: "#3b82f6", tone: "blue" },
  Completed: { color: "#8b5cf6", tone: "purple" },
  Cancelled: { color: "#ef4444", tone: "red" },
  Pending: { color: "#f97316", tone: "orange" },
};

const DONUT_DATA = [
  { status: "Confirmed", count: 32, pct: 25 },
  { status: "Ongoing", count: 28, pct: 22 },
  { status: "Completed", count: 50, pct: 39 },
  { status: "Cancelled", count: 8, pct: 6 },
  { status: "Pending", count: 10, pct: 8 },
];

const BOOKINGS = [
  { id: 1, car: "Audi A3 1.6 TDI S line", customer: "John Smith", status: "Confirmed", date: "May 18, 2025" },
  { id: 2, car: "Mercedes-Benz C220d", customer: "Sarah Johnson", status: "Ongoing", date: "May 18, 2025" },
  { id: 3, car: "Volkswagen Golf GTD", customer: "Michael Brown", status: "Completed", date: "May 17, 2025" },
  { id: 4, car: "Volvo S60 D4 R-Design", customer: "David Wilson", status: "Confirmed", date: "May 17, 2025" },
  { id: 5, car: "Jaguar XE 2.0d R-Sport", customer: "Emma Davis", status: "Pending", date: "May 17, 2025" },
  { id: 6, car: "BMW 3 Series 320d", customer: "Olivia Taylor", status: "Completed", date: "May 16, 2025" },
  { id: 7, car: "Audi Q5 40 TDI", customer: "James Anderson", status: "Ongoing", date: "May 16, 2025" },
  { id: 8, car: "Ford Focus ST-Line", customer: "Sophie Clark", status: "Cancelled", date: "May 15, 2025" },
];

/* ------------------------------------------------------------------ */
/*  Utilities & Hooks                                                 */
/* ------------------------------------------------------------------ */
function useClickOutside(ref, onClose) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onClose]);
}

/* ------------------------------------------------------------------ */
/*  Stat Card Component                                               */
/* ------------------------------------------------------------------ */
function StatCard({ stat }) {
  const IconComp = Icon[stat.icon];
  const TrendIcon = stat.trend === "up" ? Icon.arrowUp : Icon.dash;
  return (
    <div className={`stat-card stat-card--${stat.tone}`}>
      <div className="stat-card__icon">
        <IconComp className="stat-card__icon-svg" />
      </div>
      <div className="stat-card__content">
        <p className="stat-card__label">{stat.label}</p>
        <p className="stat-card__value">{stat.value}</p>
        <p className={`stat-card__change stat-card__change--${stat.trend}`}>
          <TrendIcon className="stat-card__change-icon" />
          <span>{stat.change}</span>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bookings Overview Chart                                           */
/* ------------------------------------------------------------------ */
function BookingsOverviewChart({ period, showCurrent, showPrevious }) {
  const data = CHART_PERIODS[period];
  const width = 600;
  const height = 240;
  const padTop = 16;
  const padBottom = 32;
  const padLeft = 32;
  const padRight = 16;
  const maxVal = 80;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const xFor = (i) => padLeft + (i / (data.labels.length - 1)) * plotW;
  const yFor = (v) => padTop + plotH - (v / maxVal) * plotH;

  const linePath = (arr) =>
    arr.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(v)}`).join(" ");

  const areaPath = (arr) => {
    const line = arr.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(v)}`).join(" ");
    return `${line} L ${xFor(arr.length - 1)} ${padTop + plotH} L ${xFor(0)} ${padTop + plotH} Z`;
  };

  const gridValues = [0, 20, 40, 60, 80];

  return (
    <svg
      className="overview-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Bookings trend comparison chart"
    >
      <defs>
        <linearGradient id="areaFillCurrent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridValues.map((v) => (
        <g key={v}>
          <line
            x1={padLeft}
            x2={width - padRight}
            y1={yFor(v)}
            y2={yFor(v)}
            className="overview-chart__grid-line"
          />
          <text x={padLeft - 8} y={yFor(v) + 4} textAnchor="end" className="overview-chart__axis-label">
            {v}
          </text>
        </g>
      ))}

      {data.labels.map((label, i) => (
        <text key={label} x={xFor(i)} y={height - 6} textAnchor="middle" className="overview-chart__axis-label">
          {label}
        </text>
      ))}

      {showCurrent && <path d={areaPath(data.current)} fill="url(#areaFillCurrent)" stroke="none" />}

      {showPrevious && (
        <path d={linePath(data.previous)} className="overview-chart__line overview-chart__line--previous" fill="none" />
      )}
      {showCurrent && (
        <path d={linePath(data.current)} className="overview-chart__line overview-chart__line--current" fill="none" />
      )}

      {showPrevious &&
        data.previous.map((v, i) => (
          <circle key={`p-${i}`} cx={xFor(i)} cy={yFor(v)} r="3.5" className="overview-chart__dot overview-chart__dot--previous" />
        ))}
      {showCurrent &&
        data.current.map((v, i) => (
          <circle key={`c-${i}`} cx={xFor(i)} cy={yFor(v)} r="3.5" className="overview-chart__dot overview-chart__dot--current" />
        ))}
    </svg>
  );
}

function BookingsOverview() {
  const [period, setPeriod] = useState("This Week");
  const [showCurrent, setShowCurrent] = useState(true);
  const [showPrevious, setShowPrevious] = useState(true);
  const [periodOpen, setPeriodOpen] = useState(false);
  const periodRef = useRef(null);
  useClickOutside(periodRef, () => setPeriodOpen(false));

  const data = CHART_PERIODS[period];

  return (
    <section className="card bookings-overview">
      <header className="bookings-overview__header">
        <h2 className="card__title">Bookings Overview</h2>

        <div className="dropdown" ref={periodRef}>
          <button
            type="button"
            className="dropdown__trigger"
            onClick={() => setPeriodOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={periodOpen}
          >
            {period}
            <Icon.chevronDown className={`dropdown__chevron ${periodOpen ? "dropdown__chevron--open" : ""}`} />
          </button>
          {periodOpen && (
            <ul className="dropdown__menu dropdown__menu--right" role="listbox">
              {Object.keys(CHART_PERIODS).map((opt) => (
                <li key={opt} role="option" aria-selected={opt === period}>
                  <button
                    type="button"
                    className={`dropdown__option ${opt === period ? "dropdown__option--active" : ""}`}
                    onClick={() => {
                      setPeriod(opt);
                      setPeriodOpen(false);
                    }}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <div className="bookings-overview__legend">
        <button
          type="button"
          className={`legend-toggle legend-toggle--current ${showCurrent ? "" : "legend-toggle--off"}`}
          onClick={() => setShowCurrent((s) => !s)}
          aria-pressed={showCurrent}
        >
          <span className="legend-toggle__dot" />
          {data.currentLabel}
        </button>
        <button
          type="button"
          className={`legend-toggle legend-toggle--previous ${showPrevious ? "" : "legend-toggle--off"}`}
          onClick={() => setShowPrevious((s) => !s)}
          aria-pressed={showPrevious}
        >
          <span className="legend-toggle__dot" />
          {data.previousLabel}
        </button>
      </div>

      <div className="bookings-overview__chart">
        <BookingsOverviewChart period={period} showCurrent={showCurrent} showPrevious={showPrevious} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Donut Chart Component                                             */
/* ------------------------------------------------------------------ */
function DonutChart({ data, activeStatus, onSlice }) {
  const size = 180;
  const radius = 72;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  let cumulative = 0;

  const total = data.reduce((sum, d) => sum + d.pct, 0);

  return (
    <svg
      className="donut-chart__svg"
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Distribution of bookings by status"
    >
      <g transform={`rotate(-90 ${center} ${center})`}>
        {data.map((d) => {
          const dash = (d.pct / total) * circumference;
          const gap = circumference - dash;
          const offset = -((cumulative / total) * circumference);
          cumulative += d.pct;
          const isActive = activeStatus === d.status;
          const isDimmed = activeStatus && activeStatus !== d.status;
          return (
            <circle
              key={d.status}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={STATUS_META[d.status].color}
              strokeWidth={isActive ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={offset}
              className={`donut-chart__slice ${isDimmed ? "donut-chart__slice--dimmed" : ""}`}
              onClick={() => onSlice(d.status)}
            />
          );
        })}
      </g>
      <text x={center} y={center - 2} textAnchor="middle" className="donut-chart__center-value">
        {data.reduce((s, d) => s + d.count, 0)}
      </text>
      <text x={center} y={center + 16} textAnchor="middle" className="donut-chart__center-label">
        Total
      </text>
    </svg>
  );
}

function BookingsByStatus({ activeStatus, setActiveStatus }) {
  const toggle = (status) => setActiveStatus((cur) => (cur === status ? null : status));

  return (
    <section className="card bookings-status">
      <header className="bookings-status__header">
        <h2 className="card__title">Bookings by Status</h2>
      </header>

      <div className="bookings-status__body">
        <DonutChart data={DONUT_DATA} activeStatus={activeStatus} onSlice={toggle} />

        <ul className="donut-legend">
          {DONUT_DATA.map((d) => (
            <li key={d.status}>
              <button
                type="button"
                className={`donut-legend__item ${activeStatus === d.status ? "donut-legend__item--active" : ""}`}
                onClick={() => toggle(d.status)}
                aria-pressed={activeStatus === d.status}
              >
                <span className="donut-legend__dot" style={{ backgroundColor: STATUS_META[d.status].color }} />
                <span className="donut-legend__text">
                  <span className="donut-legend__status">{d.status}</span>
                  <span className="donut-legend__meta">
                    {d.count} ({d.pct}%)
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {activeStatus && (
        <button type="button" className="bookings-status__clear" onClick={() => setActiveStatus(null)}>
          Clear filter
        </button>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent Bookings Component                                         */
/* ------------------------------------------------------------------ */
function RecentBookings({ activeStatus, setActiveStatus }) {
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const list = activeStatus ? BOOKINGS.filter((b) => b.status === activeStatus) : BOOKINGS;
    return showAll ? list : list.slice(0, 5);
  }, [activeStatus, showAll]);

  return (
    <section className="card recent-bookings">
      <header className="recent-bookings__header">
        <h2 className="card__title">Recent Bookings</h2>
        <button type="button" className="recent-bookings__view-all" onClick={() => setShowAll((s) => !s)}>
          {showAll ? "Show Less" : "View All"}
        </button>
      </header>

      {activeStatus && (
        <div className="recent-bookings__filter-chip">
          <span>Filtered by <strong>{activeStatus}</strong></span>
          <button type="button" onClick={() => setActiveStatus(null)} aria-label="Clear status filter">
            ×
          </button>
        </div>
      )}

      <ul className="recent-bookings__list">
        {filtered.length === 0 && <li className="recent-bookings__empty">No bookings match this filter.</li>}
        {filtered.map((b) => (
          <li key={b.id} className="booking-item">
            <div className="booking-item__thumb">
              <Icon.car className="booking-item__thumb-icon" />
            </div>
            <div className="booking-item__info">
              <p className="booking-item__car">{b.car}</p>
              <p className="booking-item__customer">{b.customer}</p>
            </div>
            <div className="booking-item__meta">
              <span className={`status-badge status-badge--${STATUS_META[b.status].tone}`}>{b.status}</span>
              <span className="booking-item__date">{b.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Header Component                                        */
/* ------------------------------------------------------------------ */
function DashboardHeader({ dateRange, setDateRange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__titles">
        <h1 className="dashboard-header__title">Dashboard</h1>
        <p className="dashboard-header__subtitle">Overview of your car rental business</p>
      </div>

      <div className="dropdown dropdown--date" ref={ref}>
        <button
          type="button"
          className="date-picker"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <Icon.calendar className="date-picker__icon" />
          <span>{dateRange}</span>
          <Icon.chevronDown className={`dropdown__chevron ${open ? "dropdown__chevron--open" : ""}`} />
        </button>
        {open && (
          <ul className="dropdown__menu dropdown__menu--right" role="listbox">
            {DATE_RANGES.map((range) => (
              <li key={range} role="option" aria-selected={range === dateRange}>
                <button
                  type="button"
                  className={`dropdown__option ${range === dateRange ? "dropdown__option--active" : ""}`}
                  onClick={() => {
                    setDateRange(range);
                    setOpen(false);
                  }}
                >
                  {range}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard Component                                          */
/* ------------------------------------------------------------------ */
const DashboardHome = () => {
  const [dateRange, setDateRange] = useState(DATE_RANGES[0]);
  const [activeStatus, setActiveStatus] = useState(null);

  return (
    <div className="car-dashboard">
      <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />

      <section className="stats-grid">
        {STATS.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </section>

      <section className="dashboard-grid">
        <BookingsOverview />
        <BookingsByStatus activeStatus={activeStatus} setActiveStatus={setActiveStatus} />
        <RecentBookings activeStatus={activeStatus} setActiveStatus={setActiveStatus} />
      </section>
    </div>
  );
};

export default DashboardHome;