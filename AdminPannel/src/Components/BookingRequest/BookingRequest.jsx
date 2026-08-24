import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Calendar,
  Filter,
  Eye,
  X,
  User,
  Car,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  Trash2,
  RefreshCw,
  Clock,
  AlertCircle,
  MoreVertical,
  FileText,
  RotateCcw
} from 'lucide-react';

import './BookingRequest.css';

import API from '../../api/axios';


/* =========================================================
   FALLBACK DATA
   ========================================================= */

const INITIAL_DATA = [
  {
    id: '#BK25051801',

    customer: {
      name: 'John Smith',
      email: 'john@gmail.com',
      phone: '+1 202-555-0181',
      license: 'EJ123456788',
      address: '123 Main Street, Chicago, IL 60601, USA'
    },

    vehicle: {
      name: 'Toyota Camry',
      type: 'Sedan • Black',
      year: '2022',
      transmission: 'Automatic',
      fuel: 'Petrol',
      image:
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&auto=format&fit=crop&q=60'
    },

    pickup: 'New York City',

    drop: 'Los Angeles',

    dates: 'May 20, 2025 - May 25, 2025',

    startDate: '2025-05-20',

    endDate: '2025-05-25',

    pickupDate: 'May 20, 2025 at 10:00 AM',

    dropoffDate: 'May 25, 2025 at 10:00 AM',

    duration: '5 Days',

    status: 'Pending',

    amount: '$350.00',

    bookedOn: 'May 18, 2025 at 10:30 AM',

    paymentMethod: 'Credit Card',

    paymentStatus: 'Unpaid'
  }
];


/* =========================================================
   HELPERS
   ========================================================= */

const getId = (item) => {
  return (
    item?._id ||
    item?.id ||
    item?.bookingId ||
    item?.bookingID ||
    ''
  );
};


const getVehicleId = (vehicle) => {
  if (!vehicle) {
    return '';
  }

  if (typeof vehicle === 'string') {
    return vehicle;
  }

  return (
    vehicle?._id ||
    vehicle?.id ||
    vehicle?.vehicleId ||
    ''
  );
};


const getVehicleImage = (vehicle) => {
  if (!vehicle) {
    return '';
  }

  if (typeof vehicle === 'string') {
    return vehicle;
  }

  if (Array.isArray(vehicle.images)) {
    return (
      vehicle.images[0] ||
      vehicle.image ||
      ''
    );
  }

  return (
    vehicle.image ||
    vehicle.imageUrl ||
    vehicle.photo ||
    ''
  );
};


const formatDateOnly = (date) => {
  if (!date) {
    return '';
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().split('T')[0];
};


const formatDisplayDate = (date) => {
  if (!date) {
    return '';
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }
  );
};


const formatDisplayDateTime = (
  date,
  time
) => {
  if (!date) {
    return '';
  }

  const dateValue =
    formatDisplayDate(date);

  if (!time) {
    return dateValue;
  }

  return `${dateValue} at ${time}`;
};


const calculateDuration = (
  startDate,
  endDate
) => {
  if (!startDate || !endDate) {
    return '';
  }

  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return '';
  }

  const difference =
    end.getTime() -
    start.getTime();

  const days =
    Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );

  if (days <= 0) {
    return '1 Day';
  }

  return `${days} ${days === 1 ? 'Day' : 'Days'}`;
};


const formatAmount = (amount) => {
  if (
    amount === undefined ||
    amount === null ||
    amount === ''
  ) {
    return '$0.00';
  }

  if (
    typeof amount === 'string' &&
    amount.includes('$')
  ) {
    return amount;
  }

  const numericAmount =
    Number(amount);

  if (
    Number.isNaN(numericAmount)
  ) {
    return String(amount);
  }

  return `$${numericAmount.toFixed(2)}`;
};


const normalizeStatus = (
  status
) => {
  if (!status) {
    return 'Pending';
  }

  const value =
    String(status).toLowerCase();

  if (value === 'confirmed') {
    return 'Confirmed';
  }

  if (value === 'cancelled') {
    return 'Cancelled';
  }

  if (value === 'canceled') {
    return 'Cancelled';
  }

  return 'Pending';
};


/* =========================================================
   NORMALIZE BOOKING FROM BACKEND
   ========================================================= */

