import React, { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Mail,
  X,
  Filter,
  MoreVertical,
  ShieldCheck,
  Car,
  Settings,
  Fuel,
  Users,
} from "lucide-react";

import "./BookingCalender.css";
import API from "../../api/axios";

/* =========================================================
   HELPERS
========================================================= */

const getId = (item) => {
  if (!item) return "";

  return item._id || item.id || item.vehicleId || item.vehicleID || "";
};

/* =========================================================
   DATE HELPERS
========================================================= */

const getTodayInputDate = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getFutureInputDate = (days = 2) => {
  const date = new Date();

  date.setDate(date.getDate() + days);

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* =========================================================
   COMBINE DATE + TIME
========================================================= */

const combineDateTime = (date, time) => {
  if (!date) return null;

  if (!time) {
    return new Date(`${date}T00:00:00`).toISOString();
  }

  const match = time.replace(/\s/g, "").match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);

  if (!match) {
    return new Date(`${date}T00:00:00`).toISOString();
  }

  let hours = Number(match[1]);

  const minutes = Number(match[2]);

  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const result = new Date(`${date}T00:00:00`);

  result.setHours(hours, minutes, 0, 0);

  return result.toISOString();
};

/* =========================================================
   GET INPUT DATE
========================================================= */

const getInputDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

/* =========================================================
   VEHICLE NORMALIZER
========================================================= */

const normalizeVehicle = (vehicle, index = 0) => {
  if (!vehicle) return null;

  const id =
    vehicle._id ||
    vehicle.id ||
    vehicle.vehicleId ||
    vehicle.vehicleID ||
    `vehicle-${index}`;

  const brand = vehicle.vehicleBrand || vehicle.brand || "";

  const model =
    vehicle.vehicleModel ||
    vehicle.model ||
    vehicle.name ||
    vehicle.title ||
    vehicle.vehicleName ||
    "";

  const name =
    [brand, model].filter(Boolean).join(" ") ||
    vehicle.name ||
    vehicle.title ||
    vehicle.vehicleName ||
    "Vehicle";

  const type =
    vehicle.vehicleType || vehicle.type || vehicle.category || "Vehicle";

  const category =
    vehicle.category || vehicle.vehicleType || vehicle.type || "Vehicle";

  const images = Array.isArray(vehicle.images) ? vehicle.images : [];

  const image = vehicle.image || vehicle.thumbnail || images[0] || "";

  return {
    ...vehicle,

    id: String(id),

    name,

    title: vehicle.title || name,

    type,

    category,

    image,

    images,

    transmission: vehicle.transmission || vehicle.gearbox || "Automatic",

    fuel: vehicle.fuelType || vehicle.fuel || "Petrol",

    fuelType: vehicle.fuelType || vehicle.fuel || "Petrol",

    seats:
      vehicle.seatingCapacity || vehicle.seats || vehicle.capacity || "5 Seats",
  };
};

/* =========================================================
   BOOKING NORMALIZER
========================================================= */

const normalizeBooking = (booking) => {
  if (!booking) return null;

  const vehicleObject =
    booking.vehicle && typeof booking.vehicle === "object"
      ? booking.vehicle
      : null;

  const vehicleName =
    vehicleObject?.name ||
    vehicleObject?.title ||
    [vehicleObject?.vehicleBrand, vehicleObject?.vehicleModel]
      .filter(Boolean)
      .join(" ") ||
    booking.vehicleName ||
    booking.car ||
    (typeof booking.vehicle === "string" ? booking.vehicle : "Vehicle");

  const pickupDate =
    booking.pickupDate ||
    booking.startDate ||
    booking.pickup ||
    booking.bookingDate ||
    booking.date;

  const dropoffDate =
    booking.dropoffDate ||
    booking.returnDate ||
    booking.endDate ||
    booking.return;

  const pickupTime = booking.pickupTime || formatTime(pickupDate) || "10:00 AM";

  const dropoffTime =
    booking.dropoffTime || formatTime(dropoffDate) || "10:00 AM";

  const customerObject =
    booking.customer && typeof booking.customer === "object"
      ? booking.customer
      : null;

  const customerName =
    customerObject?.name ||
    customerObject?.fullName ||
    customerObject?.customerName ||
    booking.customerName ||
    booking.fullName ||
    booking.name ||
    "N/A";

  const customerEmail =
    customerObject?.email || booking.email || booking.customerEmail || "";

  const customerPhone =
    customerObject?.phone || booking.phone || booking.customerPhone || "";

  const vehicle = vehicleObject || {
    name: vehicleName,
    title: vehicleName,
    type: "Vehicle",
    category: "Vehicle",
    image: "",
  };

  /*
   * IMPORTANT
   *
   * Keep MongoDB _id separately.
   * Do NOT use bookingId as the MongoDB update ID.
   */
  const mongoId = booking._id || booking.mongoId || booking.idMongo || null;

  return {
    ...booking,

    /*
     * MongoDB ID
     */
    _id: mongoId,

    mongoId: mongoId,

    /*
     * UI ID
     *
     * Prefer MongoDB _id.
     */
    id: mongoId || booking.id || booking.bookingId || `booking-${Date.now()}`,

    /*
     * Business booking ID
     */
    bookingId: booking.bookingId || mongoId || booking.id,

    car: vehicleName,

    vehicle,

    type: booking.bookingType || booking.type || "pickup-drop",

    fullPickupDate: pickupDate,

    fullDropoffDate: dropoffDate,

    pickupTime,

    dropoffTime,

    time: `${pickupTime} - ${formatDate(pickupDate)}`,

    date: pickupDate ? new Date(pickupDate).getDate() : null,

    price: Number(booking.amount ?? booking.price ?? 0),

    location:
      booking.pickupLocation || booking.pickupLoc || booking.location || "",

    dropLocation:
      booking.dropoffLocation ||
      booking.dropLocation ||
      booking.returnLoc ||
      "",

    status: booking.status || "Pending",

    customer: {
      ...customerObject,

      name: customerName,

      email: customerEmail,

      phone: customerPhone,
    },

    customerName,

    email: customerEmail,

    phone: customerPhone,
  };
};

