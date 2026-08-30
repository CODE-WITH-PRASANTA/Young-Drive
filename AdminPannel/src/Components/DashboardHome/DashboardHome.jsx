import { useEffect, useMemo, useRef, useState } from "react";
import "./DashboardHome.css";

const Icon = {
  users: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
      <path d="M16 2v4M8 2v4M3 10h18M9 15l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  arrowDown: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 5v14m7-7-7 7-7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dash: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
};

const PERIODS = [
  { key: "week", label: "Last 7 Days" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
];

const STATUS_META = {
  Confirmed: { color: "#22c55e", tone: "green" },
  Ongoing: { color: "#3b82f6", tone: "blue" },
  Completed: { color: "#8b5cf6", tone: "purple" },
  Cancelled: { color: "#ef4444", tone: "red" },
  Pending: { color: "#f97316", tone: "orange" },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
}

function StatCard({ stat }) {
  const IconComp = Icon[stat.icon];
  const TrendIcon = stat.trend === "up" ? Icon.arrowUp : stat.trend === "down" ? Icon.arrowDown : Icon.dash;

  return (
    <div className={`stat-card stat-card--${stat.tone}`}>
      <div className="stat-card__icon"><IconComp className="stat-card__icon-svg" /></div>
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

function BookingsOverviewChart({ chart, showCurrent, showPrevious }) {
  const labels = chart?.labels || [];
  const current = chart?.current || [];
  const previous = chart?.previous || [];
  const width = 600;
  const height = 240;
  const padTop = 16;
  const padBottom = 32;
  const padLeft = 32;
  const padRight = 16;
  const maxDataValue = Math.max(1, ...current, ...previous);
  const maxVal = Math.max(5, Math.ceil(maxDataValue / 5) * 5);
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const points = Math.max(labels.length, 1);
  const xFor = (index) => padLeft + (points === 1 ? plotW / 2 : (index / (points - 1)) * plotW);
  const yFor = (value) => padTop + plotH - ((Number(value) || 0) / maxVal) * plotH;
  const linePath = (values) => values.map((value, index) => `${index === 0 ? "M" : "L"} ${xFor(index)} ${yFor(value)}`).join(" ");
  const areaPath = (values) => `${linePath(values)} L ${xFor(values.length - 1)} ${padTop + plotH} L ${xFor(0)} ${padTop + plotH} Z`;
  const gridValues = Array.from({ length: 5 }, (_, index) => (maxVal / 4) * index);

  if (!labels.length) return <p className="recent-bookings__empty">No booking activity for this period.</p>;

  return (
    <svg className="overview-chart__svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Bookings trend comparison chart">
      <defs>
        <linearGradient id="areaFillCurrent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridValues.map((value) => (
        <g key={value}>
          <line x1={padLeft} x2={width - padRight} y1={yFor(value)} y2={yFor(value)} className="overview-chart__grid-line" />
          <text x={padLeft - 8} y={yFor(value) + 4} textAnchor="end" className="overview-chart__axis-label">{Math.round(value)}</text>
        </g>
      ))}
      {labels.map((label, index) => <text key={`${label}-${index}`} x={xFor(index)} y={height - 6} textAnchor="middle" className="overview-chart__axis-label">{label}</text>)}
      {showCurrent && <path d={areaPath(current)} fill="url(#areaFillCurrent)" stroke="none" />}
      {showPrevious && <path d={linePath(previous)} className="overview-chart__line overview-chart__line--previous" fill="none" />}
      {showCurrent && <path d={linePath(current)} className="overview-chart__line overview-chart__line--current" fill="none" />}
      {showPrevious && previous.map((value, index) => <circle key={`previous-${index}`} cx={xFor(index)} cy={yFor(value)} r="3.5" className="overview-chart__dot overview-chart__dot--previous" />)}
      {showCurrent && current.map((value, index) => <circle key={`current-${index}`} cx={xFor(index)} cy={yFor(value)} r="3.5" className="overview-chart__dot overview-chart__dot--current" />)}
    </svg>
  );
}