const normalizeBooking = (
  booking,
  index
) => {

  const customer =
    booking?.customer ||
    booking?.user ||
    booking?.customerId ||
    {};

  const vehicle =
    booking?.vehicle ||
    booking?.car ||
    booking?.vehicleId ||
    {};


  const bookingId =
    getId(booking) ||
    `#BK${Date.now()}${index}`;


  const customerName =
    typeof customer === 'object'
      ? (
        customer?.name ||
        customer?.fullName ||
        booking?.fullName ||
        booking?.customerName ||
        'Unknown Customer'
      )
      : (
        booking?.fullName ||
        booking?.customerName ||
        'Unknown Customer'
      );


  const customerEmail =
    typeof customer === 'object'
      ? (
        customer?.email ||
        booking?.email ||
        'N/A'
      )
      : (
        booking?.email ||
        'N/A'
      );


  const customerPhone =
    typeof customer === 'object'
      ? (
        customer?.phone ||
        booking?.phone ||
        'N/A'
      )
      : (
        booking?.phone ||
        'N/A'
      );


  const customerLicense =
    typeof customer === 'object'
      ? (
        customer?.license ||
        customer?.licenseNumber ||
        booking?.license ||
        booking?.licenseNumber ||
        'N/A'
      )
      : (
        booking?.license ||
        booking?.licenseNumber ||
        'N/A'
      );


  const customerAddress =
    typeof customer === 'object'
      ? (
        customer?.address ||
        booking?.address ||
        'N/A'
      )
      : (
        booking?.address ||
        'N/A'
      );


  const vehicleName =
    typeof vehicle === 'object'
      ? (
        vehicle?.name ||
        vehicle?.title ||
        vehicle?.vehicleName ||
        booking?.vehicleName ||
        'Vehicle'
      )
      : (
        booking?.vehicleName ||
        'Vehicle'
      );


  const vehicleType =
    typeof vehicle === 'object'
      ? (
        vehicle?.type ||
        vehicle?.category ||
        booking?.vehicleType ||
        'Vehicle'
      )
      : (
        booking?.vehicleType ||
        'Vehicle'
      );


  const vehicleYear =
    typeof vehicle === 'object'
      ? (
        vehicle?.year ||
        booking?.vehicleYear ||
        'N/A'
      )
      : (
        booking?.vehicleYear ||
        'N/A'
      );


  const vehicleTransmission =
    typeof vehicle === 'object'
      ? (
        vehicle?.transmission ||
        booking?.transmission ||
        'N/A'
      )
      : (
        booking?.transmission ||
        'N/A'
      );


  const vehicleFuel =
    typeof vehicle === 'object'
      ? (
        vehicle?.fuel ||
        vehicle?.fuelType ||
        booking?.fuel ||
        booking?.fuelType ||
        'N/A'
      )
      : (
        booking?.fuel ||
        booking?.fuelType ||
        'N/A'
      );


  const vehicleImage =
    getVehicleImage(vehicle) ||
    booking?.vehicleImage ||
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&auto=format&fit=crop&q=60';


  const pickupLocation =
    booking?.pickupLocation ||
    booking?.pickup ||
    booking?.pickupAddress ||
    'N/A';


  const dropLocation =
    booking?.dropoffLocation ||
    booking?.dropLocation ||
    booking?.drop ||
    booking?.dropoff ||
    'N/A';


  const startDateValue =
    booking?.pickupDate ||
    booking?.startDate ||
    booking?.fromDate ||
    '';


  const endDateValue =
    booking?.dropoffDate ||
    booking?.endDate ||
    booking?.toDate ||
    '';


  const pickupTime =
    booking?.pickupTime ||
    '';


  const dropoffTime =
    booking?.dropoffTime ||
    '';


  const startDate =
    formatDateOnly(
      startDateValue
    );


  const endDate =
    formatDateOnly(
      endDateValue
    );


  const duration =
    booking?.duration ||
    calculateDuration(
      startDate,
      endDate
    ) ||
    'N/A';


  const pickupDate =
    booking?.pickupDateText ||
    formatDisplayDateTime(
      startDateValue,
      pickupTime
    ) ||
    'N/A';


  const dropoffDate =
    booking?.dropoffDateText ||
    formatDisplayDateTime(
      endDateValue,
      dropoffTime
    ) ||
    'N/A';


  const dates =
    booking?.dates ||
    (
      startDate && endDate
        ? `${formatDisplayDate(startDateValue)} - ${formatDisplayDate(endDateValue)}`
        : 'N/A'
    );


  const bookedOn =
    booking?.bookedOn ||
    booking?.createdAt ||
    booking?.createdDate ||
    '';


  const bookedOnText =
    booking?.bookedOnText ||
    (
      bookedOn
        ? new Date(bookedOn).toLocaleString(
            'en-US',
            {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }
          )
        : 'N/A'
    );


  const paymentMethod =
    booking?.paymentMethod ||
    booking?.payment?.method ||
    'N/A';


  const paymentStatus =
    booking?.paymentStatus ||
    booking?.payment?.status ||
    'Unpaid';


  return {

    ...booking,

    id: bookingId,

    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      license: customerLicense,
      address: customerAddress
    },

    vehicle: {
      name: vehicleName,
      type: vehicleType,
      year: vehicleYear,
      transmission:
        vehicleTransmission,
      fuel: vehicleFuel,
      image: vehicleImage,
      vehicleId:
        getVehicleId(vehicle)
    },

    pickup:
      pickupLocation,

    drop:
      dropLocation,

    dates,

    startDate,

    endDate,

    pickupDate,

    dropoffDate,

    duration,

    status:
      normalizeStatus(
        booking?.status
      ),

    amount:
      formatAmount(
        booking?.amount ||
        booking?.totalAmount ||
        booking?.price ||
        0
      ),

    bookedOn:
      bookedOnText,

    paymentMethod,

    paymentStatus

  };

};