/* =========================================================
   RESPONSE ARRAY
========================================================= */

const getResponseArray = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.vehicles)) {
    return data.vehicles;
  }

  if (Array.isArray(data?.bookings)) {
    return data.bookings;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

/* =========================================================
   COMPONENT
========================================================= */

const BookingCalender = () => {
  /* =======================================================
     CALENDAR
  ======================================================= */

  const [currentDate, setCurrentDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const [selectedMiniDate, setSelectedMiniDate] = useState(
    new Date().getDate(),
  );

  /* =======================================================
     DATA
  ======================================================= */

  const [bookings, setBookings] = useState([]);

  const [vehicles, setVehicles] = useState([]);

  const [locations, setLocations] = useState([]);

  /* =======================================================
     LOADING
  ======================================================= */

  const [loadingBookings, setLoadingBookings] = useState(false);

  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [loadingLocations, setLoadingLocations] = useState(false);

  const [saving, setSaving] = useState(false);

  /* =======================================================
     FILTERS
  ======================================================= */

  const [filterVehicle, setFilterVehicle] = useState("All Vehicles");

  const [filterLocation, setFilterLocation] = useState("All Locations");

  const [filterStatus, setFilterStatus] = useState("All Status");

  const [appliedFilters, setAppliedFilters] = useState({
    vehicle: "All Vehicles",
    location: "All Locations",
    status: "All Status",
  });

  /* =======================================================
     MODAL
  ======================================================= */

  const [isModalOpen, setIsModalOpen] = useState(false);

  /* =======================================================
     EDIT MODE
  ======================================================= */

  const [editingBookingId, setEditingBookingId] = useState(null);

  const [editingBooking, setEditingBooking] = useState(null);

  /* =======================================================
     FORM
  ======================================================= */

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [bookingDate, setBookingDate] = useState(getTodayInputDate());

  const [bookingTime, setBookingTime] = useState("10:00 AM");

  const [pickupDate, setPickupDate] = useState(getTodayInputDate());

  const [pickupTime, setPickupTime] = useState("10:00 AM");

  const [dropoffDate, setDropoffDate] = useState(getFutureInputDate(2));

  const [dropoffTime, setDropoffTime] = useState("10:00 AM");

  const [pickupLocation, setPickupLocation] = useState("");

  const [dropoffLocation, setDropoffLocation] = useState("");

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [phoneCode, setPhoneCode] = useState("+91");

  const [phone, setPhone] = useState("");

  const [additionalMessage, setAdditionalMessage] = useState("");

  /* =======================================================
     FETCH VEHICLES
  ======================================================= */

  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);

      const response = await API.get("/vehicles");

      const data = getResponseArray(response);

      const normalized = data
        .map((vehicle, index) => normalizeVehicle(vehicle, index))
        .filter(Boolean);

      setVehicles(normalized);

      setSelectedVehicle((previous) => {
        if (
          previous &&
          normalized.some(
            (vehicle) => String(vehicle.id) === String(previous.id),
          )
        ) {
          return previous;
        }

        return normalized[0] || null;
      });
    } catch (error) {
      console.error("FETCH VEHICLES ERROR:", error);

      console.error("SERVER RESPONSE:", error?.response?.data);

      setVehicles([]);

      setSelectedVehicle(null);
    } finally {
      setLoadingVehicles(false);
    }
  };

  /* =======================================================
     FETCH BOOKINGS
  ======================================================= */

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);

      const response = await API.get("/bookings");

      console.log("RAW BOOKINGS:", response.data);

      const data = getResponseArray(response);

      console.log("BOOKING ARRAY:", data);

      const normalized = data
        .map((booking) => {
          console.log(
            "RAW BOOKING ID:",
            booking?._id,
            "BOOKING ID:",
            booking?.bookingId,
          );

          return normalizeBooking(booking);
        })
        .filter(Boolean);

      console.log("NORMALIZED BOOKINGS:", normalized);

      setBookings(normalized);
    } catch (error) {
      console.error("FETCH BOOKINGS ERROR:", error);

      console.error("SERVER RESPONSE:", error?.response?.data);

      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  /* =======================================================
     FETCH LOCATIONS
  ======================================================= */

  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);

      const response = await API.get("/locations");

      const data = getResponseArray(response);

      setLocations(data);

      if (data.length > 0) {
        const first = data[0];

        const locationName =
          first.name || first.city || first.address || first.location || "";

        setPickupLocation((previous) => previous || locationName);

        setDropoffLocation((previous) => previous || locationName);
      }
    } catch (error) {
      console.error("FETCH LOCATIONS ERROR:", error);

      setLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  /* =======================================================
     INITIAL API CALLS
  ======================================================= */

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
    fetchLocations();
  }, []);

  /* =======================================================
     VEHICLE CHANGE
  ======================================================= */

  const handleVehicleChange = (event) => {
    const vehicleId = event.target.value;

    const vehicle = vehicles.find(
      (item) => String(item.id) === String(vehicleId),
    );

    setSelectedVehicle(vehicle || null);
  };

  /* =======================================================
     APPLY FILTER
  ======================================================= */

  const handleApplyFilter = () => {
    setAppliedFilters({
      vehicle: filterVehicle,

      location: filterLocation,

      status: filterStatus,
    });
  };

  /* =======================================================
     FILTERED BOOKINGS
  ======================================================= */

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const vehicleMatch =
        appliedFilters.vehicle === "All Vehicles" ||
        item.car?.toLowerCase().includes(appliedFilters.vehicle.toLowerCase());

      const locationMatch =
        appliedFilters.location === "All Locations" ||
        item.location
          ?.toLowerCase()
          .includes(appliedFilters.location.toLowerCase());

      const statusMatch =
        appliedFilters.status === "All Status" ||
        item.status?.toLowerCase() === appliedFilters.status.toLowerCase();

      return vehicleMatch && locationMatch && statusMatch;
    });
  }, [bookings, appliedFilters]);

  /* =======================================================
     OPEN NEW / EDIT MODAL
  ======================================================= */

  const handleOpenModal = (booking = null) => {
    if (booking) {
      /*
       * ============================================
       * GET REAL MONGODB BOOKING ID
       * ============================================
       */

      const mongoBookingId =
        booking._id || booking.mongoId || booking.idMongo || null;

      console.log("====================================");

      console.log("EDIT BOOKING OBJECT:", booking);

      console.log("MONGODB BOOKING ID:", mongoBookingId);

      console.log("BUSINESS BOOKING ID:", booking.bookingId);

      console.log("====================================");

      if (!mongoBookingId) {
        alert("MongoDB booking ID not found. Cannot edit this booking.");

        return;
      }

      setEditingBookingId(String(mongoBookingId));

      setEditingBooking(booking);

      /*
       * ============================================
       * VEHICLE
       * ============================================
       */

      const bookingVehicleId =
        booking.vehicle?._id ||
        booking.vehicle?.id ||
        booking.vehicleId ||
        booking.vehicle;

      const foundVehicle = vehicles.find(
        (vehicle) => String(vehicle.id) === String(bookingVehicleId),
      );

      if (foundVehicle) {
        setSelectedVehicle(foundVehicle);
      } else if (booking.vehicle && typeof booking.vehicle === "object") {
        setSelectedVehicle(normalizeVehicle(booking.vehicle));
      } else {
        /*
         * Try vehicleName if ID is not
         * available in the populated object.
         */

        const foundByName = vehicles.find(
          (vehicle) => vehicle.name === booking.vehicleName,
        );

        if (foundByName) {
          setSelectedVehicle(foundByName);
        }
      }

      /*
       * ============================================
       * CUSTOMER
       * ============================================
       */

      setFullName(
        booking.customer?.name ||
          booking.customerName ||
          booking.fullName ||
          "",
      );

      setEmail(booking.customer?.email || booking.email || "");

      /*
       * ============================================
       * PHONE
       * ============================================
       */

      const existingPhone = String(
        booking.customer?.phone || booking.phone || "",
      );

      if (existingPhone.startsWith("+91")) {
        setPhoneCode("+91");

        setPhone(existingPhone.replace(/^\+91/, "").replace(/\D/g, ""));
      } else if (existingPhone.startsWith("+1")) {
        setPhoneCode("+1");

        setPhone(existingPhone.replace(/^\+1/, "").replace(/\D/g, ""));
      } else if (existingPhone.startsWith("+44")) {
        setPhoneCode("+44");

        setPhone(existingPhone.replace(/^\+44/, "").replace(/\D/g, ""));
      } else {
        setPhone(existingPhone.replace(/\D/g, ""));
      }

      /*
       * ============================================
       * MESSAGE
       * ============================================
       */

      setAdditionalMessage(booking.additionalMessage || booking.message || "");

      /*
       * ============================================
       * PICKUP LOCATION
       * ============================================
       */

      const existingPickupLocation =
        booking.pickupLocation || booking.pickupLoc || booking.location || "";

      setPickupLocation(existingPickupLocation);

      /*
       * ============================================
       * DROP-OFF LOCATION
       * ============================================
       */

      const existingDropoffLocation =
        booking.dropoffLocation ||
        booking.dropLocation ||
        booking.returnLoc ||
        "";

      setDropoffLocation(existingDropoffLocation);

      /*
       * ============================================
       * BOOKING DATE
       * ============================================
       */

      setBookingDate(
        getInputDate(booking.bookingDate || booking.date || booking.createdAt),
      );

      /*
       * ============================================
       * PICKUP DATE
       * ============================================
       */

      setPickupDate(
        getInputDate(
          booking.pickupDate || booking.fullPickupDate || booking.startDate,
        ),
      );

      /*
       * ============================================
       * DROP-OFF DATE
       * ============================================
       */

      setDropoffDate(
        getInputDate(
          booking.dropoffDate ||
            booking.fullDropoffDate ||
            booking.returnDate ||
            booking.endDate,
        ),
      );

      /*
       * ============================================
       * BOOKING TIME
       * ============================================
       */

      setBookingTime(booking.bookingTime || "10:00 AM");

      /*
       * ============================================
       * PICKUP TIME
       * ============================================
       */

      setPickupTime(
        booking.pickupTime || formatTime(booking.pickupDate) || "10:00 AM",
      );

      /*
       * ============================================
       * DROP-OFF TIME
       * ============================================
       */

      setDropoffTime(
        booking.dropoffTime ||
          formatTime(booking.dropoffDate || booking.returnDate) ||
          "10:00 AM",
      );
    } else {
      /*
       * ============================================
       * NEW BOOKING
       * ============================================
       */

      setEditingBookingId(null);

      setEditingBooking(null);

      resetBookingForm();
    }

    setIsModalOpen(true);
  };

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetBookingForm = () => {
    setEditingBookingId(null);

    setEditingBooking(null);

    setFullName("");

    setEmail("");

    setPhone("");

    setPhoneCode("+91");

    setAdditionalMessage("");

    setBookingDate(getTodayInputDate());

    setBookingTime("10:00 AM");

    setPickupDate(getTodayInputDate());

    setPickupTime("10:00 AM");

    setDropoffDate(getFutureInputDate(2));

    setDropoffTime("10:00 AM");

    if (vehicles.length > 0) {
      setSelectedVehicle(vehicles[0]);
    } else {
      setSelectedVehicle(null);
    }

    if (locations.length > 0) {
      const first = locations[0];

      const location =
        first.name || first.city || first.address || first.location || "";

      setPickupLocation(location);

      setDropoffLocation(location);
    } else {
      setPickupLocation("");

      setDropoffLocation("");
    }
  };

  /* =======================================================
     CREATE / UPDATE BOOKING
  ======================================================= */

  const handleCreateBookingSubmit = async (event) => {
    event.preventDefault();

    console.log("====================================");
    console.log("UPDATE BOOKING BUTTON CLICKED");
    console.log("====================================");

    /*
     * ============================================
     * VALIDATION
     * ============================================
     */

    if (!selectedVehicle?.id) {
      alert("Please select a vehicle.");
      return;
    }

    if (!fullName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter customer email.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (!cleanPhone) {
      alert("Please enter customer phone number.");
      return;
    }

    if (phoneCode === "+91" && cleanPhone.length !== 10) {
      alert("Please enter a valid 10 digit Indian mobile number.");
      return;
    }

    if (!bookingDate) {
      alert("Please select booking date.");
      return;
    }

    if (!pickupDate) {
      alert("Please select pickup date.");
      return;
    }

    if (!dropoffDate) {
      alert("Please select drop-off date.");
      return;
    }

    if (new Date(dropoffDate) < new Date(pickupDate)) {
      alert("Drop-off date cannot be before pickup date.");
      return;
    }

    if (!pickupLocation?.trim()) {
      alert("Please select pickup location.");
      return;
    }

    if (!dropoffLocation?.trim()) {
      alert("Please select drop-off location.");
      return;
    }

    /*
     * ============================================
     * GET REAL MONGODB BOOKING ID
     * ============================================
     *
     * IMPORTANT:
     * Do NOT use bookingId such as:
     *
     * BK-2026-00001
     *
     * updateBooking uses findByIdAndUpdate(),
     * therefore it requires MongoDB _id.
     */

    const updateId =
      editingBooking?._id ||
      editingBooking?.mongoId ||
      editingBooking?.idMongo ||
      editingBookingId ||
      null;

    console.log("EDITING BOOKING:", editingBooking);

    console.log("EDITING BOOKING ID:", editingBookingId);

    console.log("MONGODB BOOKING ID:", updateId);

    /*
     * ============================================
     * EDIT MODE MUST HAVE ID
     * ============================================
     */

    if (editingBooking && !updateId) {
      alert("Booking ID not found. Cannot update booking.");

      return;
    }

    /*
     * ============================================
     * VALIDATE MONGODB OBJECT ID
     * ============================================
     */

    if (updateId && !/^[0-9a-fA-F]{24}$/.test(String(updateId))) {
      console.error("INVALID MONGODB BOOKING ID:", updateId);

      alert("Invalid MongoDB booking ID.");

      return;
    }

    /*
     * ============================================
     * DATE + TIME
     * ============================================
     */

    const bookingDateTime = combineDateTime(bookingDate, bookingTime);

    const pickupDateTime = combineDateTime(pickupDate, pickupTime);

    const dropoffDateTime = combineDateTime(dropoffDate, dropoffTime);

    /*
     * ============================================
     * PAYLOAD
     * ============================================
     */

    const payload = {
      /*
       * CUSTOMER
       */
      customerName: fullName.trim(),

      fullName: fullName.trim(),

      email: email.trim().toLowerCase(),

      phone: `${phoneCode}${cleanPhone}`,

      /*
       * VEHICLE
       */
      vehicle: selectedVehicle.id,

      vehicleId: selectedVehicle.id,

      vehicleName: selectedVehicle.name,

      vehicleImage: selectedVehicle.image || "",

      /*
       * BOOKING DATE
       */
      bookingDate: bookingDateTime,

      bookingTime: bookingTime || "10:00 AM",

      /*
       * PICKUP
       */
      pickupDate: pickupDateTime,

      pickupTime: pickupTime || "10:00 AM",

      pickupLocation: pickupLocation.trim(),

      pickupLoc: pickupLocation.trim(),

      /*
       * DROP-OFF
       */
      dropoffDate: dropoffDateTime,

      dropoffTime: dropoffTime || "10:00 AM",

      returnDate: dropoffDateTime,

      dropoffLocation: dropoffLocation.trim(),

      dropLocation: dropoffLocation.trim(),

      returnLoc: dropoffLocation.trim(),

      /*
       * OTHER
       */
      amount: editingBooking?.amount ?? editingBooking?.price ?? 0,

      status: editingBooking?.status || "Pending",

      paymentStatus: editingBooking?.paymentStatus || "Unpaid",

      paymentMethod: editingBooking?.paymentMethod || "",

      additionalMessage: additionalMessage.trim(),
    };

    console.log("====================================");

    console.log("FINAL BOOKING PAYLOAD:", payload);

    console.log("BOOKING DATE:", payload.bookingDate);

    console.log("PICKUP DATE:", payload.pickupDate);

    console.log("RETURN DATE:", payload.returnDate);

    console.log("PICKUP LOCATION:", payload.pickupLocation);

    console.log("DROP-OFF LOCATION:", payload.dropoffLocation);

    console.log("====================================");

    try {
      setSaving(true);

      let response;

      /*
       * ============================================
       * UPDATE EXISTING BOOKING
       * ============================================
       */

      if (updateId) {
        const updateUrl = `/bookings/${encodeURIComponent(String(updateId))}`;

        console.log("UPDATE URL:", updateUrl);

        console.log("METHOD: PUT");

        response = await API.put(updateUrl, payload);
      } else {
        /*
         * ============================================
         * CREATE NEW BOOKING
         * ============================================
         */
        console.log("CREATE URL: /bookings");

        console.log("METHOD: POST");

        response = await API.post("/bookings", payload);
      }

      /*
       * ============================================
       * RESPONSE
       * ============================================
       */

      console.log("====================================");

      console.log("BOOKING RESPONSE STATUS:", response.status);

      console.log("BOOKING RESPONSE:", response.data);

      console.log("====================================");

      /*
       * ============================================
       * SUCCESS
       * ============================================
       */

      if (response.status >= 200 && response.status < 300) {
        alert(
          updateId
            ? "Booking updated successfully."
            : "Booking created successfully.",
        );

        /*
         * CLOSE MODAL
         */
        setIsModalOpen(false);

        /*
         * CLEAR EDIT STATE
         */
        setEditingBookingId(null);

        setEditingBooking(null);

        /*
         * REFRESH BOOKINGS
         */
        await fetchBookings();

        return;
      }

      /*
       * ============================================
       * FAILED RESPONSE
       * ============================================
       */

      alert(response.data?.message || "Booking update failed.");
    } catch (error) {
      console.error("====================================");

      console.error("BOOKING SAVE ERROR:", error);

      console.error("HTTP STATUS:", error?.response?.status);

      console.error("SERVER RESPONSE:", error?.response?.data);

      console.error("SERVER MESSAGE:", error?.response?.data?.message);

      console.error("====================================");

      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to update booking.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE BOOKING
     
     Function is included for backend integration.
     Existing UI does not get a new CSS class/button.
  ======================================================= */

  const handleDeleteBooking = async (booking) => {
    const id = booking?._id || booking?.mongoId || booking?.idMongo;

    if (!id) {
      alert("MongoDB booking ID not found.");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const response = await API.delete(
        `/bookings/${encodeURIComponent(String(id))}`,
      );

      console.log("DELETE RESPONSE:", response.data);

      if (response.data?.success) {
        alert(response.data?.message || "Booking deleted successfully.");

        await fetchBookings();
      } else {
        alert(response.data?.message || "Failed to delete booking.");
      }
    } catch (error) {
      console.error("DELETE BOOKING ERROR:", error);

      console.error("SERVER RESPONSE:", error?.response?.data);

      alert(error?.response?.data?.message || "Failed to delete booking.");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     UPDATE STATUS
     
     Backend:
     PATCH /bookings/:id/status
  ======================================================= */

  const handleStatusChange = async (booking, newStatus) => {
    const id = booking?._id || booking?.mongoId || booking?.idMongo;

    if (!id) {
      alert("MongoDB booking ID not found.");

      return;
    }

    try {
      setSaving(true);

      const response = await API.patch(
        `/bookings/${encodeURIComponent(String(id))}/status`,
        {
          status: newStatus,
        },
      );

      console.log("STATUS RESPONSE:", response.data);

      if (response.data?.success) {
        await fetchBookings();
      } else {
        alert(response.data?.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);

      console.error("SERVER RESPONSE:", error?.response?.data);

      alert(
        error?.response?.data?.message || "Failed to update booking status.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     CALENDAR
  ======================================================= */

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();

  const previousMonthDays = new Date(year, month, 0).getDate();

  const calendarCells = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarCells.push({
      day: previousMonthDays - i,

      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,

      isCurrentMonth: true,
    });
  }

  while (calendarCells.length % 7 !== 0) {
    calendarCells.push({
      day: calendarCells.length - daysInMonth - firstDay + 1,

      isCurrentMonth: false,
    });
  }

  /* =======================================================
     MONTH NAME
  ======================================================= */

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  /* =======================================================
     UPCOMING BOOKINGS
  ======================================================= */

  const upcomingBookings = [...filteredBookings]
    .filter((booking) => booking.fullPickupDate)
    .sort((a, b) => new Date(a.fullPickupDate) - new Date(b.fullPickupDate))
    .slice(0, 7);

  /* =======================================================
     LOCATION OPTIONS
  ======================================================= */

  const locationOptions = locations.map((location, index) => {
    const id = getId(location) || `location-${index}`;

    const name =
      location.name ||
      location.city ||
      location.address ||
      location.location ||
      "";

    return {
      ...location,
      id,
      name,
    };
  });

  /* =======================================================
     TIME OPTIONS
  ======================================================= */

  const timeOptions = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="bc-container">
      {/* HEADER */}

      <div className="bc-header">
        <div>
          <h2>Booking Calendar</h2>

          <p>View vehicle bookings and availability by date</p>
        </div>

        <div className="bc-breadcrumb">
          <span className="active-green">Bookings</span>

          {" > "}

          <span>Calendar</span>
        </div>
      </div>

      {/* MAIN */}

      <div className="bc-main-layout">
        {/* LEFT */}

        <div className="bc-left-content">
          {/* TOOLBAR */}

          <div className="bc-toolbar">
            <div className="bc-month-nav">
              <button
                type="button"
                className="bc-icon-btn"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              >
                <ChevronLeft size={16} />
              </button>

              <span className="bc-current-month">{monthName}</span>

              <button
                type="button"
                className="bc-icon-btn"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="bc-toolbar-filters">
              <select
                className="bc-select"
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
              >
                <option value="All Vehicles">All Vehicles</option>

                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.name}>
                    {vehicle.name}
                  </option>
                ))}
              </select>

              <select
                className="bc-select"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="All Locations">All Locations</option>

                {locationOptions.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="bc-btn-secondary"
                onClick={() => {
                  const today = new Date();

                  setCurrentDate(
                    new Date(today.getFullYear(), today.getMonth(), 1),
                  );

                  setSelectedMiniDate(today.getDate());
                }}
              >
                Today
              </button>

              <button
                type="button"
                className="bc-btn-primary"
                onClick={() => handleOpenModal()}
              >
                <Plus size={16} />

                <span>New Booking</span>
              </button>
            </div>
          </div>

          {/* CALENDAR */}

          <div className="bc-calendar-card">
            <div className="bc-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="bc-days-grid">
              {calendarCells.map((cell, index) => {
                const dayBookings = cell.isCurrentMonth
                  ? filteredBookings.filter((booking) => {
                      if (!booking.fullPickupDate) {
                        return false;
                      }

                      const date = new Date(booking.fullPickupDate);

                      return (
                        date.getFullYear() === year &&
                        date.getMonth() === month &&
                        date.getDate() === cell.day
                      );
                    })
                  : [];

                return (
                  <div
                    key={index}
                    className={`bc-day-cell ${
                      !cell.isCurrentMonth ? "outside" : ""
                    }`}
                    onClick={() => {
                      if (cell.isCurrentMonth) {
                        setSelectedMiniDate(cell.day);
                      }
                    }}
                  >
                    <div className="bc-day-header">
                      <span className="bc-day-number">{cell.day}</span>
                    </div>

                    <div className="bc-events-list">
                      {dayBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className={`bc-event-tag tag-${booking.type}`}
                          onClick={(event) => {
                            event.stopPropagation();

                            handleOpenModal(booking);
                          }}
                        >
                          <span className="dot"></span>

                          <div className="event-info">
                            <strong>{booking.car}</strong>

                            <small>{booking.time}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bc-legend-bar">
              <div className="legend-item">
                <span className="dot pickup-drop"></span>
                Pickup & Drop
              </div>

              <div className="legend-item">
                <span className="dot pickup-only"></span>
                Pickup Only
              </div>

              <div className="legend-item">
                <span className="dot drop-only"></span>
                Drop Only
              </div>

              <div className="legend-item">
                <span className="dot partially"></span>
                Partially Booked
              </div>

              <div className="legend-item">
                <span className="dot maintenance"></span>
                Maintenance / Blocked
              </div>
            </div>
          </div>

          {/* UPCOMING */}

          <div className="bc-upcoming-card">
            <h3>Upcoming Bookings (Next 7 Days)</h3>

            <div className="table-responsive">
              <table className="bc-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>VEHICLE</th>
                    <th>CUSTOMER</th>
                    <th>TYPE</th>
                    <th>PICKUP LOCATION</th>
                    <th>DROP-OFF LOCATION</th>
                    <th>STATUS</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {loadingBookings ? (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                        }}
                      >
                        Loading bookings...
                      </td>
                    </tr>
                  ) : upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => {
                      const vehicle = booking.vehicle;

                      return (
                        <tr key={booking.id}>
                          <td>
                            <div className="bc-td-date">
                              <strong>
                                {formatDate(booking.fullPickupDate)}
                              </strong>

                              <small>{booking.pickupTime}</small>
                            </div>
                          </td>

                          <td>
                            <div className="bc-td-vehicle">
                              {vehicle?.image && (
                                <img src={vehicle.image} alt={booking.car} />
                              )}

                              <div>
                                <strong>{booking.car}</strong>

                                <small>
                                  {vehicle?.category || vehicle?.type || ""}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="bc-td-customer">
                              <div>
                                <strong>
                                  {booking.customer?.name ||
                                    booking.customerName ||
                                    "N/A"}
                                </strong>

                                <small>
                                  {booking.customer?.email ||
                                    booking.email ||
                                    ""}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="bc-badge badge-pickup-drop">
                              Pickup & Drop
                            </span>
                          </td>

                          <td>
                            <div className="bc-td-loc">
                              <MapPin size={12} className="text-green" />

                              <strong>{booking.location || "N/A"}</strong>
                            </div>
                          </td>

                          <td>
                            <div className="bc-td-loc">
                              <MapPin size={12} className="text-green" />

                              <strong>{booking.dropLocation || "N/A"}</strong>
                            </div>
                          </td>

                          <td>
                            <span className="bc-status-confirmed">
                              {booking.status}
                            </span>
                          </td>

                          {/* <td>
                            <button
                              type="button"
                              className="bc-icon-btn"
                              onClick={() => handleOpenModal(booking)}
                            >
                              <MoreVertical size={16} />
                            </button>
                          </td> */}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                        }}
                      >
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}

        <div className="bc-right-sidebar">
          {/* MINI CALENDAR */}

          <div className="bc-panel-card">
            <div className="bc-panel-header">
              <h4>Mini Calendar</h4>
            </div>

            <div className="bc-mini-cal-header">
              <button
                type="button"
                className="bc-icon-btn"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              >
                <ChevronLeft size={14} />
              </button>

              <strong>{monthName}</strong>

              <button
                type="button"
                className="bc-icon-btn"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="bc-mini-grid">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div className="mini-day-name" key={day}>
                  {day}
                </div>
              ))}

              {Array.from({
                length: firstDay,
              }).map((_, index) => (
                <div key={`prev-${index}`} className="mini-date muted">
                  {previousMonthDays - firstDay + index + 1}
                </div>
              ))}

              {Array.from(
                {
                  length: daysInMonth,
                },
                (_, index) => index + 1,
              ).map((day) => (
                <div
                  key={day}
                  className={`mini-date ${
                    day === selectedMiniDate ? "active-green" : ""
                  }`}
                  onClick={() => setSelectedMiniDate(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* FILTERS */}

          <div className="bc-panel-card">
            <div className="bc-panel-header">
              <h4>Filters</h4>
            </div>

            <div className="bc-filter-form">
              <div className="form-group">
                <label>Vehicle</label>

                <select
                  value={filterVehicle}
                  onChange={(e) => setFilterVehicle(e.target.value)}
                >
                  <option value="All Vehicles">All Vehicles</option>

                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.name}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>

                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                >
                  <option value="All Locations">All Locations</option>

                  {locationOptions.map((location) => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Booking Status</label>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All Status">All Status</option>

                  <option value="Confirmed">Confirmed</option>

                  <option value="Pending">Pending</option>

                  <option value="Ongoing">Ongoing</option>

                  <option value="Completed">Completed</option>

                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                type="button"
                className="bc-apply-filter-btn"
                onClick={handleApplyFilter}
              >
                <Filter size={14} />
                Apply Filter
              </button>
            </div>
          </div>

          {/* LEGEND */}

          <div className="bc-panel-card">
            <div className="bc-panel-header">
              <h4>Calendar Legend</h4>
            </div>

            <div className="bc-side-legend-list">
              <div className="side-legend-item">
                <div className="badge-box tag-pickup-drop">Pickup & Drop</div>

                <span>Full day booking</span>
              </div>

              <div className="side-legend-item">
                <div className="badge-box tag-pickup-only">Pickup Only</div>

                <span>Vehicle picked up</span>
              </div>

              <div className="side-legend-item">
                <div className="badge-box tag-drop-only">Drop Only</div>

                <span>Vehicle drop off</span>
              </div>

              <div className="side-legend-item">
                <div className="badge-box tag-partially">Partially Booked</div>

                <span>Some hours booked</span>
              </div>

              <div className="side-legend-item">
                <div className="badge-box tag-maintenance">
                  Maintenance / Blocked
                </div>

                <span>Not available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW BOOKING MODAL */}

      {isModalOpen && (
        <div
          className="bc-modal-overlay"
          onClick={() => {
            if (!saving) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            className="new-booking-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="new-booking-close-btn"
              onClick={() => !saving && setIsModalOpen(false)}
              disabled={saving}
            >
              <X size={18} />
            </button>

            <div className="new-booking-header">
              <div className="calendar-icon-badge">
                <CalendarIcon size={18} className="green-icon" />
              </div>

              <div>
                <h2>{editingBookingId ? "Edit Booking" : "New Booking"}</h2>

                <p>Fill in the details to create a new vehicle booking</p>
              </div>
            </div>

            <div className="new-booking-body">
              <form noValidate onSubmit={handleCreateBookingSubmit}>
                <div className="new-booking-grid">
                  {/* LEFT */}

                  <div className="nb-col">
                    <div className="nb-section-title">Vehicle Information</div>

                    <div className="nb-form-group">
                      <label>Select Vehicle</label>

                      <div className="custom-vehicle-select-box">
                        <select
                          value={selectedVehicle?.id || ""}
                          onChange={handleVehicleChange}
                          disabled={loadingVehicles || saving}
                          required
                        >
                          <option value="">
                            {loadingVehicles
                              ? "Loading vehicles..."
                              : vehicles.length === 0
                                ? "No vehicles found"
                                : "Select Vehicle"}
                          </option>

                          {vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.name}
                            </option>
                          ))}
                        </select>

                        {selectedVehicle && (
                          <div className="selected-vehicle-preview">
                            {selectedVehicle.image && (
                              <img
                                src={selectedVehicle.image}
                                alt={selectedVehicle.name}
                              />
                            )}

                            <div>
                              <strong>{selectedVehicle.name}</strong>

                              <span>{selectedVehicle.category}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="nb-form-group">
                      <label>Vehicle Type</label>

                      <div className="nb-display-input">
                        <Car size={15} className="green-icon" />

                        <span>{selectedVehicle?.type || "Select vehicle"}</span>
                      </div>
                    </div>

                    <div className="nb-dual-row">
                      <div className="nb-form-group">
                        <label>Transmission</label>

                        <div className="nb-display-input">
                          <Settings size={15} className="muted-icon" />

                          <span>{selectedVehicle?.transmission || "-"}</span>
                        </div>
                      </div>

                      <div className="nb-form-group">
                        <label>Fuel Type</label>

                        <div className="nb-display-input">
                          <Fuel size={15} className="muted-icon" />

                          <span>{selectedVehicle?.fuel || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="nb-form-group">
                      <label>Seating Capacity</label>

                      <div className="nb-display-input">
                        <Users size={15} className="muted-icon" />

                        <span>{selectedVehicle?.seats || "-"}</span>
                      </div>
                    </div>

                    <div
                      className="nb-section-title"
                      style={{
                        marginTop: "12px",
                      }}
                    >
                      Booking Information
                    </div>

                    <div className="nb-dual-row">
                      <div className="nb-form-group">
                        <label>Booking Date</label>

                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          required
                          disabled={saving}
                        />
                      </div>

                      <div className="nb-form-group">
                        <label>Booking Time</label>

                        <select
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          disabled={saving}
                        >
                          {timeOptions.map((time) => (
                            <option key={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="nb-dual-row">
                      <div className="nb-form-group">
                        <label>Pick-up Date</label>

                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          required
                          disabled={saving}
                        />
                      </div>

                      <div className="nb-form-group">
                        <label>Pick-up Time</label>

                        <select
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          disabled={saving}
                        >
                          {timeOptions.map((time) => (
                            <option key={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="nb-dual-row">
                      <div className="nb-form-group">
                        <label>Drop-off Date</label>

                        <input
                          type="date"
                          value={dropoffDate}
                          min={pickupDate}
                          onChange={(e) => setDropoffDate(e.target.value)}
                          required
                          disabled={saving}
                        />
                      </div>

                      <div className="nb-form-group">
                        <label>Drop-off Time</label>

                        <select
                          value={dropoffTime}
                          onChange={(e) => setDropoffTime(e.target.value)}
                          disabled={saving}
                        >
                          {timeOptions.map((time) => (
                            <option key={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="nb-col">
                    <div className="nb-section-title">Location Details</div>

                    <div className="nb-form-group">
                      <label>Pick-up Location</label>

                      <div className="input-with-icon-left select-wrapper">
                        <MapPin size={15} className="input-icon" />

                        <select
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          required
                          disabled={loadingLocations || saving}
                        >
                          <option value="">
                            {loadingLocations
                              ? "Loading locations..."
                              : "Select pickup location"}
                          </option>

                          {locationOptions.map((location) => (
                            <option key={location.id} value={location.name}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="nb-form-group">
                      <label>Drop-off Location</label>

                      <div className="input-with-icon-left select-wrapper">
                        <MapPin size={15} className="input-icon" />

                        <select
                          value={dropoffLocation}
                          onChange={(e) => setDropoffLocation(e.target.value)}
                          required
                          disabled={loadingLocations || saving}
                        >
                          <option value="">
                            {loadingLocations
                              ? "Loading locations..."
                              : "Select drop-off location"}
                          </option>

                          {locationOptions.map((location) => (
                            <option key={location.id} value={location.name}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div
                      className="nb-section-title"
                      style={{
                        marginTop: "12px",
                      }}
                    >
                      Customer Information
                    </div>

                    <div className="nb-dual-row">
                      <div className="nb-form-group">
                        <label>Full Name</label>

                        <div className="input-with-icon-left">
                          <User size={15} className="input-icon" />

                          <input
                            type="text"
                            placeholder="Enter full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            disabled={saving}
                          />
                        </div>
                      </div>

                      <div className="nb-form-group">
                        <label>Email Address</label>

                        <div className="input-with-icon-left">
                          <Mail size={15} className="input-icon" />

                          <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={saving}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="nb-form-group">
                      <label>Phone Number</label>

                      <div className="phone-picker-wrapper">
                        <div className="country-code-select">
                          <span className="flag">🇮🇳</span>

                          <select
                            value={phoneCode}
                            onChange={(e) => setPhoneCode(e.target.value)}
                            disabled={saving}
                          >
                            <option value="+91">+91</option>

                            <option value="+1">+1</option>

                            <option value="+44">+44</option>
                          </select>
                        </div>

                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value.replace(/\D/g, ""))
                          }
                          maxLength={phoneCode === "+91" ? 10 : 15}
                          required
                          disabled={saving}
                        />
                      </div>
                    </div>

                    <div className="nb-form-group">
                      <label>Additional Message (Optional)</label>

                      <div className="textarea-wrapper">
                        <textarea
                          rows="2"
                          placeholder="Enter any special requests or notes..."
                          value={additionalMessage}
                          onChange={(e) => setAdditionalMessage(e.target.value)}
                          disabled={saving}
                        />
                      </div>
                    </div>

                    <div className="nb-secure-banner">
                      <ShieldCheck size={18} className="shield-green" />

                      <div>
                        <strong>Secure Booking</strong>

                        <p>We use secure encryption to protect your data.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}

                <div className="nb-footer-actions">
                  <button
                    type="button"
                    className="btn-nb-cancel"
                    onClick={() => setIsModalOpen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-nb-submit"
                    onClick={() => {
                      console.log("UPDATE BUTTON CLICKED DIRECTLY");
                    }}
                    disabled={saving}
                  >
                    <CalendarIcon size={15} />

                    <span>
                      {saving
                        ? editingBookingId
                          ? "Updating Booking..."
                          : "Creating Booking..."
                        : editingBookingId
                          ? "Update Booking"
                          : "Create Booking"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalender;