function BookingsOverview({ chart, period, onPeriodChange }) {
  const [showCurrent, setShowCurrent] = useState(true);
  const [showPrevious, setShowPrevious] = useState(true);
  const [periodOpen, setPeriodOpen] = useState(false);
  const periodRef = useRef(null);
  useClickOutside(periodRef, () => setPeriodOpen(false));
  const selectedPeriod = PERIODS.find((item) => item.key === period)?.label || "Last 7 Days";

  return (
    <section className="card bookings-overview">
      <header className="bookings-overview__header">
        <h2 className="card__title">Bookings Overview</h2>
        <div className="dropdown" ref={periodRef}>
          <button type="button" className="dropdown__trigger" onClick={() => setPeriodOpen((open) => !open)} aria-haspopup="listbox" aria-expanded={periodOpen}>
            {selectedPeriod}<Icon.chevronDown className={`dropdown__chevron ${periodOpen ? "dropdown__chevron--open" : ""}`} />
          </button>
          {periodOpen && <ul className="dropdown__menu dropdown__menu--right" role="listbox">
            {PERIODS.map((option) => <li key={option.key} role="option" aria-selected={option.key === period}>
              <button type="button" className={`dropdown__option ${option.key === period ? "dropdown__option--active" : ""}`} onClick={() => { onPeriodChange(option.key); setPeriodOpen(false); }}>{option.label}</button>
            </li>)}
          </ul>}
        </div>
      </header>
      <div className="bookings-overview__legend">
        <button type="button" className={`legend-toggle legend-toggle--current ${showCurrent ? "" : "legend-toggle--off"}`} onClick={() => setShowCurrent((visible) => !visible)} aria-pressed={showCurrent}><span className="legend-toggle__dot" />{chart?.currentLabel || selectedPeriod}</button>
        <button type="button" className={`legend-toggle legend-toggle--previous ${showPrevious ? "" : "legend-toggle--off"}`} onClick={() => setShowPrevious((visible) => !visible)} aria-pressed={showPrevious}><span className="legend-toggle__dot" />{chart?.previousLabel || "Previous period"}</button>
      </div>
      <div className="bookings-overview__chart"><BookingsOverviewChart chart={chart} showCurrent={showCurrent} showPrevious={showPrevious} /></div>
    </section>
  );
}

function DonutChart({ data, activeStatus, onSlice }) {
  const size = 180;
  const radius = 72;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulative = 0;

  if (!total) return <p className="recent-bookings__empty">No bookings in this period.</p>;

  return (
    <svg className="donut-chart__svg" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Distribution of bookings by status">
      <g transform={`rotate(-90 ${center} ${center})`}>
        {data.map((item) => {
          const dash = (item.count / total) * circumference;
          const offset = -((cumulative / total) * circumference);
          cumulative += item.count;
          const isActive = activeStatus === item.status;
          const isDimmed = activeStatus && activeStatus !== item.status;
          return <circle key={item.status} cx={center} cy={center} r={radius} fill="none" stroke={STATUS_META[item.status]?.color || "#94a3b8"} strokeWidth={isActive ? strokeWidth + 4 : strokeWidth} strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={offset} className={`donut-chart__slice ${isDimmed ? "donut-chart__slice--dimmed" : ""}`} onClick={() => onSlice(item.status)} />;
        })}
      </g>
      <text x={center} y={center - 2} textAnchor="middle" className="donut-chart__center-value">{total}</text>
      <text x={center} y={center + 16} textAnchor="middle" className="donut-chart__center-label">Total</text>
    </svg>
  );
}

function BookingsByStatus({ data, activeStatus, setActiveStatus }) {
  const toggle = (status) => setActiveStatus((current) => (current === status ? null : status));
  return (
    <section className="card bookings-status">
      <header className="bookings-status__header"><h2 className="card__title">Bookings by Status</h2></header>
      <div className="bookings-status__body">
        <DonutChart data={data} activeStatus={activeStatus} onSlice={toggle} />
        <ul className="donut-legend">
          {data.map((item) => <li key={item.status}><button type="button" className={`donut-legend__item ${activeStatus === item.status ? "donut-legend__item--active" : ""}`} onClick={() => toggle(item.status)} aria-pressed={activeStatus === item.status}>
            <span className="donut-legend__dot" style={{ backgroundColor: STATUS_META[item.status]?.color || "#94a3b8" }} />
            <span className="donut-legend__text"><span className="donut-legend__status">{item.status}</span><span className="donut-legend__meta">{item.count} ({item.pct}%)</span></span>
          </button></li>)}
        </ul>
      </div>
      {activeStatus && <button type="button" className="bookings-status__clear" onClick={() => setActiveStatus(null)}>Clear filter</button>}
    </section>
  );
}