/* =========================================================
   COMPONENT
   ========================================================= */

const BookingRequest = () => {

  const [bookings, setBookings] =
    useState([]);

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [activeDropdownId, setActiveDropdownId] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  const [actionLoading, setActionLoading] =
    useState(false);


  const [error, setError] =
    useState('');


  /* =======================================================
     FILTER INPUT STATES
     ======================================================= */

  const [searchTerm, setSearchTerm] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All Status');

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');


  /* =======================================================
     APPLIED FILTER STATES
     ======================================================= */

  const [appliedFilters, setAppliedFilters] =
    useState({

      search: '',

      status: 'All Status',

      start: '',

      end: ''

    });


  /* =======================================================
     PAGINATION
     ======================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 6;


  /* =======================================================
     FETCH BOOKINGS
     ======================================================= */

  const fetchBookings = async () => {

    try {

      setLoading(true);

      setError('');


      const response =
        await API.get('/bookings');


      console.log(
        'Bookings API Response:',
        response.data
      );


      const responseData =
        response.data;


      let bookingData = [];


      if (
        Array.isArray(responseData)
      ) {

        bookingData =
          responseData;

      } else if (
        Array.isArray(
          responseData?.data
        )
      ) {

        bookingData =
          responseData.data;

      } else if (
        Array.isArray(
          responseData?.bookings
        )
      ) {

        bookingData =
          responseData.bookings;

      } else if (
        Array.isArray(
          responseData?.results
        )
      ) {

        bookingData =
          responseData.results;

      } else if (
        Array.isArray(
          responseData?.data?.bookings
        )
      ) {

        bookingData =
          responseData.data.bookings;

      }


      const normalizedBookings =
        bookingData.map(
          normalizeBooking
        );


      setBookings(
        normalizedBookings
      );


      if (
        selectedBooking
      ) {

        const updatedSelected =
          normalizedBookings.find(
            (item) =>
              item.id ===
              selectedBooking.id
          );


        if (updatedSelected) {

          setSelectedBooking(
            updatedSelected
          );

        } else {

          setSelectedBooking(
            null
          );

        }

      }

    } catch (error) {

      console.error(
        'Error fetching bookings:',
        error
      );


      console.error(
        'Server response:',
        error?.response?.data
      );


      setError(
        error?.response?.data?.message ||
        'Failed to load bookings'
      );


      setBookings(
        INITIAL_DATA
      );

    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     INITIAL FETCH
     ======================================================= */

  useEffect(() => {

    fetchBookings();

  }, []);


  /* =======================================================
     APPLY FILTER
     ======================================================= */

  const handleApplyFilter = () => {

    setAppliedFilters({

      search:
        searchTerm,

      status:
        statusFilter,

      start:
        startDate,

      end:
        endDate

    });


    setCurrentPage(1);

  };


  /* =======================================================
     RESET FILTER
     ======================================================= */

  const handleResetFilter = () => {

    setSearchTerm('');

    setStatusFilter(
      'All Status'
    );

    setStartDate('');

    setEndDate('');


    setAppliedFilters({

      search: '',

      status:
        'All Status',

      start: '',

      end: ''

    });


    setCurrentPage(1);

  };


  /* =======================================================
     FILTERED BOOKINGS
     ======================================================= */

  const filteredBookings = useMemo(() => {

    return bookings.filter(
      (item) => {

        const search =
          appliedFilters.search
            .toLowerCase()
            .trim();


        const matchesSearch =

          item.id
            .toLowerCase()
            .includes(search)

          ||

          item.customer.name
            .toLowerCase()
            .includes(search)

          ||

          item.customer.email
            .toLowerCase()
            .includes(search)

          ||

          item.customer.phone
            .toLowerCase()
            .includes(search);


        const matchesStatus =
          appliedFilters.status ===
            'All Status' ||

          item.status
            .toLowerCase() ===
            appliedFilters.status
              .toLowerCase();


        let matchesDate = true;


        if (
          appliedFilters.start
        ) {

          if (
            !item.startDate
          ) {

            matchesDate = false;

          } else {

            matchesDate =
              new Date(
                item.startDate
              ) >=
              new Date(
                appliedFilters.start
              );

          }

        }


        if (
          appliedFilters.end
        ) {

          if (
            !item.endDate
          ) {

            matchesDate = false;

          } else {

            matchesDate =
              matchesDate &&
              new Date(
                item.endDate
              ) <=
              new Date(
                appliedFilters.end
              );

          }

        }


        return (
          matchesSearch &&
          matchesStatus &&
          matchesDate
        );

      }
    );

  }, [
    bookings,
    appliedFilters
  ]);


  /* =======================================================
     STATISTICS
     ======================================================= */

  const stats = useMemo(() => {

    const total =
      bookings.length;


    const pending =
      bookings.filter(
        (booking) =>
          booking.status ===
          'Pending'
      ).length;


    const confirmed =
      bookings.filter(
        (booking) =>
          booking.status ===
          'Confirmed'
      ).length;


    const cancelled =
      bookings.filter(
        (booking) =>
          booking.status ===
          'Cancelled'
      ).length;


    return {

      total,

      pending,

      confirmed,

      cancelled

    };

  }, [bookings]);


  /* =======================================================
     PAGINATION
     ======================================================= */

  const totalPages =
    Math.ceil(
      filteredBookings.length /
      itemsPerPage
    ) || 1;


  const currentTableData =
    useMemo(() => {

      const firstPageIndex =
        (currentPage - 1) *
        itemsPerPage;


      const lastPageIndex =
        firstPageIndex +
        itemsPerPage;


      return filteredBookings.slice(
        firstPageIndex,
        lastPageIndex
      );

    }, [
      currentPage,
      filteredBookings
    ]);


  /* =======================================================
     KEEP PAGE VALID
     ======================================================= */

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
    totalPages
  ]);


  /* =======================================================
     UPDATE STATUS API
     ======================================================= */

  const updateStatus = async (
    id,
    newStatus
  ) => {

    try {

      setActionLoading(true);


      const currentBooking =
        bookings.find(
          (item) =>
            item.id === id
        );


      if (!currentBooking) {
        return;
      }


      /*
       * Main API
       *
       * PUT /bookings/:id
       *
       * If your backend uses
       * another endpoint, change
       * only this API call.
       */

      const response =
        await API.put(
          `/bookings/${id}`,
          {
            status:
              newStatus
          }
        );


      console.log(
        'Update Booking Response:',
        response.data
      );


      setBookings(
        (prev) =>
          prev.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    status:
                      newStatus
                  }
                : item
          )
      );


      if (
        selectedBooking &&
        selectedBooking.id === id
      ) {

        setSelectedBooking(
          (prev) => ({

            ...prev,

            status:
              newStatus

          })
        );

      }


      setActiveDropdownId(
        null
      );

    } catch (error) {

      console.error(
        'Error updating booking status:',
        error
      );


      console.error(
        'Server response:',
        error?.response?.data
      );


      /*
       * Fallback local update
       * if API fails.
       */

      const shouldUpdateLocal =
        window.confirm(
          'Server update failed. Do you want to update the status locally?'
        );


      if (
        shouldUpdateLocal
      ) {

        setBookings(
          (prev) =>
            prev.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      status:
                        newStatus
                    }
                  : item
            )
        );


        if (
          selectedBooking &&
          selectedBooking.id === id
        ) {

          setSelectedBooking(
            (prev) => ({

              ...prev,

              status:
                newStatus

            })
          );

        }

      }

    } finally {

      setActionLoading(false);

    }

  };


  /* =======================================================
     DELETE BOOKING API
     ======================================================= */

  const handleDeleteRow = async (
    id
  ) => {

    const shouldDelete =
      window.confirm(
        'Are you sure you want to delete this booking?'
      );


    if (!shouldDelete) {
      return;
    }


    try {

      setActionLoading(true);


      /*
       * DELETE /bookings/:id
       */

      const response =
        await API.delete(
          `/bookings/${id}`
        );


      console.log(
        'Delete Booking Response:',
        response.data
      );


      setBookings(
        (prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
      );


      if (
        selectedBooking &&
        selectedBooking.id === id
      ) {

        setSelectedBooking(
          null
        );

      }


      setActiveDropdownId(
        null
      );

    } catch (error) {

      console.error(
        'Error deleting booking:',
        error
      );


      console.error(
        'Server response:',
        error?.response?.data
      );


      alert(
        error?.response?.data?.message ||
        'Failed to delete booking.'
      );

    } finally {

      setActionLoading(false);

    }

  };


  /* =======================================================
     LOADING UI
     ======================================================= */

  if (loading) {

    return (

      <div className="booking-requests-container">

        <div className="br-header">

          <div>

            <h2>
              Booking Requests
            </h2>

            <p>
              Manage and review all incoming booking requests
            </p>

          </div>

          <div className="br-breadcrumb">

            <span>
              Bookings
            </span>

            {' > '}

            <span className="active">
              Booking Requests
            </span>

          </div>

        </div>


        <div className="br-layout">

          <div className="br-main-content">

            <div className="table-card">

              <div className="table-responsive">

                <table className="br-table">

                  <tbody>

                    <tr>

                      <td
                        colSpan="8"
                        className="no-data"
                      >
                        Loading bookings...
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

      </div>

    );

  }


  /* =======================================================
     MAIN UI
     ======================================================= */

  return (

    <div className="booking-requests-container">


      {/* =================================================
          TOP HEADER
      ================================================= */}

      <div className="br-header">

        <div>

          <h2>
            Booking Requests
          </h2>

          <p>
            Manage and review all incoming booking requests
          </p>

        </div>


        <div className="br-breadcrumb">

          <span>
            Bookings
          </span>

          {' > '}

          <span className="active">
            Booking Requests
          </span>

        </div>

      </div>


      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="br-layout">


        {/* =================================================
            LEFT SIDE CONTENT
        ================================================= */}

        <div className="br-main-content">


          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="br-stats-grid">


            <div className="stat-card">

              <div className="stat-icon green">

                <RefreshCw size={20} />

              </div>

              <div className="stat-info">

                <p>
                  Total Requests
                </p>

                <h3>
                  {stats.total}
                </h3>

                <span>
                  This Month
                </span>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon yellow">

                <Clock size={20} />

              </div>

              <div className="stat-info">

                <p>
                  Pending Requests
                </p>

                <h3>
                  {stats.pending}
                </h3>

                <span>
                  Awaiting Action
                </span>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon dark-green">

                <Check size={20} />

              </div>

              <div className="stat-info">

                <p>
                  Confirmed
                </p>

                <h3>
                  {stats.confirmed}
                </h3>

                <span>
                  This Month
                </span>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon red">

                <AlertCircle size={20} />

              </div>

              <div className="stat-info">

                <p>
                  Cancelled
                </p>

                <h3>
                  {stats.cancelled}
                </h3>

                <span>
                  This Month
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              FILTERS BAR
          ================================================= */}

          <div className="br-filters-bar">


            <div className="search-box">

              <Search
                size={16}
                className="search-icon"
              />

              <input
                type="text"
                placeholder="Search by name, email, phone, or booking ID..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>


            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option value="All Status">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>


            {/* Calendar Date Range */}

            <div className="date-picker-wrapper">

              <Calendar
                size={16}
                className="calendar-icon"
              />

              <input
                type="date"
                className="date-input"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
              />

              <span className="date-separator">
                to
              </span>

              <input
                type="date"
                className="date-input"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
              />

            </div>


            {/* Filter */}

            <button
              className="filter-submit-btn"
              onClick={
                handleApplyFilter
              }
            >

              <Filter size={16} />

              <span>
                Filter
              </span>

            </button>


            {/* Reset */}

            <button
              className="filter-reset-btn"
              onClick={
                handleResetFilter
              }
              title="Reset Filter"
            >

              <RotateCcw size={16} />

            </button>


            {/* Booking Details */}

            <button
              className={`booking-details-toggle-btn ${
                selectedBooking
                  ? 'active'
                  : ''
              }`}
              onClick={() => {

                if (
                  selectedBooking
                ) {

                  setSelectedBooking(
                    null
                  );

                } else if (
                  currentTableData.length >
                  0
                ) {

                  setSelectedBooking(
                    currentTableData[0]
                  );

                }

              }}
            >

              <FileText size={16} />

              <span>
                Booking Details
              </span>

            </button>

          </div>


          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (

            <div
              style={{
                padding: '10px 14px',
                marginBottom: '10px',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            >

              {error}

            </div>

          )}


          {/* =================================================
              DATA TABLE
          ================================================= */}

          <div className="table-card">

            <div className="table-responsive">

              <table className="br-table">

                <thead>

                  <tr>

                    <th>
                      BOOKING ID
                    </th>

                    <th>
                      CUSTOMER
                    </th>

                    <th>
                      VEHICLE
                    </th>

                    <th>
                      PICKUP & DROP
                    </th>

                    <th>
                      DATES
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      AMOUNT
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {currentTableData.length >
                  0 ? (

                    currentTableData.map(
                      (row) => (

                        <tr
                          key={row.id}
                          className={
                            selectedBooking?.id ===
                            row.id
                              ? 'row-selected'
                              : ''
                          }
                        >


                          {/* BOOKING ID */}

                          <td className="font-bold">

                            {row.id}

                          </td>


                          {/* CUSTOMER */}

                          <td>

                            <div className="customer-cell">

                              <span className="customer-name">

                                {row.customer.name}

                              </span>

                              <span className="sub-text">

                                {row.customer.email}

                              </span>

                              <span className="sub-text">

                                {row.customer.phone}

                              </span>

                            </div>

                          </td>


                          {/* VEHICLE */}

                          <td>

                            <div className="vehicle-cell">

                              <img
                                src={
                                  row.vehicle.image
                                }
                                alt={
                                  row.vehicle.name
                                }
                                className="car-thumb"
                                onError={(e) => {

                                  e.currentTarget.src =
                                    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&auto=format&fit=crop&q=60';

                                }}
                              />

                              <div>

                                <span className="vehicle-name">

                                  {row.vehicle.name}

                                </span>

                                <span className="sub-text">

                                  {row.vehicle.type}

                                </span>

                              </div>

                            </div>

                          </td>


                          {/* PICKUP & DROP */}

                          <td>

                            <div className="location-cell">

                              <div>

                                <MapPin
                                  size={12}
                                  className="pin-icon"
                                />

                                {row.pickup}

                              </div>

                              <div>

                                <MapPin
                                  size={12}
                                  className="pin-icon"
                                />

                                {row.drop}

                              </div>

                            </div>

                          </td>


                          {/* DATES */}

                          <td>

                            <div className="dates-cell">

                              <span>

                                {row.dates.split(
                                  ' - '
                                )[0]}

                              </span>

                              <span>

                                {row.dates.split(
                                  ' - '
                                )[1] || ''}

                              </span>

                              <span className="sub-text">

                                {row.duration}

                              </span>

                            </div>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`badge badge-${row.status.toLowerCase()}`}
                            >

                              {row.status}

                            </span>

                          </td>


                          {/* AMOUNT */}

                          <td className="font-bold">

                            {row.amount}

                          </td>


                          {/* ACTION */}

                          <td>

                            <div className="action-buttons-group">


                              {/* THREE DOT */}

                              <div className="dropdown-container">

                                <button
                                  className="action-icon-btn"
                                  onClick={() =>
                                    setActiveDropdownId(
                                      activeDropdownId ===
                                      row.id
                                        ? null
                                        : row.id
                                    )
                                  }
                                  disabled={
                                    actionLoading
                                  }
                                >

                                  <MoreVertical
                                    size={18}
                                  />

                                </button>


                                {activeDropdownId ===
                                  row.id && (

                                  <div className="status-dropdown-menu">

                                    <button
                                      onClick={() =>
                                        updateStatus(
                                          row.id,
                                          'Pending'
                                        )
                                      }
                                    >
                                      Set Pending
                                    </button>

                                    <button
                                      onClick={() =>
                                        updateStatus(
                                          row.id,
                                          'Confirmed'
                                        )
                                      }
                                    >
                                      Set Confirmed
                                    </button>

                                    <button
                                      onClick={() =>
                                        updateStatus(
                                          row.id,
                                          'Cancelled'
                                        )
                                      }
                                    >
                                      Set Cancelled
                                    </button>

                                    <div className="dropdown-divider">
                                    </div>

                                    <button
                                      className="text-red-option"
                                      onClick={() =>
                                        handleDeleteRow(
                                          row.id
                                        )
                                      }
                                    >

                                      <Trash2
                                        size={12}
                                      />

                                      Delete Booking

                                    </button>

                                  </div>

                                )}

                              </div>


                              {/* VIEW */}

                              <button
                                className="action-icon-btn view-btn"
                                onClick={() =>
                                  setSelectedBooking(
                                    row
                                  )
                                }
                                title="View Details"
                              >

                                <Eye size={18} />

                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="8"
                        className="no-data"
                      >

                        No bookings found matching your
                        filter criteria

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            <div className="br-footer">

              <span className="entries-info">

                Showing{' '}

                {filteredBookings.length > 0
                  ? (
                    (currentPage - 1) *
                    itemsPerPage
                  ) + 1
                  : 0}

                {' '}to{' '}

                {Math.min(
                  currentPage *
                  itemsPerPage,
                  filteredBookings.length
                )}

                {' '}of{' '}

                {filteredBookings.length}

                {' '}entries

              </span>


              <div className="pagination-controls">

                <button
                  className="page-nav"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (p) =>
                        Math.max(
                          p - 1,
                          1
                        )
                    )
                  }
                >

                  <ChevronLeft
                    size={16}
                  />

                </button>


                {Array.from(
                  {
                    length:
                      totalPages
                  },
                  (_, i) =>
                    i + 1
                ).map(
                  (page) => (

                    <button
                      key={page}
                      className={`page-num ${
                        currentPage ===
                        page
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                    >

                      {page}

                    </button>

                  )
                )}


                <button
                  className="page-nav"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (p) =>
                        Math.min(
                          p + 1,
                          totalPages
                        )
                    )
                  }
                >

                  <ChevronRight
                    size={16}
                  />

                </button>


                <select
                  className="page-size-select"
                  defaultValue="6"
                >

                  <option value="6">
                    6 / page
                  </option>

                  <option value="10">
                    10 / page
                  </option>

                </select>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT SIDE BOOKING DETAILS
        ================================================= */}

        {selectedBooking && (

          <div className="br-details-sidebar">


            {/* HEADER */}

            <div className="details-header">

              <h3>
                Booking Details
              </h3>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedBooking(
                    null
                  )
                }
              >

                <X size={18} />

              </button>

            </div>


            {/* ID */}

            <div className="details-id-row">

              <h4>
                {selectedBooking.id}
              </h4>

              <span
                className={`badge badge-${selectedBooking.status.toLowerCase()}`}
              >

                {selectedBooking.status}

              </span>

            </div>


            <p className="booked-on">

              Booked on{' '}

              {selectedBooking.bookedOn}

            </p>


            <div className="details-scrollable-content">


              {/* =================================================
                  CUSTOMER INFO
              ================================================= */}

              <div className="details-section">

                <div className="section-title">

                  <User size={16} />

                  <span>
                    Customer Information
                  </span>

                </div>


                <div className="info-grid">

                  <div>

                    <span>
                      Name
                    </span>

                    <strong>
                      {selectedBooking.customer.name}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Email
                    </span>

                    <strong>
                      {selectedBooking.customer.email}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Phone
                    </span>

                    <strong>
                      {selectedBooking.customer.phone}
                    </strong>

                  </div>


                  <div>

                    <span>
                      License No.
                    </span>

                    <strong>
                      {selectedBooking.customer.license}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Address
                    </span>

                    <strong>
                      {selectedBooking.customer.address}
                    </strong>

                  </div>

                </div>

              </div>


              {/* =================================================
                  VEHICLE INFO
              ================================================= */}

              <div className="details-section">

                <div className="section-title">

                  <Car size={16} />

                  <span>
                    Vehicle Information
                  </span>

                </div>


                <div className="vehicle-details-card">

                  <img
                    src={
                      selectedBooking.vehicle.image
                    }
                    alt={
                      selectedBooking.vehicle.name
                    }
                    onError={(e) => {

                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&auto=format&fit=crop&q=60';

                    }}
                  />

                  <div>

                    <strong>

                      {
                        selectedBooking
                          .vehicle
                          .name
                      }

                    </strong>

                    <p>

                      {
                        selectedBooking
                          .vehicle
                          .type
                      }

                    </p>

                  </div>

                </div>


                <div className="info-grid horizontal">


                  <div>

                    <span>
                      Year
                    </span>

                    <strong>
                      {
                        selectedBooking
                          .vehicle
                          .year
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Transmission
                    </span>

                    <strong>
                      {
                        selectedBooking
                          .vehicle
                          .transmission
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Fuel Type
                    </span>

                    <strong>
                      {
                        selectedBooking
                          .vehicle
                          .fuel
                      }
                    </strong>

                  </div>

                </div>

              </div>


              {/* =================================================
                  TRIP DETAILS
              ================================================= */}

              <div className="details-section">

                <div className="section-title">

                  <MapPin size={16} />

                  <span>
                    Trip Details
                  </span>

                </div>


                <div className="info-grid">


                  <div>

                    <span>
                      Pickup Location
                    </span>

                    <strong>
                      {
                        selectedBooking
                          .pickup
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Drop-off Location
                    </span>

                    <strong>
                      {
                        selectedBooking
                          .drop
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Pickup Date
                    </span>

                    <strong>
                      {
                        selectedBooking
                          .pickupDate
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Drop-off Date
                    </span>

                    <strong>
                      {
                        selectedBooking
                          .dropoffDate
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Duration
                    </span>

                    <strong>
                      {
                        selectedBooking
                          .duration
                      }
                    </strong>

                  </div>

                </div>

              </div>


              {/* =================================================
                  PAYMENT INFO
              ================================================= */}

              <div className="details-section">

                <div className="section-title">

                  <Calendar size={16} />

                  <span>
                    Payment Information
                  </span>

                </div>


                <div className="info-grid">


                  <div>

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      {
                        selectedBooking
                          .amount
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Payment Method
                    </span>

                    <strong>
                      {
                        selectedBooking
                          .paymentMethod
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Payment Status
                    </span>

                    <strong
                      className={
                        selectedBooking
                          .paymentStatus ===
                        'Paid'
                          ? 'text-green'
                          : 'text-red'
                      }
                    >

                      {
                        selectedBooking
                          .paymentStatus
                      }

                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                DETAILS ACTIONS
            ================================================= */}

            <div className="details-actions">

              <button
                className="btn-confirm-full"
                onClick={() =>
                  updateStatus(
                    selectedBooking.id,
                    'Confirmed'
                  )
                }
                disabled={
                  actionLoading
                }
              >

                {actionLoading
                  ? 'Updating...'
                  : 'Confirm Booking'}

              </button>


              <button
                className="btn-reject-outline"
                onClick={() =>
                  updateStatus(
                    selectedBooking.id,
                    'Cancelled'
                  )
                }
                disabled={
                  actionLoading
                }
              >

                Reject Request

              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};


export default BookingRequest;