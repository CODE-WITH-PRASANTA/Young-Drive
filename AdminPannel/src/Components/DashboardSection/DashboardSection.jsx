import React, { useState, useRef, useEffect, useMemo } from "react";
import "./DashboardSection.css";

/* ------------------------------------------------------------------ */
/*  Icons                                                             */
/* ------------------------------------------------------------------ */
const Icon = {
  eye: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  moreVertical: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="5" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <circle cx="12" cy="19" r="1.8" fill="currentColor" />
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
  close: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  edit: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  invoice: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 2h9l5 5v15H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M15 2v5h5M9 13h6M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  cancel: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Data & Meta                                                       */
/* ------------------------------------------------------------------ */
const STATUS_META = {
  Confirmed: "green",
  Ongoing: "blue",
  Completed: "purple",
  Pending: "orange",
  Cancelled: "red",
};

const PAYMENT_META = {
  Paid: "green",
  Unpaid: "red",
  Refunded: "gray",
};

const AVATAR_PALETTE = ["#f97066", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f472b6", "#38bdf8"];

const INITIAL_BOOKINGS = [
  {
    id: "#BK2489",
    customer: { name: "John Smith", email: "john.smith@email.com" },
    vehicle: { name: "Audi A3 1.6 TDI S line", color: "White" },
    pickup: { date: "May 18, 2025", time: "10:00 AM" },
    ret: { date: "May 22, 2025", time: "10:00 AM" },
    amount: "$498.25",
    status: "Confirmed",
    payment: "Paid",
  },
  {
    id: "#BK2488",
    customer: { name: "Sarah Johnson", email: "sarah.j@email.com" },
    vehicle: { name: "Mercedes-Benz C220d", color: "Silver" },
    pickup: { date: "May 18, 2025", time: "02:00 PM" },
    ret: { date: "May 21, 2025", time: "02:00 PM" },
    amount: "$525.50",
    status: "Ongoing",
    payment: "Paid",
  },
  {
    id: "#BK2487",
    customer: { name: "Michael Brown", email: "michael.b@email.com" },
    vehicle: { name: "Volkswagen Golf GTD", color: "Gray" },
    pickup: { date: "May 17, 2025", time: "09:00 AM" },
    ret: { date: "May 20, 2025", time: "09:00 AM" },
    amount: "$450.75",
    status: "Completed",
    payment: "Paid",
  },
  {
    id: "#BK2486",
    customer: { name: "David Wilson", email: "david.w@email.com" },
    vehicle: { name: "Volvo S60 D4 R-Design", color: "Black" },
    pickup: { date: "May 17, 2025", time: "11:00 AM" },
    ret: { date: "May 19, 2025", time: "11:00 AM" },
    amount: "$480.00",
    status: "Confirmed",
    payment: "Unpaid",
  },
  {
    id: "#BK2485",
    customer: { name: "Emma Davis", email: "emma.d@email.com" },
    vehicle: { name: "Jaguar XE 2.0d R-Sport", color: "Blue" },
    pickup: { date: "May 17, 2025", time: "01:00 PM" },
    ret: { date: "May 23, 2025", time: "01:00 PM" },
    amount: "$575.25",
    status: "Pending",
    payment: "Unpaid",
  },
  {
    id: "#BK2484",
    customer: { name: "Olivia Taylor", email: "olivia.t@email.com" },
    vehicle: { name: "BMW 3 Series 320d", color: "White" },
    pickup: { date: "May 16, 2025", time: "08:00 AM" },
    ret: { date: "May 18, 2025", time: "08:00 AM" },
    amount: "$410.00",
    status: "Completed",
    payment: "Paid",
  },
  {
    id: "#BK2483",
    customer: { name: "James Anderson", email: "james.a@email.com" },
    vehicle: { name: "Audi Q5 40 TDI", color: "Gray" },
    pickup: { date: "May 16, 2025", time: "03:00 PM" },
    ret: { date: "May 19, 2025", time: "03:00 PM" },
    amount: "$610.40",
    status: "Ongoing",
    payment: "Paid",
  },
  {
    id: "#BK2482",
    customer: { name: "Sophie Clark", email: "sophie.c@email.com" },
    vehicle: { name: "Ford Focus ST-Line", color: "Red" },
    pickup: { date: "May 15, 2025", time: "12:00 PM" },
    ret: { date: "May 17, 2025", time: "12:00 PM" },
    amount: "$305.00",
    status: "Cancelled",
    payment: "Refunded",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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
/*  UI Components                                                     */
/* ------------------------------------------------------------------ */
function Avatar({ name, index }) {
  const color = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
  return (
    <span className="avatar" style={{ backgroundColor: color }}>
      {initials(name)}
    </span>
  );
}

function StatusBadge({ status }) {
  return <span className={`badge badge--${STATUS_META[status] || "gray"}`}>{status}</span>;
}

function PaymentBadge({ payment }) {
  return <span className={`badge badge--${PAYMENT_META[payment] || "gray"}`}>{payment}</span>;
}

/* ------------------------------------------------------------------ */
/*  3-Dot Action Menu (Fixed Dropdown Positioning & Handler)          */
/* ------------------------------------------------------------------ */
function ActionMenu({ booking, onView, onEdit, onInvoice, onCancel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const handleAction = (e, actionFn) => {
    e.stopPropagation();
    if (typeof actionFn === "function") {
      actionFn(booking);
    }
    setTimeout(() => setOpen(false), 0);
  };

  return (
    <div className="action-menu" ref={ref}>
      <button
        type="button"
        className="action-menu__trigger"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More actions"
      >
        <Icon.moreVertical className="action-menu__icon" />
      </button>

      {open && (
        <ul className="action-menu__popover" role="menu">
          <li role="none">
            <button type="button" role="menuitem" onClick={(e) => handleAction(e, onView)}>
              <Icon.eye className="action-menu__item-icon" />
              View Details
            </button>
          </li>
          <li role="none">
            <button type="button" role="menuitem" onClick={(e) => handleAction(e, onEdit)}>
              <Icon.edit className="action-menu__item-icon" />
              Edit Booking
            </button>
          </li>
          <li role="none">
            <button type="button" role="menuitem" onClick={(e) => handleAction(e, onInvoice)}>
              <Icon.invoice className="action-menu__item-icon" />
              Download Invoice
            </button>
          </li>
          <li role="none" className="action-menu__divider" />
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="action-menu__item--danger"
              disabled={booking.status === "Cancelled"}
              onClick={(e) => handleAction(e, onCancel)}
            >
              <Icon.cancel className="action-menu__item-icon" />
              {booking.status === "Cancelled" ? "Already Cancelled" : "Cancel Booking"}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  View Details Modal                                                */
/* ------------------------------------------------------------------ */
function BookingModal({ booking, onClose, onEdit }) {
  if (!booking) return null;

  return (
    <div className="booking-modal__overlay" onMouseDown={onClose}>
      <div className="booking-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="booking-modal__header">
          <h3 className="booking-modal__title">Booking {booking.id}</h3>
          <button type="button" className="booking-modal__close" onClick={onClose} aria-label="Close">
            <Icon.close className="booking-modal__close-icon" />
          </button>
        </header>

        <div className="booking-modal__body">
          <div className="booking-modal__row">
            <span className="booking-modal__label">Customer</span>
            <div className="booking-modal__customer">
              <Avatar name={booking.customer.name} index={0} />
              <div>
                <p className="booking-modal__value">{booking.customer.name}</p>
                <p className="booking-modal__sub">{booking.customer.email}</p>
              </div>
            </div>
          </div>

          <div className="booking-modal__row">
            <span className="booking-modal__label">Vehicle</span>
            <p className="booking-modal__value">
              {booking.vehicle.name} <span className="booking-modal__sub">({booking.vehicle.color})</span>
            </p>
          </div>

          <div className="booking-modal__grid">
            <div className="booking-modal__row">
              <span className="booking-modal__label">Pickup</span>
              <p className="booking-modal__value">{booking.pickup.date}</p>
              <p className="booking-modal__sub">{booking.pickup.time}</p>
            </div>
            <div className="booking-modal__row">
              <span className="booking-modal__label">Return</span>
              <p className="booking-modal__value">{booking.ret.date}</p>
              <p className="booking-modal__sub">{booking.ret.time}</p>
            </div>
          </div>

          <div className="booking-modal__grid">
            <div className="booking-modal__row">
              <span className="booking-modal__label">Amount</span>
              <p className="booking-modal__value booking-modal__value--strong">{booking.amount}</p>
            </div>
            <div className="booking-modal__row">
              <span className="booking-modal__label">Status</span>
              <StatusBadge status={booking.status} />
            </div>
            <div className="booking-modal__row">
              <span className="booking-modal__label">Payment</span>
              <PaymentBadge payment={booking.payment} />
            </div>
          </div>
        </div>

        <footer className="booking-modal__footer">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              onClose();
              onEdit(booking);
            }}
          >
            Edit Booking
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Edit Booking Modal                                                */
/* ------------------------------------------------------------------ */
function EditModal({ booking, onClose, onSave }) {
  if (!booking) return null;

  const [formData, setFormData] = useState({
    status: booking.status,
    payment: booking.payment,
    amount: booking.amount,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(booking.id, formData);
    onClose();
  };

  return (
    <div className="booking-modal__overlay" onMouseDown={onClose}>
      <div className="booking-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="booking-modal__header">
          <h3 className="booking-modal__title">Edit Booking {booking.id}</h3>
          <button type="button" className="booking-modal__close" onClick={onClose} aria-label="Close">
            <Icon.close className="booking-modal__close-icon" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="booking-modal__body">
            <div className="booking-modal__row">
              <label className="booking-modal__label">Booking Status</label>
              <select
                className="edit-modal__select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="booking-modal__row">
              <label className="booking-modal__label">Payment Status</label>
              <select
                className="edit-modal__select"
                value={formData.payment}
                onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="booking-modal__row">
              <label className="booking-modal__label">Amount</label>
              <input
                type="text"
                className="edit-modal__input"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </div>

          <footer className="booking-modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Save Changes
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Booking Row                                                       */
/* ------------------------------------------------------------------ */
function BookingRow({ booking, index, onView, onEdit, onInvoice, onCancel }) {
  return (
    <tr className="booking-row">
      <td className="cell cell--id" data-label="Booking ID">
        <span className="booking-id">{booking.id}</span>
      </td>

      <td className="cell cell--customer" data-label="Customer">
        <div className="customer-cell">
          <Avatar name={booking.customer.name} index={index} />
          <div className="customer-cell__info">
            <p className="customer-cell__name">{booking.customer.name}</p>
            <p className="customer-cell__email">{booking.customer.email}</p>
          </div>
        </div>
      </td>

      <td className="cell cell--vehicle" data-label="Vehicle">
        <div className="vehicle-cell">
          <span className="vehicle-cell__thumb">
            <Icon.car className="vehicle-cell__icon" />
          </span>
          <div className="vehicle-cell__info">
            <p className="vehicle-cell__name">{booking.vehicle.name}</p>
            <p className="vehicle-cell__color">{booking.vehicle.color}</p>
          </div>
        </div>
      </td>

      <td className="cell cell--date" data-label="Pickup Date">
        <p className="date-cell__date">{booking.pickup.date}</p>
        <p className="date-cell__time">{booking.pickup.time}</p>
      </td>

      <td className="cell cell--date" data-label="Return Date">
        <p className="date-cell__date">{booking.ret.date}</p>
        <p className="date-cell__time">{booking.ret.time}</p>
      </td>

      <td className="cell cell--amount" data-label="Amount">
        <span className="amount-cell">{booking.amount}</span>
      </td>

      <td className="cell cell--status" data-label="Status">
        <StatusBadge status={booking.status} />
      </td>

      <td className="cell cell--payment" data-label="Payment">
        <PaymentBadge payment={booking.payment} />
      </td>

      <td className="cell cell--action" data-label="Action">
        <div className="action-cell">
          <button
            type="button"
            className="icon-btn icon-btn--view"
            onClick={() => onView(booking)}
            aria-label={`View booking ${booking.id}`}
          >
            <Icon.eye className="icon-btn__icon" />
          </button>
          <ActionMenu
            booking={booking}
            onView={onView}
            onEdit={onEdit}
            onInvoice={onInvoice}
            onCancel={onCancel}
          />
        </div>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */
const DashboardSection = () => {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [showAll, setShowAll] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [toast, setToast] = useState(null);

  const visibleBookings = useMemo(() => (showAll ? bookings : bookings.slice(0, 5)), [showAll, bookings]);

  const flash = (message) => {
    setToast(message);
    window.clearTimeout(flash._t);
    flash._t = window.setTimeout(() => setToast(null), 2500);
  };

  const handleView = (booking) => setViewBooking(booking);
  const handleEdit = (booking) => setEditBooking(booking);

  const handleSaveEdit = (bookingId, updatedData) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, ...updatedData } : b))
    );
    flash(`Updated booking ${bookingId} successfully`);
  };

  const handleInvoice = (booking) => {
    // Generate text file download
    const invoiceContent = `INVOICE FOR BOOKING ${booking.id}\n-----------------------------------\nCustomer: ${booking.customer.name} (${booking.customer.email})\nVehicle: ${booking.vehicle.name} (${booking.vehicle.color})\nPickup: ${booking.pickup.date} at ${booking.pickup.time}\nReturn: ${booking.ret.date} at ${booking.ret.time}\nTotal Amount: ${booking.amount}\nStatus: ${booking.status}\nPayment: ${booking.payment}\n`;

    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${booking.id.replace("#", "")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    flash(`Downloading Invoice for ${booking.id}`);
  };

  const handleCancel = (booking) => {
    if (window.confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? { ...b, status: "Cancelled", payment: b.payment === "Paid" ? "Refunded" : "Unpaid" }
            : b
        )
      );
      flash(`Booking ${booking.id} has been cancelled.`);
    }
  };

  return (
    <section className="bookings-table">
      <header className="bookings-table__header">
        <h2 className="bookings-table__title">Recent Bookings</h2>
        <button type="button" className="bookings-table__view-all" onClick={() => setShowAll((s) => !s)}>
          {showAll ? "Show Less" : "View All Bookings"}
        </button>
      </header>

      <div className="bookings-table__scroll">
        <table className="bookings-table__table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Pickup Date</th>
              <th>Return Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleBookings.map((booking, i) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                index={i}
                onView={handleView}
                onEdit={handleEdit}
                onInvoice={handleInvoice}
                onCancel={handleCancel}
              />
            ))}
          </tbody>
        </table>
      </div>

      {visibleBookings.length === 0 && <p className="bookings-table__empty">No bookings found.</p>}

      {/* View Details Modal */}
      <BookingModal
        booking={viewBooking}
        onClose={() => setViewBooking(null)}
        onEdit={handleEdit}
      />

      {/* Edit Booking Modal */}
      <EditModal
        booking={editBooking}
        onClose={() => setEditBooking(null)}
        onSave={handleSaveEdit}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </section>
  );
};

export default DashboardSection;