function RecentBookings({ bookings, activeStatus, setActiveStatus }) {
  const [showAll, setShowAll] = useState(false);
  const filtered = useMemo(() => {
    const matchingBookings = activeStatus ? bookings.filter((booking) => booking.status === activeStatus) : bookings;
    return showAll ? matchingBookings : matchingBookings.slice(0, 5);
  }, [activeStatus, bookings, showAll]);

  return (
    <section className="card recent-bookings">
      <header className="recent-bookings__header"><h2 className="card__title">Recent Bookings</h2><button type="button" className="recent-bookings__view-all" onClick={() => setShowAll((visible) => !visible)}>{showAll ? "Show Less" : "View All"}</button></header>
      {activeStatus && <div className="recent-bookings__filter-chip"><span>Filtered by <strong>{activeStatus}</strong></span><button type="button" onClick={() => setActiveStatus(null)} aria-label="Clear status filter">×</button></div>}
      <ul className="recent-bookings__list">
        {!filtered.length && <li className="recent-bookings__empty">No bookings match this filter.</li>}
        {filtered.map((booking) => <li key={booking._id} className="booking-item">
          <div className="booking-item__thumb"><Icon.car className="booking-item__thumb-icon" /></div>
          <div className="booking-item__info"><p className="booking-item__car">{booking.vehicleName}</p><p className="booking-item__customer">{booking.customerName}</p></div>
          <div className="booking-item__meta"><span className={`status-badge status-badge--${STATUS_META[booking.status]?.tone || "orange"}`}>{booking.status}</span><span className="booking-item__date">{formatDate(booking.pickupDate)}</span></div>
        </li>)}
      </ul>
    </section>
  );
}

function DashboardHeader({ period, onPeriodChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  const selectedPeriod = PERIODS.find((item) => item.key === period)?.label || "Last 7 Days";
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__titles"><h1 className="dashboard-header__title">Dashboard</h1><p className="dashboard-header__subtitle">Overview of your car rental business</p></div>
      <div className="dropdown dropdown--date" ref={ref}>
        <button type="button" className="date-picker" onClick={() => setOpen((visible) => !visible)} aria-haspopup="listbox" aria-expanded={open}><Icon.calendar className="date-picker__icon" /><span>{selectedPeriod}</span><Icon.chevronDown className={`dropdown__chevron ${open ? "dropdown__chevron--open" : ""}`} /></button>
        {open && <ul className="dropdown__menu dropdown__menu--right" role="listbox">{PERIODS.map((option) => <li key={option.key} role="option" aria-selected={option.key === period}><button type="button" className={`dropdown__option ${option.key === period ? "dropdown__option--active" : ""}`} onClick={() => { onPeriodChange(option.key); setOpen(false); }}>{option.label}</button></li>)}</ul>}
      </div>
    </header>
  );
}

const getComparisonText = (comparison, comparisonLabel) => {
  if (comparison?.percent === null) return comparison?.direction === "up" ? `New vs ${comparisonLabel}` : `No change vs ${comparisonLabel}`;
  return `${comparison?.percent || 0}% vs ${comparisonLabel}`;
};

const DashboardHome = ({ dashboard, period, onPeriodChange }) => {
  const [activeStatus, setActiveStatus] = useState(null);
  const stats = dashboard?.stats || {};
  const comparisonLabel = dashboard?.period?.comparisonLabel || "previous period";
  const statCards = [
    { key: "bookings", label: "Total Bookings", value: Number(stats.totalBookings?.value || 0).toLocaleString("en-IN"), change: getComparisonText(stats.totalBookings?.comparison, comparisonLabel), trend: stats.totalBookings?.comparison?.direction || "neutral", icon: "users", tone: "red" },
    { key: "revenue", label: "Total Revenue", value: formatCurrency(stats.totalRevenue?.value), change: getComparisonText(stats.totalRevenue?.comparison, comparisonLabel), trend: stats.totalRevenue?.comparison?.direction || "neutral", icon: "calendar", tone: "blue" },
    { key: "vehicles", label: "Total Vehicles", value: Number(stats.totalVehicles?.value || 0).toLocaleString("en-IN"), change: `${stats.totalVehicles?.added || 0} added this period`, trend: "neutral", icon: "car", tone: "green" },
    { key: "active", label: "Active Bookings", value: Number(stats.activeBookings?.value || 0).toLocaleString("en-IN"), change: `${stats.activeBookings?.confirmed || 0} confirmed · ${stats.activeBookings?.ongoing || 0} ongoing`, trend: "neutral", icon: "calendarCheck", tone: "purple" },
  ];

  return (
    <div className="car-dashboard">
      <DashboardHeader period={period} onPeriodChange={onPeriodChange} />
      <section className="stats-grid">{statCards.map((stat) => <StatCard key={stat.key} stat={stat} />)}</section>
      <section className="dashboard-grid">
        <BookingsOverview chart={dashboard?.chart} period={period} onPeriodChange={onPeriodChange} />
        <BookingsByStatus data={dashboard?.statusDistribution || []} activeStatus={activeStatus} setActiveStatus={setActiveStatus} />
        <RecentBookings bookings={dashboard?.recentBookings || []} activeStatus={activeStatus} setActiveStatus={setActiveStatus} />
      </section>
    </div>
  );
};

export default DashboardHome;
