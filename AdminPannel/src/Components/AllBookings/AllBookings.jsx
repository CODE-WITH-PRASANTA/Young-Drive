import React, { useState, useEffect } from "react";
import "./AllBookings.css";
import API from "../../api/axios";

import {
  FaCalendarAlt,
  FaDownload,
  FaPlus,
  FaSearch,
  FaEye,
  FaEllipsisV,
  FaTimes,
  FaCar,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaCalendarCheck,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const AllBookings = () => {
  /* =====================================================
     DATABASE STATE
  ===================================================== */

  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);

  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState("Details");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* =====================================================
     CANCELLATION SIDEBAR CONTROLS
  ===================================================== */

  const [showCancelBox, setShowCancelBox] = useState(false);

  const [cancellationReason, setCancellationReason] =
    useState("Select reason");

  const [cancellationComment, setCancellationComment] =
    useState("");

  /* =====================================================
     PAGINATION
  ===================================================== */

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  /* =====================================================
     NEW BOOKING FORM
  ===================================================== */

  const [newBooking, setNewBooking] = useState({
    customerName: "",
    email: "",
    phone: "",
    vehicle: "",
    pickupDate: "",
    returnDate: "",
    amount: "",
  });

  /* =====================================================
     DATE HELPERS
  ===================================================== */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDateInputValue = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const calculateDuration = (pickup, dropoff) => {
    if (!pickup || !dropoff) {
      return "";
    }

    const start = new Date(pickup);
    const end = new Date(dropoff);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return "";
    }

    const difference = end.getTime() - start.getTime();

    if (difference < 0) {
      return "";
    }

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    if (days === 1) {
      return "1 day";
    }

    return `${days} days`;
  };

  /* =====================================================
     INDIAN MONEY FORMAT
  ===================================================== */

  const formatIndianMoney = (amount) => {
    const value = Number(amount) || 0;

    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  /* =====================================================
     VEHICLE HELPERS
  ===================================================== */

  const getVehicleName = (vehicle) => {
    if (!vehicle) {
      return "Vehicle";
    }

    const brand =
      vehicle.vehicleBrand ||
      vehicle.brand ||
      vehicle.make ||
      "";

    const model =
      vehicle.vehicleModel ||
      vehicle.model ||
      "";

    const brandModel = [brand, model]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (brandModel) {
      return brandModel;
    }

    return (
      vehicle.name ||
      vehicle.title ||
      vehicle.vehicleName ||
      "Vehicle"
    );
  };

  const getVehicleImage = (vehicle) => {
    if (!vehicle) {
      return "";
    }

    if (
      vehicle.image &&
      typeof vehicle.image === "string"
    ) {
      return vehicle.image;
    }

    if (
      vehicle.imageUrl &&
      typeof vehicle.imageUrl === "string"
    ) {
      return vehicle.imageUrl;
    }

    if (
      Array.isArray(vehicle.images) &&
      vehicle.images.length > 0
    ) {
      return vehicle.images[0];
    }

    return "";
  };

  const getVehicleId = (vehicle) => {
    if (!vehicle) {
      return "";
    }

    return (
      vehicle._id ||
      vehicle.id ||
      vehicle.vehicleId ||
      ""
    );
  };

  /* =====================================================
     BOOKING ID HELPERS
  ===================================================== */

  const getBookingId = (booking) => {
    return (
      booking?.bookingId ||
      booking?.id ||
      booking?._id ||
      ""
    );
  };

  const getMongoBookingId = (booking) => {
    return (
      booking?._id ||
      booking?.mongoId ||
      ""
    );
  };

  /* =====================================================
     FETCH LISTINGS / VEHICLES
  ===================================================== */

  const fetchListings = async () => {
    try {
      const response = await API.get("/listings");

      console.log(
        "Listings response:",
        response.data
      );

      let listingData = [];

      if (
        response.data &&
        Array.isArray(response.data.data)
      ) {
        listingData = response.data.data;
      } else if (
        response.data &&
        Array.isArray(response.data.listings)
      ) {
        listingData = response.data.listings;
      } else if (
        response.data &&
        Array.isArray(response.data.results)
      ) {
        listingData = response.data.results;
      } else if (
        Array.isArray(response.data)
      ) {
        listingData = response.data;
      }

      setListings(listingData);

      if (
        listingData.length > 0 &&
        !newBooking.vehicle
      ) {
        const firstListing =
          listingData[0];

        setNewBooking((prev) => ({
          ...prev,
          vehicle:
            getVehicleId(firstListing),
        }));
      }
    } catch (error) {
      console.error(
        "Failed to fetch listings:",
        error
      );

      console.error(
        "Listings server response:",
        error?.response?.data
      );
    }
  };

  /* =====================================================
     FETCH BOOKINGS FROM BACKEND
  ===================================================== */

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const params = {};

      if (activeTab !== "All") {
        params.status = activeTab;
      }

      if (searchTerm.trim()) {
        params.search =
          searchTerm.trim();
      }

      console.log(
        "Fetching bookings:",
        params
      );

      const response = await API.get(
        "/bookings",
        {
          params,
        }
      );

      console.log(
        "Bookings response:",
        response.data
      );

      let bookingData = [];

      if (
        response.data &&
        Array.isArray(response.data.data)
      ) {
        bookingData =
          response.data.data;
      } else if (
        response.data &&
        Array.isArray(response.data.bookings)
      ) {
        bookingData =
          response.data.bookings;
      } else if (
        Array.isArray(response.data)
      ) {
        bookingData =
          response.data;
      }

      setBookings(bookingData);

      if (selectedBooking) {
        const selectedId =
          getMongoBookingId(
            selectedBooking
          ) ||
          getBookingId(
            selectedBooking
          );

        const updatedBooking =
          bookingData.find(
            (booking) => {
              const mongoId =
                getMongoBookingId(
                  booking
                );

              const displayId =
                getBookingId(
                  booking
                );

              return (
                String(mongoId) ===
                  String(selectedId) ||
                String(displayId) ===
                  String(selectedId)
              );
            }
          );

        if (updatedBooking) {
          setSelectedBooking(
            updatedBooking
          );
        } else {
          setSelectedBooking(null);
        }
      }
    } catch (error) {
      console.error(
        "Failed to fetch bookings:",
        error
      );

      console.error(
        "Server response:",
        error?.response?.data
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchListings();
  }, []);

  /* =====================================================
     FETCH BOOKINGS WHEN FILTER / SEARCH CHANGES
  ===================================================== */

  useEffect(() => {
    fetchBookings();
  }, [
    activeTab,
    searchTerm,
  ]);

  /* =====================================================
     TOTAL REVENUE
  ===================================================== */

  const calculateTotalRevenue = (bookingList) => {
    const total = bookingList.reduce(
      (sum, item) => {
        const numericVal =
          parseFloat(
            String(item.amount ?? 0).replace(
              /[^0-9.-]+/g,
              ""
            )
          ) || 0;

        return sum + numericVal;
      },
      0
    );

    return formatIndianMoney(total);
  };

  /* =====================================================
     CLIENT-SIDE FILTER
  ===================================================== */

  const filteredBookings =
    bookings.filter((booking) => {
      const bookingStatus =
        booking.status ||
        "Pending";

      const matchesTab =
        activeTab === "All" ||
        bookingStatus.toLowerCase() ===
          activeTab.toLowerCase();

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return matchesTab;
      }

      const bookingId =
        String(
          booking.bookingId ||
            booking.id ||
            booking._id ||
            ""
        ).toLowerCase();

      const customerName =
        String(
          booking.customer?.name ||
            booking.customerName ||
            ""
        ).toLowerCase();

      const customerEmail =
        String(
          booking.customer?.email ||
            booking.email ||
            ""
        ).toLowerCase();

      const customerPhone =
        String(
          booking.customer?.phone ||
            booking.phone ||
            ""
        ).toLowerCase();

      const vehicleName =
        String(
          booking.vehicleName ||
            getVehicleName(
              booking.vehicle
            ) ||
            ""
        ).toLowerCase();

      return (
        matchesTab &&
        (
          bookingId.includes(search) ||
          customerName.includes(search) ||
          customerEmail.includes(search) ||
          customerPhone.includes(search) ||
          vehicleName.includes(search)
        )
      );
    });

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages =
    Math.ceil(
      filteredBookings.length /
        itemsPerPage
    ) || 1;

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const currentDisplayedBookings =
    filteredBookings.slice(
      startIndex,
      startIndex +
        itemsPerPage
    );

  const handlePageChange = (
    page
  ) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);
    }
  };

  /* =====================================================
     TAB CHANGE
  ===================================================== */

  const handleTabChange = (
    tab
  ) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setActiveMenuId(null);
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearchChange = (
    e
  ) => {
    setSearchTerm(
      e.target.value
    );

    setCurrentPage(1);
  };

  /* =====================================================
     EXPORT CSV
  ===================================================== */

  const handleExportCSV = () => {
    if (
      filteredBookings.length === 0
    ) {
      alert(
        "No booking records available to export."
      );

      return;
    }

    const headers =
      [
        "Booking ID",
        "Date",
        "Customer Name",
        "Email",
        "Phone",
        "Vehicle",
        "Pickup",
        "Return",
        "Amount",
        "Payment Status",
        "Status",
      ].join(",") +
      "\n";

    const rows =
      filteredBookings.map(
        (booking) => {
          const id =
            getBookingId(
              booking
            );

          const customerName =
            booking.customer
              ?.name ||
            booking.customerName ||
            "";

          const email =
            booking.customer
              ?.email ||
            booking.email ||
            "";

          const phone =
            booking.customer
              ?.phone ||
            booking.phone ||
            "";

          const vehicle =
            booking.vehicleName ||
            getVehicleName(
              booking.vehicle
            );

          const pickup =
            booking.pickupDate ||
            "";

          const returnDate =
            booking.returnDate ||
            booking.dropoffDate ||
            "";

          const amount =
            booking.amount ??
            "";

          const paymentStatus =
            booking.paymentStatus ||
            "Unpaid";

          const status =
            booking.status ||
            "Pending";

          const date =
            booking.bookingDate ||
            booking.createdAt ||
            "";

          return [
            id,
            formatDateTime(date),
            customerName,
            email,
            phone,
            vehicle,
            formatDate(pickup),
            formatDate(returnDate),
            formatIndianMoney(amount),
            paymentStatus,
            status,
          ]
            .map(
              (value) =>
                `"${String(value).replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",");
        }
      );

    const blob =
      new Blob(
        [
          headers +
            rows.join("\n"),
        ],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download =
      `YoungDrive_Bookings_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(
      url
    );
  };

  /* =====================================================
     TOGGLE ACTION MENU
  ===================================================== */

  const toggleMenu = (
    id,
    e
  ) => {
    e.stopPropagation();

    setActiveMenuId(
      activeMenuId === id
        ? null
        : id
    );
  };

  /* =====================================================
     OPEN BOOKING DETAILS
  ===================================================== */

  const handleViewBooking = (
    booking
  ) => {
    setSelectedBooking(
      booking
    );

    setActiveDetailsTab(
      "Details"
    );

    setShowCancelBox(false);

    setCancellationReason(
      "Select reason"
    );

    setCancellationComment("");

    setActiveMenuId(null);
  };

  /* =====================================================
     UPDATE BOOKING STATUS
  ===================================================== */

  const handleStatusChange =
    async (
      id,
      newStatus,
      reason = "",
      comment = ""
    ) => {
      try {
        setSaving(true);

        setActiveMenuId(null);

        const payload = {
          status: newStatus,
        };

        if (reason) {
          payload.cancellationReason =
            reason;
        }

        if (comment) {
          payload.cancellationComment =
            comment;
        }

        console.log(
          "Updating booking status:",
          id,
          payload
        );

        const response =
          await API.put(
            `/bookings/${encodeURIComponent(
              id
            )}/status`,
            payload
          );

        console.log(
          "Status update response:",
          response.data
        );

        if (
          response.data?.success
        ) {
          const updatedBooking =
            response.data.data;

          setBookings(
            (previous) =>
              previous.map(
                (booking) => {
                  const mongoId =
                    getMongoBookingId(
                      booking
                    );

                  return String(
                    mongoId
                  ) === String(id)
                    ? {
                        ...booking,
                        ...(updatedBooking ||
                          {}),
                        status:
                          newStatus,
                      }
                    : booking;
                }
              )
          );

          if (
            selectedBooking &&
            String(
              getMongoBookingId(
                selectedBooking
              )
            ) ===
              String(id)
          ) {
            setSelectedBooking(
              updatedBooking ||
                {
                  ...selectedBooking,
                  status:
                    newStatus,
                }
            );
          }

          await fetchBookings();
        } else {
          alert(
            response.data?.message ||
              "Failed to update booking status."
          );
        }
      } catch (error) {
        console.error(
          "Failed to update booking status:",
          error
        );

        console.error(
          "Server response:",
          error?.response?.data
        );

        alert(
          error?.response?.data
            ?.message ||
            "Failed to update booking status."
        );
      } finally {
        setSaving(false);
      }
    };

  /* =====================================================
     CANCEL BOOKING
  ===================================================== */

  const handleCancelBookingSubmit =
    async () => {
      if (!selectedBooking) {
        return;
      }

      if (
        !cancellationReason ||
        cancellationReason ===
          "Select reason"
      ) {
        alert(
          "Please select a reason for cancellation."
        );

        return;
      }

      const mongoId =
        getMongoBookingId(
          selectedBooking
        );

      if (!mongoId) {
        alert(
          "Booking MongoDB ID is missing."
        );

        return;
      }

      await handleStatusChange(
        mongoId,
        "Cancelled",
        cancellationReason,
        cancellationComment
      );

      setCancellationReason(
        "Select reason"
      );

      setCancellationComment("");

      setShowCancelBox(false);

      alert(
        `Booking ${getBookingId(
          selectedBooking
        )} has been cancelled.`
      );
    };

  /* =====================================================
     CREATE NEW BOOKING
  ===================================================== */

  const handleAddBookingSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !newBooking.customerName.trim()
      ) {
        alert(
          "Please enter customer name."
        );

        return;
      }

      if (
        !newBooking.email.trim()
      ) {
        alert(
          "Please enter customer email."
        );

        return;
      }

      if (
        !newBooking.phone.trim()
      ) {
        alert(
          "Please enter customer phone."
        );

        return;
      }

      if (!newBooking.vehicle) {
        alert(
          "Please select a vehicle."
        );

        return;
      }

      if (!newBooking.pickupDate) {
        alert(
          "Please select pickup date."
        );

        return;
      }

      if (!newBooking.returnDate) {
        alert(
          "Please select return date."
        );

        return;
      }

      if (
        new Date(
          newBooking.returnDate
        ) <
        new Date(
          newBooking.pickupDate
        )
      ) {
        alert(
          "Return date cannot be before pickup date."
        );

        return;
      }

      try {
        setSaving(true);

        const selectedListing =
          listings.find(
            (listing) =>
              String(
                getVehicleId(
                  listing
                )
              ) ===
              String(
                newBooking.vehicle
              )
          );

        if (!selectedListing) {
          alert(
            "Selected vehicle/listing not found."
          );

          return;
        }

        const vehicleId =
          getVehicleId(
            selectedListing
          );

        if (!vehicleId) {
          alert(
            "Selected vehicle ID is missing."
          );

          return;
        }

        const pickupLocation =
          selectedListing.pickupLocation ||
          selectedListing.location ||
          selectedListing.address ||
          "Main Office";

        const dropoffLocation =
          selectedListing.dropoffLocation ||
          selectedListing.location ||
          selectedListing.address ||
          pickupLocation;

        const pickupTime =
          "10:00 AM";

        const dropoffTime =
          "06:00 PM";

        const pickupDateTime =
          new Date(
            `${newBooking.pickupDate}T10:00:00`
          );

        const returnDateTime =
          new Date(
            `${newBooking.returnDate}T18:00:00`
          );

        const payload = {
          customerName:
            newBooking.customerName.trim(),

          email:
            newBooking.email
              .trim()
              .toLowerCase(),

          phone:
            newBooking.phone.trim(),

          vehicle:
            vehicleId,

          vehicleId:
            vehicleId,

          vehicleName:
            getVehicleName(
              selectedListing
            ),

          vehicleImage:
            getVehicleImage(
              selectedListing
            ),

          bookingDate:
            new Date(),

          bookingTime:
            "10:00 AM",

          pickupDate:
            pickupDateTime,

          pickupTime:
            pickupTime,

          pickupLocation:
            pickupLocation,

          returnDate:
            returnDateTime,

          dropoffDate:
            returnDateTime,

          dropoffTime:
            dropoffTime,

          dropoffLocation:
            dropoffLocation,

          amount:
            Number(
              newBooking.amount
            ) || 0,

          status:
            "Pending",

          paymentStatus:
            "Unpaid",

          paymentMethod:
            "",

          additionalMessage:
            "",
        };

        console.log(
          "===================================="
        );

        console.log(
          "FINAL ADMIN BOOKING PAYLOAD:",
          payload
        );

        console.log(
          "RETURN DATE:",
          payload.returnDate
        );

        console.log(
          "RETURN DATE ISO:",
          payload.returnDate?.toISOString()
        );

        console.log(
          "PICKUP DATE:",
          payload.pickupDate
        );

        console.log(
          "PICKUP DATE ISO:",
          payload.pickupDate?.toISOString()
        );

        console.log(
          "===================================="
        );

        const response =
          await API.post(
            "/bookings",
            payload
          );

        console.log(
          "Create booking response:",
          response.data
        );

        if (
          response.data?.success
        ) {
          alert(
            "Booking created successfully!"
          );

          setIsModalOpen(false);

          setNewBooking({
            customerName: "",
            email: "",
            phone: "",
            vehicle:
              listings.length > 0
                ? getVehicleId(
                    listings[0]
                  )
                : "",
            pickupDate: "",
            returnDate: "",
            amount: "",
          });

          await fetchBookings();

          setCurrentPage(1);
        } else {
          alert(
            response.data?.message ||
              "Failed to create booking."
          );
        }
      } catch (error) {
        console.error(
          "Create booking error:",
          error
        );

        console.error(
          "Server response:",
          error?.response?.data
        );

        alert(
          error?.response?.data
            ?.message ||
            "Failed to create booking. Please check your backend connection."
        );
      } finally {
        setSaving(false);
      }
    };

  /* =====================================================
     MODAL OPEN
  ===================================================== */

  const handleOpenNewBooking =
    async () => {
      setIsModalOpen(true);

      if (
        listings.length === 0
      ) {
        await fetchListings();
      }

      if (
        !newBooking.vehicle &&
        listings.length > 0
      ) {
        setNewBooking(
          (previous) => ({
            ...previous,
            vehicle:
              getVehicleId(
                listings[0]
              ),
          })
        );
      }
    };

  /* =====================================================
     KEEP CURRENT PAGE VALID
  ===================================================== */

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="AllBookings-container">

      {/* Header */}

      <header className="AllBookings-header">

        <div className="AllBookings-title-section">

          <h2>
            All Bookings

            <FaCalendarAlt
              className="AllBookings-title-icon"
            />
          </h2>

          <p className="AllBookings-breadcrumb">
            Dashboard &gt; Bookings &gt;{" "}
            <span>
              All Bookings
            </span>
          </p>

        </div>

        <div className="AllBookings-top-actions">

          <button
            className="AllBookings-btn-export"
            onClick={
              handleExportCSV
            }
          >
            <FaDownload />
            Export CSV
          </button>

          <button
            className="AllBookings-btn-primary"
            onClick={
              handleOpenNewBooking
            }
          >
            <FaPlus />
            New Booking
          </button>

        </div>

      </header>

      {/* Top Stat Cards Grid */}

      <div className="AllBookings-stats-grid">

        {/* Total */}

        <div className="AllBookings-stat-card">

          <div className="AllBookings-stat-icon red">
            <FaUsers />
          </div>

          <div className="AllBookings-stat-info">

            <span className="AllBookings-stat-label">
              Total Bookings
            </span>

            <h3>
              {bookings.length}
            </h3>

            <span className="AllBookings-stat-growth positive">
              ↑ 18.5% from last week
            </span>

          </div>

        </div>

        {/* Revenue */}

        <div className="AllBookings-stat-card">

          <div className="AllBookings-stat-icon blue">
            <FaCar />
          </div>

          <div className="AllBookings-stat-info">

            <span className="AllBookings-stat-label">
              Total Revenue
            </span>

            <h3>
              {calculateTotalRevenue(
                bookings
              )}
            </h3>

            <span className="AllBookings-stat-growth positive">
              ↑ 24.7% from last week
            </span>

          </div>

        </div>

        {/* Confirmed */}

        <div className="AllBookings-stat-card">

          <div className="AllBookings-stat-icon green">
            <FaCheckCircle />
          </div>

          <div className="AllBookings-stat-info">

            <span className="AllBookings-stat-label">
              Confirmed
            </span>

            <h3>
              {
                bookings.filter(
                  (booking) =>
                    booking.status ===
                    "Confirmed"
                ).length
              }
            </h3>

            <span className="AllBookings-stat-growth positive">
              ↑ 12.3% from last week
            </span>

          </div>

        </div>

        {/* Ongoing */}

        <div className="AllBookings-stat-card">

          <div className="AllBookings-stat-icon orange">
            <FaClock />
          </div>

          <div className="AllBookings-stat-info">

            <span className="AllBookings-stat-label">
              Ongoing
            </span>

            <h3>
              {
                bookings.filter(
                  (booking) =>
                    booking.status ===
                    "Ongoing"
                ).length
              }
            </h3>

            <span className="AllBookings-stat-subtext">
              Currently Active
            </span>

          </div>

        </div>

        {/* Completed */}

        <div className="AllBookings-stat-card">

          <div className="AllBookings-stat-icon purple">
            <FaCalendarCheck />
          </div>

          <div className="AllBookings-stat-info">

            <span className="AllBookings-stat-label">
              Completed
            </span>

            <h3>
              {
                bookings.filter(
                  (booking) =>
                    booking.status ===
                    "Completed"
                ).length
              }
            </h3>

            <span className="AllBookings-stat-growth positive">
              ↑ 8.2% from last week
            </span>

          </div>

        </div>

        {/* Cancelled */}

        <div className="AllBookings-stat-card">

          <div className="AllBookings-stat-icon light-red">
            <FaExclamationCircle />
          </div>

          <div className="AllBookings-stat-info">

            <span className="AllBookings-stat-label">
              Cancelled
            </span>

            <h3>
              {
                bookings.filter(
                  (booking) =>
                    booking.status ===
                    "Cancelled"
                ).length
              }
            </h3>

            <span className="AllBookings-stat-growth positive">
              ↑ 3.5% from last week
            </span>

          </div>

        </div>

      </div>

      {/* Main Content Layout */}

      <div className="AllBookings-content-body">

        {/* Left Column */}

        <div
          className={`AllBookings-table-wrapper ${
            selectedBooking
              ? "with-sidebar"
              : "full-width"
          }`}
        >

          {/* Status Tabs */}

          <div className="AllBookings-status-tabs">

            {[
              "All",
              "Pending",
              "Confirmed",
              "Ongoing",
              "Completed",
              "Cancelled",
            ].map(
              (tab) => {

                const count =
                  tab === "All"
                    ? bookings.length
                    : bookings.filter(
                        (booking) =>
                          booking.status
                            ?.toLowerCase() ===
                          tab.toLowerCase()
                      ).length;

                return (
                  <button
                    key={tab}
                    className={`AllBookings-tab-btn ${tab.toLowerCase()} ${
                      activeTab === tab
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleTabChange(
                        tab
                      )
                    }
                  >
                    {tab} ({count})
                  </button>
                );
              }
            )}

          </div>

          {/* Search */}

          <div className="AllBookings-filter-bar">

            <div className="AllBookings-search-input">

              <FaSearch />

              <input
                type="text"
                placeholder="Search by name, email, or booking ID..."
                value={searchTerm}
                onChange={
                  handleSearchChange
                }
              />

            </div>

          </div>

          {/* Data Table */}

          <div className="AllBookings-table-responsive">

            <table className="AllBookings-table">

              <thead>

                <tr>

                  <th>
                    BOOKING
                  </th>

                  <th>
                    CUSTOMER
                  </th>

                  <th>
                    VEHICLE
                  </th>

                  <th>
                    PICKUP / RETURN
                  </th>

                  <th>
                    AMOUNT
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "2rem",
                      }}
                    >
                      Loading bookings...
                    </td>

                  </tr>

                ) : currentDisplayedBookings.length >
                  0 ? (

                  currentDisplayedBookings.map(
                    (item) => {

                      const bookingId =
                        getBookingId(
                          item
                        );

                      const mongoId =
                        getMongoBookingId(
                          item
                        );

                      const vehicleName =
                        item.vehicleName ||
                        getVehicleName(
                          item.vehicle
                        );

                      const vehicleColor =
                        item.vehicle?.color ||
                        item.vehicleColor ||
                        "";

                      const vehiclePlate =
                        item.vehicle?.plate ||
                        item.vehiclePlate ||
                        "";

                      const pickupDate =
                        item.pickupDate ||
                        item.fullPickupDate;

                      const returnDate =
                        item.returnDate ||
                        item.dropoffDate ||
                        item.fullDropoffDate;

                      return (

                        <tr
                          key={
                            mongoId ||
                            bookingId
                          }
                          className={
                            selectedBooking &&
                            (
                              String(
                                getMongoBookingId(
                                  selectedBooking
                                )
                              ) ===
                                String(
                                  mongoId
                                ) ||
                              String(
                                getBookingId(
                                  selectedBooking
                                )
                              ) ===
                                String(
                                  bookingId
                                )
                            )
                              ? "selected-row"
                              : ""
                          }
                        >

                          {/* BOOKING */}

                          <td className="AllBookings-td-id">

                            <span className="AllBookings-id-text">
                              {bookingId}
                            </span>

                            <span className="AllBookings-sub-text">
                              {formatDateTime(
                                item.bookingDate ||
                                  item.createdAt
                              )}
                            </span>

                          </td>

                          {/* CUSTOMER */}

                          <td>

                            <div className="AllBookings-user-cell">

                              <div>

                                <strong>
                                  {
                                    item.customer
                                      ?.name ||
                                    item.customerName ||
                                    "N/A"
                                  }
                                </strong>

                                <span className="AllBookings-sub-text">
                                  {
                                    item.customer
                                      ?.email ||
                                    item.email ||
                                    "N/A"
                                  }
                                </span>

                                <span className="AllBookings-sub-text">
                                  {
                                    item.customer
                                      ?.phone ||
                                    item.phone ||
                                    "N/A"
                                  }
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* VEHICLE */}

                          <td>

                            <div className="AllBookings-vehicle-cell">

                              <div>

                                <strong>
                                  {vehicleName}
                                </strong>

                                <span className="AllBookings-sub-text">
                                  {
                                    vehicleColor
                                  }
                                </span>

                                <span className="AllBookings-plate-badge">
                                  {
                                    vehiclePlate
                                  }
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* PICKUP RETURN */}

                          <td>

                            <div className="AllBookings-dates-cell">

                              <span>
                                {formatDate(
                                  pickupDate
                                )}

                                {item.pickupTime
                                  ? ` ${item.pickupTime}`
                                  : ""}
                              </span>

                              <span>
                                {formatDate(
                                  returnDate
                                )}

                                {item.dropoffTime
                                  ? ` ${item.dropoffTime}`
                                  : ""}
                              </span>

                              <span className="AllBookings-sub-text">
                                {
                                  item.duration ||
                                  calculateDuration(
                                    pickupDate,
                                    returnDate
                                  )
                                }
                              </span>

                            </div>

                          </td>

                          {/* AMOUNT */}

                          <td>

                            <div className="AllBookings-amount-cell">

                              <strong>
                                {formatIndianMoney(
                                  item.amount
                                )}
                              </strong>

                              <span
                                className={`AllBookings-pay-badge ${
                                  item.paymentStatus
                                    ? item.paymentStatus.toLowerCase()
                                    : "unpaid"
                                }`}
                              >
                                {
                                  item.paymentStatus ||
                                  "Unpaid"
                                }
                              </span>

                            </div>

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`AllBookings-status-badge ${
                                item.status
                                  ? item.status.toLowerCase()
                                  : "pending"
                              }`}
                            >
                              {
                                item.status ||
                                "Pending"
                              }
                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="AllBookings-td-actions">

                            <button
                              className="AllBookings-action-btn view"
                              onClick={() =>
                                handleViewBooking(
                                  item
                                )
                              }
                            >
                              <FaEye />
                            </button>

                            <div className="AllBookings-dropdown-container">

                              <button
                                className="AllBookings-action-btn menu"
                                onClick={(e) =>
                                  toggleMenu(
                                    bookingId,
                                    e
                                  )
                                }
                              >
                                <FaEllipsisV />
                              </button>

                              {activeMenuId ===
                                bookingId && (

                                <div className="AllBookings-action-menu">

                                  <button
                                    disabled={
                                      saving ||
                                      !mongoId
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        mongoId,
                                        "Confirmed"
                                      )
                                    }
                                  >
                                    Set Confirmed
                                  </button>

                                  <button
                                    disabled={
                                      saving ||
                                      !mongoId
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        mongoId,
                                        "Ongoing"
                                      )
                                    }
                                  >
                                    Set Ongoing
                                  </button>

                                  <button
                                    disabled={
                                      saving ||
                                      !mongoId
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        mongoId,
                                        "Completed"
                                      )
                                    }
                                  >
                                    Set Completed
                                  </button>

                                  <button
                                    disabled={
                                      saving ||
                                      !mongoId
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        mongoId,
                                        "Pending"
                                      )
                                    }
                                  >
                                    Set Pending
                                  </button>

                                  <button
                                    disabled={
                                      saving ||
                                      !mongoId
                                    }
                                    onClick={() => {

                                      setActiveMenuId(
                                        null
                                      );

                                      setSelectedBooking(
                                        item
                                      );

                                      setShowCancelBox(
                                        true
                                      );

                                      setActiveDetailsTab(
                                        "Details"
                                      );

                                    }}
                                  >
                                    Set Cancelled
                                  </button>

                                </div>

                              )}

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "2rem",
                      }}
                    >
                      No bookings found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* Pagination */}

          <div className="AllBookings-pagination-bar">

            <span>

              Showing{" "}

              {
                filteredBookings.length ===
                0
                  ? 0
                  : startIndex + 1
              }

              {" "}to{" "}

              {Math.min(
                startIndex +
                  itemsPerPage,
                filteredBookings.length
              )}

              {" "}of{" "}

              {
                filteredBookings.length
              }

              {" "}bookings

            </span>

            <div className="AllBookings-pagination-controls">

              <button
                className="AllBookings-page-btn"
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
                disabled={
                  currentPage === 1
                }
              >
                <FaChevronLeft />
              </button>

              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (page) => (

                  <button
                    key={page}
                    className={`AllBookings-page-btn ${
                      currentPage ===
                      page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handlePageChange(
                        page
                      )
                    }
                  >
                    {page}
                  </button>

                )
              )}

              <button
                className="AllBookings-page-btn"
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
              >
                <FaChevronRight />
              </button>

            </div>

          </div>

        </div>

        {/* SIDEBAR DETAILS */}

        {selectedBooking && (

          <div className="AllBookings-details-sidebar">

            <div className="AllBookings-details-header">

              <h3>
                Booking Details
              </h3>

              <button
                className="AllBookings-close-btn"
                onClick={() => {

                  setSelectedBooking(
                    null
                  );

                  setShowCancelBox(
                    false
                  );

                  setActiveDetailsTab(
                    "Details"
                  );

                }}
              >
                <FaTimes />
              </button>

            </div>

            {/* Vehicle Summary */}

            <div className="AllBookings-sidebar-car-card">

              <div className="AllBookings-car-card-info">

                <div>

                  <span className="AllBookings-meta-label">
                    Booking ID
                  </span>

                  <strong>
                    {
                      getBookingId(
                        selectedBooking
                      )
                    }
                  </strong>

                </div>

                <div>

                  <span className="AllBookings-meta-label">
                    Booking Date
                  </span>

                  <strong>
                    {
                      formatDateTime(
                        selectedBooking.bookingDate ||
                          selectedBooking.createdAt
                      )
                    }
                  </strong>

                </div>

                <div>

                  <span className="AllBookings-meta-label">
                    Payment Status
                  </span>

                  <span className="AllBookings-pay-badge paid">
                    {
                      selectedBooking.paymentStatus ||
                      "Unpaid"
                    }
                  </span>

                </div>

              </div>

            </div>

            {/* Details Tabs */}

            <div className="AllBookings-sidebar-tabs">

              {[
                "Details",
                "Customer",
                "Payment",
                "History",
              ].map(
                (tab) => (

                  <button
                    key={tab}
                    className={`AllBookings-sidebar-tab ${
                      activeDetailsTab ===
                      tab
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveDetailsTab(
                        tab
                      )
                    }
                  >
                    {tab}
                  </button>

                )
              )}

            </div>

            {/* Sidebar Body */}

            <div className="AllBookings-sidebar-body">

              {/* DETAILS TAB */}

              {activeDetailsTab ===
                "Details" && (

                <>

                  <div className="AllBookings-details-section">

                    <h4>
                      Booking Information
                    </h4>

                    <div className="AllBookings-info-group">

                      <label>
                        Vehicle
                      </label>

                      <p>
                        {
                          selectedBooking.vehicleName ||
                          getVehicleName(
                            selectedBooking.vehicle
                          ) ||
                          "N/A"
                        }

                        {" "}

                        {
                          selectedBooking.vehicle
                            ?.color
                            ? `(${selectedBooking.vehicle.color})`
                            : ""
                        }

                      </p>

                    </div>

                    <div className="AllBookings-info-group">

                      <label>
                        Pickup Date
                      </label>

                      <p>
                        {formatDate(
                          selectedBooking.pickupDate
                        )}

                        {" "}

                        {
                          selectedBooking.pickupTime ||
                          ""
                        }
                      </p>

                    </div>

                    <div className="AllBookings-info-group">

                      <label>
                        Return Date
                      </label>

                      <p>
                        {formatDate(
                          selectedBooking.returnDate ||
                            selectedBooking.dropoffDate
                        )}

                        {" "}

                        {
                          selectedBooking.dropoffTime ||
                          ""
                        }
                      </p>

                    </div>

                    <div className="AllBookings-info-group">

                      <label>
                        Duration
                      </label>

                      <p>
                        {
                          selectedBooking.duration ||
                          calculateDuration(
                            selectedBooking.pickupDate,
                            selectedBooking.returnDate ||
                              selectedBooking.dropoffDate
                          ) ||
                          "N/A"
                        }
                      </p>

                    </div>

                    <div className="AllBookings-info-group">

                      <label>
                        Pickup Location
                      </label>

                      <p>
                        {
                          selectedBooking.pickupLocation ||
                          selectedBooking.location ||
                          "N/A"
                        }
                      </p>

                    </div>

                    <div className="AllBookings-info-group">

                      <label>
                        Return Location
                      </label>

                      <p>
                        {
                          selectedBooking.dropoffLocation ||
                          selectedBooking.dropLocation ||
                          selectedBooking.returnLocation ||
                          "N/A"
                        }
                      </p>

                    </div>

                    <div className="AllBookings-info-group">

                      <label>
                        Driver
                      </label>

                      <p>
                        {
                          selectedBooking.driver ||
                          "N/A"
                        }
                      </p>

                    </div>

                  </div>

                  {/* Pricing */}

                  <div className="AllBookings-pricing-section">

                    <h4>
                      Pricing Details
                    </h4>

                    <div className="AllBookings-price-row">

                      <span>
                        Daily Rent Price
                      </span>

                      <span>
                        {formatIndianMoney(
                          selectedBooking.amount
                        )}
                      </span>

                    </div>

                    <div className="AllBookings-price-row total">

                      <strong>
                        Total Amount
                      </strong>

                      <strong className="purple-text">
                        {formatIndianMoney(
                          selectedBooking.amount
                        )}
                      </strong>

                    </div>

                  </div>

                </>

              )}

              {/* CUSTOMER TAB */}

              {activeDetailsTab ===
                "Customer" && (

                <div className="AllBookings-details-section">

                  <h4>
                    Customer Information
                  </h4>

                  <div className="AllBookings-info-group">

                    <label>
                      Name
                    </label>

                    <p>
                      {
                        selectedBooking.customer
                          ?.name ||
                        selectedBooking.customerName ||
                        "N/A"
                      }
                    </p>

                  </div>

                  <div className="AllBookings-info-group">

                    <label>
                      Email
                    </label>

                    <p>
                      {
                        selectedBooking.customer
                          ?.email ||
                        selectedBooking.email ||
                        "N/A"
                      }
                    </p>

                  </div>

                  <div className="AllBookings-info-group">

                    <label>
                      Phone
                    </label>

                    <p>
                      {
                        selectedBooking.customer
                          ?.phone ||
                        selectedBooking.phone ||
                        "N/A"
                      }
                    </p>

                  </div>

                  <div className="AllBookings-info-group">

                    <label>
                      Address
                    </label>

                    <p>
                      {
                        selectedBooking.customer
                          ?.address ||
                        selectedBooking.address ||
                        "N/A"
                      }
                    </p>

                  </div>

                </div>

              )}

              {/* PAYMENT TAB */}

              {activeDetailsTab ===
                "Payment" && (

                <div className="AllBookings-details-section">

                  <h4>
                    Payment Information
                  </h4>

                  <div className="AllBookings-info-group">

                    <label>
                      Amount
                    </label>

                    <p>
                      {formatIndianMoney(
                        selectedBooking.amount
                      )}
                    </p>

                  </div>

                  <div className="AllBookings-info-group">

                    <label>
                      Payment Method
                    </label>

                    <p>
                      {
                        selectedBooking.paymentMethod ||
                        "N/A"
                      }
                    </p>

                  </div>

                  <div className="AllBookings-info-group">

                    <label>
                      Payment Status
                    </label>

                    <p>
                      {
                        selectedBooking.paymentStatus ||
                        "Unpaid"
                      }
                    </p>

                  </div>

                </div>

              )}

              {/* HISTORY TAB */}

              {activeDetailsTab ===
                "History" && (

                <div className="AllBookings-details-section">

                  <h4>
                    Booking History
                  </h4>

                  <div className="AllBookings-info-group">

                    <label>
                      Booking Created
                    </label>

                    <p>
                      {
                        formatDateTime(
                          selectedBooking.createdAt ||
                            selectedBooking.bookingDate
                        )
                      }
                    </p>

                  </div>

                  <div className="AllBookings-info-group">

                    <label>
                      Current Status
                    </label>

                    <p>
                      {
                        selectedBooking.status ||
                        "Pending"
                      }
                    </p>

                  </div>

                  <div className="AllBookings-info-group">

                    <label>
                      Cancellation Reason
                    </label>

                    <p>
                      {
                        selectedBooking.cancellationReason ||
                        "N/A"
                      }
                    </p>

                  </div>

                  <div className="AllBookings-info-group">

                    <label>
                      Cancellation Comment
                    </label>

                    <p>
                      {
                        selectedBooking.cancellationComment ||
                        "N/A"
                      }
                    </p>

                  </div>

                  <div className="AllBookings-info-group">

                    <label>
                      Updated At
                    </label>

                    <p>
                      {
                        selectedBooking.updatedAt
                          ? formatDateTime(
                              selectedBooking.updatedAt
                            )
                          : "N/A"
                      }
                    </p>

                  </div>

                </div>

              )}

            </div>

            {/* Quick Actions */}

            <div className="AllBookings-sidebar-actions">

              <h4>
                Booking Actions
              </h4>

              <div className="AllBookings-action-buttons-grid">

                <button
                  className="AllBookings-action-btn-green"
                  disabled={saving}
                  onClick={() =>
                    handleStatusChange(
                      getMongoBookingId(
                        selectedBooking
                      ),
                      "Confirmed"
                    )
                  }
                >
                  Mark Confirmed
                </button>

                <button
                  className="AllBookings-action-btn-sky"
                  disabled={saving}
                  onClick={() =>
                    handleStatusChange(
                      getMongoBookingId(
                        selectedBooking
                      ),
                      "Ongoing"
                    )
                  }
                >
                  Mark Ongoing
                </button>

                <button
                  className="AllBookings-action-btn-purple"
                  disabled={saving}
                  onClick={() =>
                    handleStatusChange(
                      getMongoBookingId(
                        selectedBooking
                      ),
                      "Completed"
                    )
                  }
                >
                  Mark Completed
                </button>

                <button
                  className="AllBookings-action-btn-red"
                  disabled={saving}
                  onClick={() =>
                    setShowCancelBox(
                      !showCancelBox
                    )
                  }
                >
                  {
                    showCancelBox
                      ? "Hide Cancel Form"
                      : "Cancel Booking"
                  }
                </button>

              </div>

              {/* Cancel Form */}

              {showCancelBox && (

                <div
                  className="AllBookings-cancel-box"
                  style={{
                    marginTop:
                      "1rem",
                  }}
                >

                  <h5>
                    Cancel Booking
                  </h5>

                  <div className="AllBookings-input-group">

                    <label>
                      Reason for Cancellation *
                    </label>

                    <select
                      className="AllBookings-select full"
                      value={
                        cancellationReason
                      }
                      onChange={(e) =>
                        setCancellationReason(
                          e.target.value
                        )
                      }
                    >

                      <option>
                        Select reason
                      </option>

                      <option>
                        Customer requested
                      </option>

                      <option>
                        Vehicle issue
                      </option>

                      <option>
                        Payment failed
                      </option>

                    </select>

                  </div>

                  <div className="AllBookings-input-group">

                    <label>
                      Comments (Optional)
                    </label>

                    <textarea
                      placeholder="Enter additional comments..."
                      maxLength={200}
                      value={
                        cancellationComment
                      }
                      onChange={(e) =>
                        setCancellationComment(
                          e.target.value
                        )
                      }
                    />

                    <span className="AllBookings-char-count">
                      {
                        cancellationComment.length
                      }
                      /200
                    </span>

                  </div>

                  <button
                    type="button"
                    className="AllBookings-action-btn-red"
                    style={{
                      width:
                        "100%",
                      marginTop:
                        "0.5rem",
                      padding:
                        "0.5rem",
                      cursor:
                        "pointer",
                    }}
                    onClick={
                      handleCancelBookingSubmit
                    }
                    disabled={saving}
                  >
                    {
                      saving
                        ? "Updating..."
                        : "Submit Cancellation"
                    }
                  </button>

                </div>

              )}

            </div>

          </div>

        )}

      </div>

      {/* =====================================================
          ADD NEW BOOKING MODAL
      ===================================================== */}

      {isModalOpen && (

        <div className="AllBookings-modal-overlay">

          <div className="AllBookings-modal">

            <div className="AllBookings-modal-header">

              <h3>
                Add New Booking
              </h3>

              <button
                className="AllBookings-close-btn"
                onClick={() =>
                  setIsModalOpen(
                    false
                  )
                }
                disabled={saving}
              >
                <FaTimes />
              </button>

            </div>

            <form
              onSubmit={
                handleAddBookingSubmit
              }
              className="AllBookings-modal-form"
            >

              {/* Customer Name */}

              <div className="AllBookings-form-group">

                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  required
                  value={
                    newBooking.customerName
                  }
                  onChange={(e) =>
                    setNewBooking(
                      (previous) => ({
                        ...previous,
                        customerName:
                          e.target.value,
                      })
                    )
                  }
                />

              </div>

              {/* Email */}

              <div className="AllBookings-form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={
                    newBooking.email
                  }
                  onChange={(e) =>
                    setNewBooking(
                      (previous) => ({
                        ...previous,
                        email:
                          e.target.value,
                      })
                    )
                  }
                />

              </div>

              {/* Phone */}

              <div className="AllBookings-form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  required
                  value={
                    newBooking.phone
                  }
                  onChange={(e) =>
                    setNewBooking(
                      (previous) => ({
                        ...previous,
                        phone:
                          e.target.value,
                      })
                    )
                  }
                />

              </div>

              {/* Vehicle */}

              <div className="AllBookings-form-group">

                <label>
                  Vehicle
                </label>

                <select
                  value={
                    newBooking.vehicle
                  }
                  onChange={(e) =>
                    setNewBooking(
                      (previous) => ({
                        ...previous,
                        vehicle:
                          e.target.value,
                      })
                    )
                  }
                >

                  {listings.length > 0 ? (

                    listings.map(
                      (listing) => {

                        const id =
                          getVehicleId(
                            listing
                          );

                        return (

                          <option
                            key={id}
                            value={id}
                          >
                            {
                              getVehicleName(
                                listing
                              )
                            }
                          </option>

                        );

                      }
                    )

                  ) : (

                    <>
                      <option value="">
                        Loading vehicles...
                      </option>
                    </>

                  )}

                </select>

              </div>

              {/* Dates */}

              <div className="AllBookings-form-row">

                <div className="AllBookings-form-group">

                  <label>
                    Pickup Date
                  </label>

                  <input
                    type="date"
                    required
                    value={
                      newBooking.pickupDate
                    }
                    onChange={(e) =>
                      setNewBooking(
                        (previous) => ({
                          ...previous,
                          pickupDate:
                            e.target.value,
                        })
                      )
                    }
                  />

                </div>

                <div className="AllBookings-form-group">

                  <label>
                    Return Date
                  </label>

                  <input
                    type="date"
                    required
                    value={
                      newBooking.returnDate
                    }
                    onChange={(e) =>
                      setNewBooking(
                        (previous) => ({
                          ...previous,
                          returnDate:
                            e.target.value,
                        })
                      )
                    }
                  />

                </div>

              </div>

              {/* Amount */}

              <div className="AllBookings-form-group">

                <label>
                  Amount (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  required
                  value={
                    newBooking.amount
                  }
                  onChange={(e) =>
                    setNewBooking(
                      (previous) => ({
                        ...previous,
                        amount:
                          e.target.value,
                      })
                    )
                  }
                />

              </div>

              {/* Modal Actions */}

              <div className="AllBookings-modal-actions">

                <button
                  type="button"
                  className="AllBookings-btn-secondary"
                  onClick={() =>
                    setIsModalOpen(
                      false
                    )
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="AllBookings-btn-primary"
                  disabled={
                    saving ||
                    listings.length === 0
                  }
                >
                  {
                    saving
                      ? "Creating..."
                      : "Create Booking"
                  }
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AllBookings;