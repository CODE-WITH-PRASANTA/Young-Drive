import React, { useState, useEffect } from 'react';
import './AllBookings.css';
import API from '../../api/axios';

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
  FaChevronRight
} from 'react-icons/fa';

const AllBookings = () => {

  /* =====================================================
     DATABASE STATE
  ===================================================== */

  const [bookings, setBookings] = useState([]);

  const [activeTab, setActiveTab] = useState('All');

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [activeMenuId, setActiveMenuId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeDetailsTab, setActiveDetailsTab] = useState('Details');

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);


  /* =====================================================
     CANCELLATION SIDEBAR CONTROLS
  ===================================================== */

  const [showCancelBox, setShowCancelBox] = useState(false);

  const [cancellationReason, setCancellationReason] =
    useState('Select reason');

  const [cancellationComment, setCancellationComment] =
    useState('');


  /* =====================================================
     PAGINATION
  ===================================================== */

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;


  /* =====================================================
     NEW BOOKING FORM
  ===================================================== */

  const [newBooking, setNewBooking] = useState({
    customerName: '',
    email: '',
    phone: '',
    vehicle: 'Audi A3 1.6 TDI S line',
    pickupDate: '',
    returnDate: '',
    amount: ''
  });


  /* =====================================================
     FETCH BOOKINGS FROM BACKEND
  ===================================================== */

  const fetchBookings = async () => {

    try {

      setLoading(true);

      const params = {};

      if (activeTab !== 'All') {
        params.status = activeTab;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }


      console.log(
        'Fetching bookings:',
        params
      );


      const response = await API.get(
        '/bookings',
        {
          params
        }
      );


      console.log(
        'Bookings response:',
        response.data
      );


      /*
        Supports:

        {
          success: true,
          data: []
        }

        OR

        {
          data: []
        }

        OR

        []
      */

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


      setBookings(
        bookingData
      );


      /*
        If selected booking was
        updated/deleted, update
        sidebar automatically.
      */

      if (selectedBooking) {

        const updatedBooking =
          bookingData.find(
            (booking) =>
              String(
                booking.id ||
                booking._id
              ) ===
              String(
                selectedBooking.id ||
                selectedBooking._id
              )
          );


        if (updatedBooking) {

          setSelectedBooking(
            updatedBooking
          );

        } else {

          setSelectedBooking(
            null
          );

        }

      }

    } catch (error) {

      console.error(
        'Failed to fetch bookings:',
        error
      );


      console.error(
        'Server response:',
        error?.response?.data
      );


      setBookings([]);

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     FETCH WHEN FILTER / SEARCH CHANGES
  ===================================================== */

  useEffect(() => {

    fetchBookings();

  }, [
    activeTab,
    searchTerm
  ]);


  /* =====================================================
     TOTAL REVENUE
  ===================================================== */

  const calculateTotalRevenue = (
    bookingList
  ) => {

    const total =
      bookingList.reduce(
        (sum, item) => {

          if (
            item.amount === undefined ||
            item.amount === null
          ) {
            return sum;
          }


          const numericVal =
            parseFloat(
              String(item.amount)
                .replace(
                  /[^0-9.-]+/g,
                  ''
                )
            ) || 0;


          return (
            sum +
            numericVal
          );

        },
        0
      );


    return `$${total.toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )}`;

  };


  /* =====================================================
     CLIENT-SIDE FILTER
  ===================================================== */

  const filteredBookings =
    bookings.filter((b) => {

      const bookingStatus =
        b.status || 'Pending';


      const matchesTab =
        activeTab === 'All' ||
        bookingStatus
          .toLowerCase() ===
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
          b.id ||
          b._id ||
          ''
        ).toLowerCase();


      const customerName =
        String(
          b.customer?.name ||
          b.customerName ||
          ''
        ).toLowerCase();


      const customerEmail =
        String(
          b.customer?.email ||
          b.email ||
          ''
        ).toLowerCase();


      const customerPhone =
        String(
          b.customer?.phone ||
          b.phone ||
          ''
        ).toLowerCase();


      return (
        matchesTab &&
        (
          bookingId.includes(search) ||
          customerName.includes(search) ||
          customerEmail.includes(search) ||
          customerPhone.includes(search)
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
      startIndex + itemsPerPage
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
        'No booking records available to export.'
      );

      return;

    }


    const headers =
      [
        'Booking ID',
        'Date',
        'Customer Name',
        'Email',
        'Phone',
        'Vehicle',
        'Pickup',
        'Return',
        'Amount',
        'Status'
      ].join(',') + '\n';


    const rows =
      filteredBookings.map(
        (b) => {

          const id =
            b.id ||
            b._id ||
            '';


          const customerName =
            b.customer?.name ||
            b.customerName ||
            '';


          const email =
            b.customer?.email ||
            b.email ||
            '';


          const phone =
            b.customer?.phone ||
            b.phone ||
            '';


          const vehicle =
            b.vehicle?.name ||
            b.vehicleName ||
            '';


          const pickup =
            b.pickup ||
            b.pickupDate ||
            '';


          const returnDate =
            b.returnDate ||
            b.dropoffDate ||
            '';


          const amount =
            b.amount ||
            '';


          const status =
            b.status ||
            '';


          const date =
            b.date ||
            b.createdAt ||
            '';


          return [
            id,
            date,
            customerName,
            email,
            phone,
            vehicle,
            pickup,
            returnDate,
            amount,
            status
          ]
            .map(
              (value) =>
                `"${String(value)
                  .replace(
                    /"/g,
                    '""'
                  )}"`
            )
            .join(',');

        }
      );


    const blob =
      new Blob(
        [
          headers +
          rows.join('\n')
        ],
        {
          type:
            'text/csv;charset=utf-8;'
        }
      );


    const url =
      window.URL.createObjectURL(
        blob
      );


    const a =
      document.createElement(
        'a'
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
     GET BOOKING ID
  ===================================================== */

  const getBookingId = (
    booking
  ) => {

    return (
      booking?.id ||
      booking?._id
    );

  };


  /* =====================================================
     UPDATE BOOKING STATUS
  ===================================================== */

  const handleStatusChange = async (
    id,
    newStatus,
    reason = '',
    comment = ''
  ) => {

    try {

      setSaving(true);

      setActiveMenuId(null);


      const payload = {
        status: newStatus
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
        'Updating booking:',
        id,
        payload
      );


      /*
        Backend endpoint:

        PATCH
        /api/bookings/:id/status
      */

      const response =
        await API.patch(
          `/bookings/${encodeURIComponent(
            id
          )}/status`,
          payload
        );


      console.log(
        'Status update response:',
        response.data
      );


      if (
        response.data?.success
      ) {

        /*
          Update local table immediately.
        */

        setBookings(
          (prev) =>
            prev.map(
              (booking) => {

                const bookingId =
                  getBookingId(
                    booking
                  );


                if (
                  String(
                    bookingId
                  ) ===
                  String(id)
                ) {

                  return {
                    ...booking,
                    status:
                      newStatus
                  };

                }


                return booking;

              }
            )
        );


        /*
          Update selected sidebar.
        */

        if (
          selectedBooking &&
          String(
            getBookingId(
              selectedBooking
            )
          ) ===
          String(id)
        ) {

          setSelectedBooking(
            response.data.data ||
            {
              ...selectedBooking,
              status:
                newStatus
            }
          );

        }


        /*
          Refresh from database.
        */

        await fetchBookings();

      } else {

        alert(
          response.data?.message ||
          'Failed to update booking status.'
        );

      }

    } catch (err) {

      console.error(
        'Failed to update booking status:',
        err
      );


      console.error(
        'Server response:',
        err?.response?.data
      );


      alert(
        err?.response?.data?.message ||
        'Failed to update booking status.'
      );

    } finally {

      setSaving(false);

    }

  };


  /* =====================================================
     CANCEL BOOKING
  ===================================================== */

  const handleCancelBookingSubmit = async () => {

    if (!selectedBooking) {
      return;
    }


    if (
      !cancellationReason ||
      cancellationReason ===
        'Select reason'
    ) {

      alert(
        'Please select a reason for cancellation.'
      );

      return;

    }


    await handleStatusChange(
      getBookingId(
        selectedBooking
      ),
      'Cancelled',
      cancellationReason,
      cancellationComment
    );


    setCancellationReason(
      'Select reason'
    );

    setCancellationComment('');

    setShowCancelBox(false);


    alert(
      `Booking ${
        getBookingId(
          selectedBooking
        )
      } has been cancelled.`
    );

  };


  /* =====================================================
     CREATE NEW BOOKING
  ===================================================== */

  const handleAddBookingSubmit = async (
    e
  ) => {

    e.preventDefault();


    try {

      setSaving(true);


      /*
        Send exactly the fields
        from your existing form.
      */

      const payload = {

        customerName:
          newBooking.customerName,

        email:
          newBooking.email,

        phone:
          newBooking.phone,

        vehicle:
          newBooking.vehicle,

        pickupDate:
          newBooking.pickupDate,

        returnDate:
          newBooking.returnDate,

        amount:
          Number(
            newBooking.amount
          ),

        status:
          'Pending',

        paymentStatus:
          'Unpaid'

      };


      console.log(
        'Creating booking:',
        payload
      );


      /*
        Backend:

        POST
        /api/bookings
      */

      const response =
        await API.post(
          '/bookings',
          payload
        );


      console.log(
        'Create booking response:',
        response.data
      );


      if (
        response.data?.success
      ) {

        /*
          Close modal.
        */

        setIsModalOpen(
          false
        );


        /*
          Reset form.
        */

        setNewBooking({

          customerName: '',

          email: '',

          phone: '',

          vehicle:
            'Audi A3 1.6 TDI S line',

          pickupDate: '',

          returnDate: '',

          amount: ''

        });


        /*
          Refresh database data.
        */

        await fetchBookings();


        /*
          Go to first page.
        */

        setCurrentPage(1);

      } else {

        alert(
          response.data?.message ||
          'Failed to create booking.'
        );

      }

    } catch (error) {

      console.error(
        'Create booking error:',
        error
      );


      console.error(
        'Server response:',
        error?.response?.data
      );


      alert(
        error?.response?.data?.message ||
        'Failed to create booking. Please check your backend connection.'
      );

    } finally {

      setSaving(false);

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
    totalPages
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

            Dashboard &gt; Bookings &gt;{' '}

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
            onClick={() =>
              setIsModalOpen(true)
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
                  b =>
                    b.status ===
                    'Confirmed'
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
                  b =>
                    b.status ===
                    'Ongoing'
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
                  b =>
                    b.status ===
                    'Completed'
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
                  b =>
                    b.status ===
                    'Cancelled'
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
              ? 'with-sidebar'
              : 'full-width'
          }`}
        >


          {/* Status Tabs */}

          <div className="AllBookings-status-tabs">

            {[
              'All',
              'Pending',
              'Confirmed',
              'Ongoing',
              'Completed',
              'Cancelled'
            ].map(
              (tab) => {

                const count =
                  tab === 'All'
                    ? bookings.length
                    : bookings.filter(
                        b =>
                          b.status
                            ?.toLowerCase() ===
                          tab.toLowerCase()
                      ).length;


                return (

                  <button
                    key={tab}
                    className={`AllBookings-tab-btn ${tab.toLowerCase()} ${
                      activeTab === tab
                        ? 'active'
                        : ''
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
                          'center',
                        padding:
                          '2rem'
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


                      return (

                        <tr
                          key={
                            bookingId
                          }
                          className={
                            selectedBooking &&
                            getBookingId(
                              selectedBooking
                            ) ===
                              bookingId
                              ? 'selected-row'
                              : ''
                          }
                        >


                          {/* BOOKING */}

                          <td className="AllBookings-td-id">

                            <span className="AllBookings-id-text">

                              {bookingId}

                            </span>

                            <span className="AllBookings-sub-text">

                              {
                                item.date ||
                                item.createdAt ||
                                ''
                              }

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
                                    'N/A'
                                  }

                                </strong>

                                <span className="AllBookings-sub-text">

                                  {
                                    item.customer
                                      ?.email ||
                                    item.email ||
                                    'N/A'
                                  }

                                </span>

                                <span className="AllBookings-sub-text">

                                  {
                                    item.customer
                                      ?.phone ||
                                    item.phone ||
                                    'N/A'
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

                                  {
                                    item.vehicle
                                      ?.name ||
                                    item.vehicleName ||
                                    'N/A'
                                  }

                                </strong>

                                <span className="AllBookings-sub-text">

                                  {
                                    item.vehicle
                                      ?.color ||
                                    item.vehicleColor ||
                                    ''
                                  }

                                </span>

                                <span className="AllBookings-plate-badge">

                                  {
                                    item.vehicle
                                      ?.plate ||
                                    item.vehiclePlate ||
                                    ''
                                  }

                                </span>

                              </div>

                            </div>

                          </td>


                          {/* PICKUP RETURN */}

                          <td>

                            <div className="AllBookings-dates-cell">

                              <span>

                                {
                                  item.pickup ||
                                  item.pickupDate ||
                                  'N/A'
                                }

                              </span>

                              <span>

                                {
                                  item.returnDate ||
                                  item.dropoffDate ||
                                  'N/A'
                                }

                              </span>

                              <span className="AllBookings-sub-text">

                                {
                                  item.duration ||
                                  ''
                                }

                              </span>

                            </div>

                          </td>


                          {/* AMOUNT */}

                          <td>

                            <div className="AllBookings-amount-cell">

                              <strong>

                                {
                                  item.amount ||
                                  '$0.00'
                                }

                              </strong>

                              <span
                                className={`AllBookings-pay-badge ${
                                  item.paymentStatus
                                    ? item.paymentStatus.toLowerCase()
                                    : 'unpaid'
                                }`}
                              >

                                {
                                  item.paymentStatus ||
                                  'Unpaid'
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
                                  : 'pending'
                              }`}
                            >

                              {
                                item.status ||
                                'Pending'
                              }

                            </span>

                          </td>


                          {/* ACTIONS */}

                          <td className="AllBookings-td-actions">

                            <button
                              className="AllBookings-action-btn view"
                              onClick={() =>
                                setSelectedBooking(
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
                                    onClick={() =>
                                      handleStatusChange(
                                        bookingId,
                                        'Confirmed'
                                      )
                                    }
                                  >
                                    Set Confirmed
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        bookingId,
                                        'Ongoing'
                                      )
                                    }
                                  >
                                    Set Ongoing
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        bookingId,
                                        'Completed'
                                      )
                                    }
                                  >
                                    Set Completed
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        bookingId,
                                        'Pending'
                                      )
                                    }
                                  >
                                    Set Pending
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        bookingId,
                                        'Cancelled'
                                      )
                                    }
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
                          'center',
                        padding:
                          '2rem'
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

              Showing{' '}

              {
                filteredBookings.length ===
                0
                  ? 0
                  : startIndex + 1
              }

              {' '}to{' '}

              {
                Math.min(
                  startIndex +
                    itemsPerPage,
                  filteredBookings.length
                )
              }

              {' '}of{' '}

              {
                filteredBookings.length
              }

              {' '}bookings

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
                    totalPages
                },
                (_, i) =>
                  i + 1
              ).map(
                (page) => (

                  <button
                    key={page}
                    className={`AllBookings-page-btn ${
                      currentPage === page
                        ? 'active'
                        : ''
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


        {/* =================================================
            SIDEBAR DETAILS
        ================================================= */}

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
                      selectedBooking.date ||
                      selectedBooking.createdAt ||
                      'N/A'
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
                      'Unpaid'
                    }

                  </span>

                </div>

              </div>

            </div>


            {/* Details Tabs */}

            <div className="AllBookings-sidebar-tabs">

              {[
                'Details',
                'Customer',
                'Payment',
                'History'
              ].map(
                (tab) => (

                  <button
                    key={tab}
                    className={`AllBookings-sidebar-tab ${
                      activeDetailsTab ===
                      tab
                        ? 'active'
                        : ''
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
                'Details' && (

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
                          selectedBooking
                            .vehicle
                            ?.name ||
                          selectedBooking
                            .vehicleName ||
                          'N/A'
                        }

                        {' '}

                        {
                          selectedBooking
                            .vehicle
                            ?.color
                            ? `(${selectedBooking.vehicle.color})`
                            : ''
                        }

                      </p>

                    </div>


                    <div className="AllBookings-info-group">

                      <label>
                        Pickup Date
                      </label>

                      <p>

                        {
                          selectedBooking.pickup ||
                          selectedBooking.pickupDate ||
                          'N/A'
                        }

                      </p>

                    </div>


                    <div className="AllBookings-info-group">

                      <label>
                        Return Date
                      </label>

                      <p>

                        {
                          selectedBooking.returnDate ||
                          selectedBooking.dropoffDate ||
                          'N/A'
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
                          'N/A'
                        }

                      </p>

                    </div>


                    <div className="AllBookings-info-group">

                      <label>
                        Pickup Location
                      </label>

                      <p>

                        {
                          selectedBooking.pickupLoc ||
                          selectedBooking.pickupLocation ||
                          'N/A'
                        }

                      </p>

                    </div>


                    <div className="AllBookings-info-group">

                      <label>
                        Return Location
                      </label>

                      <p>

                        {
                          selectedBooking.returnLoc ||
                          selectedBooking.dropoffLocation ||
                          selectedBooking.returnLocation ||
                          'N/A'
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
                          'N/A'
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

                        {
                          selectedBooking.amount ||
                          '$0.00'
                        }

                      </span>

                    </div>


                    <div className="AllBookings-price-row total">

                      <strong>
                        Total Amount
                      </strong>

                      <strong className="purple-text">

                        {
                          selectedBooking.amount ||
                          '$0.00'
                        }

                      </strong>

                    </div>

                  </div>

                </>

              )}


              {/* CUSTOMER TAB */}

              {activeDetailsTab ===
                'Customer' && (

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
                        'N/A'
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
                        'N/A'
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
                        'N/A'
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
                        'N/A'
                      }

                    </p>

                  </div>

                </div>

              )}


              {/* PAYMENT TAB */}

              {activeDetailsTab ===
                'Payment' && (

                <div className="AllBookings-details-section">

                  <h4>
                    Payment Information
                  </h4>


                  <div className="AllBookings-info-group">

                    <label>
                      Amount
                    </label>

                    <p>

                      {
                        selectedBooking.amount ||
                        '$0.00'
                      }

                    </p>

                  </div>


                  <div className="AllBookings-info-group">

                    <label>
                      Payment Method
                    </label>

                    <p>

                      {
                        selectedBooking.paymentMethod ||
                        'N/A'
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
                        'Unpaid'
                      }

                    </p>

                  </div>

                </div>

              )}


              {/* HISTORY TAB */}

              {activeDetailsTab ===
                'History' && (

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
                        selectedBooking.createdAt ||
                        selectedBooking.date ||
                        'N/A'
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
                        'Pending'
                      }

                    </p>

                  </div>


                  <div className="AllBookings-info-group">

                    <label>
                      Updated At
                    </label>

                    <p>

                      {
                        selectedBooking.updatedAt ||
                        'N/A'
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
                      getBookingId(
                        selectedBooking
                      ),
                      'Confirmed'
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
                      getBookingId(
                        selectedBooking
                      ),
                      'Ongoing'
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
                      getBookingId(
                        selectedBooking
                      ),
                      'Completed'
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
                      ? 'Hide Cancel Form'
                      : 'Cancel Booking'
                  }

                </button>

              </div>


              {/* Cancel Form */}

              {showCancelBox && (

                <div
                  className="AllBookings-cancel-box"
                  style={{
                    marginTop:
                      '1rem'
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
                        '100%',
                      marginTop:
                        '0.5rem',
                      padding:
                        '0.5rem',
                      cursor:
                        'pointer'
                    }}
                    onClick={
                      handleCancelBookingSubmit
                    }
                    disabled={saving}
                  >

                    {
                      saving
                        ? 'Updating...'
                        : 'Submit Cancellation'
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
                    setNewBooking({
                      ...newBooking,
                      customerName:
                        e.target.value
                    })
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
                    setNewBooking({
                      ...newBooking,
                      email:
                        e.target.value
                    })
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
                    setNewBooking({
                      ...newBooking,
                      phone:
                        e.target.value
                    })
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
                    setNewBooking({
                      ...newBooking,
                      vehicle:
                        e.target.value
                    })
                  }
                >

                  <option>
                    Audi A3 1.6 TDI S line
                  </option>

                  <option>
                    Mercedes-Benz C220d
                  </option>

                  <option>
                    Volkswagen Golf GTD
                  </option>

                  <option>
                    Volvo S60 D4 R-Design
                  </option>

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
                      setNewBooking({
                        ...newBooking,
                        pickupDate:
                          e.target.value
                      })
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
                      setNewBooking({
                        ...newBooking,
                        returnDate:
                          e.target.value
                      })
                    }
                  />

                </div>

              </div>


              {/* Amount */}

              <div className="AllBookings-form-group">

                <label>
                  Amount ($)
                </label>

                <input
                  type="number"
                  min="0"
                  required
                  value={
                    newBooking.amount
                  }
                  onChange={(e) =>
                    setNewBooking({
                      ...newBooking,
                      amount:
                        e.target.value
                    })
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
                  disabled={saving}
                >

                  {
                    saving
                      ? 'Creating...'
                      : 'Create Booking'
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