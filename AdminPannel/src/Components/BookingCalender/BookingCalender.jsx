import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  Image as ImageIcon,
} from "lucide-react";

import "./BookingCalender.css";
import API from "../../api/axios";

/* =========================================================
   HELPERS
========================================================= */

const getId = (item) => {
  if (!item) return "";

  return (
    item._id ||
    item.id ||
    item.vehicleId ||
    item.listingId ||
    item.locationId ||
    ""
  );
};

/* =========================================================
   VEHICLE NAME
========================================================= */

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

  const brandModel = [
    brand,
    model,
  ]
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

/* =========================================================
   IMAGE HELPER
========================================================= */

const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (typeof image === "string") {
    const value = image.trim();

    if (!value) {
      return "";
    }

    if (value.startsWith("data:image")) {
      return value;
    }

    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("blob:")
    ) {
      return value;
    }

    const baseURL =
      API?.defaults?.baseURL || "";

    /*
      If backend returns:

      /uploads/car.webp

      Axios baseURL is:

      http://localhost:5000/api

      We need:

      http://localhost:5000/uploads/car.webp

      instead of:

      http://localhost:5000/api/uploads/car.webp
    */

    const serverURL = baseURL.replace(
      /\/api\/?$/,
      ""
    );

    try {
      return new URL(
        value,
        serverURL.endsWith("/")
          ? serverURL
          : `${serverURL}/`
      ).href;
    } catch {
      return value;
    }
  }

  if (
    typeof image === "object"
  ) {
    return (
      getImageUrl(image.url) ||
      getImageUrl(image.path) ||
      getImageUrl(image.src) ||
      getImageUrl(image.image) ||
      getImageUrl(image.secure_url) ||
      ""
    );
  }

  return "";
};

/* =========================================================
   GET VEHICLE IMAGE
========================================================= */

const getVehicleImage = (vehicle) => {
  if (!vehicle) {
    return "";
  }

  const directImage =
    getImageUrl(vehicle.image);

  if (directImage) {
    return directImage;
  }

  const thumbnail =
    getImageUrl(vehicle.thumbnail);

  if (thumbnail) {
    return thumbnail;
  }

  const imageUrl =
    getImageUrl(vehicle.imageUrl);

  if (imageUrl) {
    return imageUrl;
  }

  if (
    Array.isArray(vehicle.images)
  ) {
    for (
      const image of vehicle.images
    ) {
      const url =
        getImageUrl(image);

      if (url) {
        return url;
      }
    }
  }

  if (
    Array.isArray(vehicle.gallery)
  ) {
    for (
      const image of vehicle.gallery
    ) {
      const url =
        getImageUrl(image);

      if (url) {
        return url;
      }
    }
  }

  return "";
};

/* =========================================================
   DATE
========================================================= */

const getTodayInputDate = () => {
  const date = new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getFutureInputDate = (
  days = 2
) => {
  const date = new Date();

  date.setDate(
    date.getDate() + days
  );

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "";
  }

  return parsed.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};

const formatTime = (date) => {
  if (!date) {
    return "";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "";
  }

  return parsed.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

/* =========================================================
   DATE + TIME
========================================================= */

const combineDateTime = (
  date,
  time
) => {
  if (!date) {
    return null;
  }

  if (!time) {
    return new Date(
      `${date}T00:00:00`
    ).toISOString();
  }

  const match =
    time
      .replace(/\s/g, "")
      .match(
        /^(\d{1,2}):(\d{2})(AM|PM)$/i
      );

  if (!match) {
    return new Date(
      `${date}T00:00:00`
    ).toISOString();
  }

  let hours =
    Number(match[1]);

  const minutes =
    Number(match[2]);

  const period =
    match[3].toUpperCase();

  if (
    period === "PM" &&
    hours !== 12
  ) {
    hours += 12;
  }

  if (
    period === "AM" &&
    hours === 12
  ) {
    hours = 0;
  }

  const result =
    new Date(
      `${date}T00:00:00`
    );

  result.setHours(
    hours,
    minutes,
    0,
    0
  );

  return result.toISOString();
};

/* =========================================================
   RESPONSE ARRAY
========================================================= */

const getResponseArray = (
  response
) => {
  const data =
    response?.data;

  if (
    Array.isArray(data)
  ) {
    return data;
  }

  const candidates = [
    data?.data,
    data?.results,
    data?.result,
    data?.items,
    data?.list,
    data?.listings,
    data?.vehicles,
    data?.bookings,
    data?.locations,
    data?.location,
    data?.docs,
  ];

  for (
    const candidate of candidates
  ) {
    if (
      Array.isArray(candidate)
    ) {
      return candidate;
    }

    if (
      candidate &&
      typeof candidate ===
        "object" &&
      Array.isArray(
        candidate.data
      )
    ) {
      return candidate.data;
    }

    if (
      candidate &&
      typeof candidate ===
        "object"
    ) {
      const nestedArrays = [
        candidate.results,
        candidate.result,
        candidate.items,
        candidate.list,
        candidate.listings,
        candidate.vehicles,
        candidate.bookings,
        candidate.locations,
        candidate.docs,
      ];

      for (
        const nested of nestedArrays
      ) {
        if (
          Array.isArray(nested)
        ) {
          return nested;
        }
      }
    }
  }

  return [];
};

/* =========================================================
   VEHICLE NORMALIZER
========================================================= */

const normalizeVehicle = (
  vehicle,
  index = 0
) => {
  if (!vehicle) {
    return null;
  }

  const id =
    getId(vehicle) ||
    `vehicle-${index}`;

  const name =
    getVehicleName(vehicle);

  const type =
    vehicle.vehicleType ||
    vehicle.type ||
    vehicle.category ||
    vehicle.bodyType ||
    "Vehicle";

  const category =
    vehicle.category ||
    vehicle.vehicleType ||
    vehicle.type ||
    "Vehicle";

  const image =
    getVehicleImage(vehicle);

  const transmission =
    vehicle.transmission ||
    vehicle.gearbox ||
    "Automatic";

  const fuel =
    vehicle.fuelType ||
    vehicle.fuel ||
    "Petrol";

  const seats =
    vehicle.seatingCapacity ||
    vehicle.seats ||
    vehicle.capacity ||
    "5 Seats";

  return {
    ...vehicle,

    id,

    name,

    title:
      vehicle.title ||
      name,

    type,

    category,

    image,

    transmission,

    fuel,

    fuelType:
      vehicle.fuelType ||
      fuel,

    seats,

    seatingCapacity:
      vehicle.seatingCapacity ||
      seats,
  };
};

/* =========================================================
   BOOKING NORMALIZER
========================================================= */

const normalizeBooking = (
  booking
) => {
  if (!booking) {
    return null;
  }

  const vehicleObject =
    booking.vehicle &&
    typeof booking.vehicle ===
      "object"
      ? booking.vehicle
      : null;

  const vehicleName =
    vehicleObject
      ? getVehicleName(
          vehicleObject
        )
      : (
          booking.vehicleName ||
          (
            typeof booking.vehicle ===
            "string"
              ? booking.vehicle
              : "Vehicle"
          )
        );

  const vehicleImage =
    vehicleObject
      ? getVehicleImage(
          vehicleObject
        )
      : getImageUrl(
          booking.vehicleImage
        );

  const customerName =
    booking.customer?.name ||
    booking.customer?.fullName ||
    booking.customerName ||
    booking.fullName ||
    booking.name ||
    "N/A";

  const customerEmail =
    booking.customer?.email ||
    booking.email ||
    "";

  const customerPhone =
    booking.customer?.phone ||
    booking.phone ||
    "";

  const pickupDate =
    booking.pickupDate ||
    booking.startDate ||
    booking.pickup ||
    booking.bookingDate;

  const dropoffDate =
    booking.dropoffDate ||
    booking.returnDate ||
    booking.endDate;

  const pickupTime =
    booking.pickupTime ||
    formatTime(
      pickupDate
    ) ||
    "10:00 AM";

  const dropoffTime =
    booking.dropoffTime ||
    formatTime(
      dropoffDate
    ) ||
    "10:00 AM";

  const customer = {
    ...(booking.customer || {}),

    name:
      customerName,

    fullName:
      customerName,

    email:
      customerEmail,

    phone:
      customerPhone,
  };

  return {
    ...booking,

    id:
      booking._id ||
      booking.id ||
      booking.bookingId,

    bookingId:
      booking.bookingId ||
      booking._id ||
      booking.id,

    car:
      vehicleName,

    vehicle:
      vehicleObject ||
      {
        name:
          vehicleName,

        image:
          vehicleImage,
      },

    vehicleName,

    vehicleImage,

    type:
      booking.bookingType ||
      booking.type ||
      "pickup-drop",

    fullPickupDate:
      pickupDate,

    fullDropoffDate:
      dropoffDate,

    pickupTime,

    dropoffTime,

    time:
      `${pickupTime} - ${formatDate(
        pickupDate
      )}`,

    date:
      pickupDate
        ? new Date(
            pickupDate
          ).getDate()
        : null,

    price:
      Number(
        booking.amount ||
        booking.price ||
        0
      ),

    location:
      booking.pickupLocation ||
      booking.pickupLoc ||
      booking.location ||
      "",

    dropLocation:
      booking.dropoffLocation ||
      booking.dropLocation ||
      booking.returnLoc ||
      "",

    status:
      booking.status ||
      "Pending",

    customer,

    customerName,

    email:
      customerEmail,

    phone:
      customerPhone,
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const BookingCalender = () => {

  /* =======================================================
     CALENDAR
  ======================================================= */

  const [
    currentDate,
    setCurrentDate,
  ] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    )
  );

  const [
    selectedMiniDate,
    setSelectedMiniDate,
  ] = useState(
    new Date().getDate()
  );

  /* =======================================================
     DATA
  ======================================================= */

  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    vehicles,
    setVehicles,
  ] = useState([]);

  const [
    locations,
    setLocations,
  ] = useState([]);

  /* =======================================================
     LOADING
  ======================================================= */

  const [
    loadingBookings,
    setLoadingBookings,
  ] = useState(false);

  const [
    loadingVehicles,
    setLoadingVehicles,
  ] = useState(false);

  const [
    loadingLocations,
    setLoadingLocations,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  /* =======================================================
     FILTERS
  ======================================================= */

  const [
    filterVehicle,
    setFilterVehicle,
  ] = useState(
    "All Vehicles"
  );

  const [
    filterLocation,
    setFilterLocation,
  ] = useState(
    "All Locations"
  );

  const [
    filterStatus,
    setFilterStatus,
  ] = useState(
    "All Status"
  );

  const [
    appliedFilters,
    setAppliedFilters,
  ] = useState({
    vehicle:
      "All Vehicles",

    location:
      "All Locations",

    status:
      "All Status",
  });

  /* =======================================================
     MODAL
  ======================================================= */

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  /* =======================================================
     FORM
  ======================================================= */

  const [
    selectedVehicle,
    setSelectedVehicle,
  ] = useState(null);

  const [
    bookingDate,
    setBookingDate,
  ] = useState(
    getTodayInputDate()
  );

  const [
    bookingTime,
    setBookingTime,
  ] = useState(
    "10:00 AM"
  );

  const [
    pickupDate,
    setPickupDate,
  ] = useState(
    getTodayInputDate()
  );

  const [
    pickupTime,
    setPickupTime,
  ] = useState(
    "10:00 AM"
  );

  const [
    dropoffDate,
    setDropoffDate,
  ] = useState(
    getFutureInputDate(2)
  );

  const [
    dropoffTime,
    setDropoffTime,
  ] = useState(
    "10:00 AM"
  );

  const [
    pickupLocation,
    setPickupLocation,
  ] = useState("");

  const [
    dropoffLocation,
    setDropoffLocation,
  ] = useState("");

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    phoneCode,
    setPhoneCode,
  ] = useState("+91");

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    additionalMessage,
    setAdditionalMessage,
  ] = useState("");

  /* =======================================================
     FETCH VEHICLES
  ======================================================= */

  const fetchVehicles =
    async () => {

      try {

        setLoadingVehicles(
          true
        );

        let response = null;

        /*
          Your listing data is stored
          in /api/listings.

          First try listings.
          If that fails, use vehicles.
        */

        try {

          console.log(
            "Fetching vehicles from /listings..."
          );

          response =
            await API.get(
              "/listings"
            );

        } catch (
          listingError
        ) {

          console.warn(
            "/listings failed. Trying /vehicles..."
          );

          response =
            await API.get(
              "/vehicles"
            );
        }

        console.log(
          "VEHICLE RESPONSE:",
          response?.data
        );

        const data =
          getResponseArray(
            response
          );

        const normalized =
          data
            .map(
              (
                vehicle,
                index
              ) =>
                normalizeVehicle(
                  vehicle,
                  index
                )
            )
            .filter(Boolean);

        console.log(
          "NORMALIZED VEHICLES:",
          normalized
        );

        setVehicles(
          normalized
        );

        setSelectedVehicle(
          (previous) => {

            if (
              previous &&
              normalized.some(
                (vehicle) =>
                  String(
                    vehicle.id
                  ) ===
                  String(
                    previous.id
                  )
              )
            ) {
              return previous;
            }

            return (
              normalized[0] ||
              null
            );
          }
        );

      } catch (error) {

        console.error(
          "FETCH VEHICLES ERROR:",
          error
        );

        console.error(
          "STATUS:",
          error?.response?.status
        );

        console.error(
          "SERVER RESPONSE:",
          error?.response?.data
        );

        setVehicles([]);

        setSelectedVehicle(
          null
        );

      } finally {

        setLoadingVehicles(
          false
        );
      }
    };

  /* =======================================================
     FETCH BOOKINGS
  ======================================================= */

  const fetchBookings =
    async () => {

      try {

        setLoadingBookings(
          true
        );

        const response =
          await API.get(
            "/bookings"
          );

        console.log(
          "BOOKINGS RESPONSE:",
          response?.data
        );

        const data =
          getResponseArray(
            response
          );

        const normalized =
          data
            .map(
              normalizeBooking
            )
            .filter(Boolean);

        setBookings(
          normalized
        );

      } catch (error) {

        console.error(
          "FETCH BOOKINGS ERROR:",
          error
        );

        console.error(
          "SERVER RESPONSE:",
          error?.response?.data
        );

        setBookings([]);

      } finally {

        setLoadingBookings(
          false
        );
      }
    };

  /* =======================================================
     FETCH LOCATIONS
  ======================================================= */

  const fetchLocations =
    async () => {

      try {

        setLoadingLocations(
          true
        );

        /*
          Try all common route names.

          Your backend currently has:

          app.use(
            "/api/location",
            locationRoutes
          );

          So /location should work.

          Extra fallbacks are included.
        */

        const endpoints = [
          "/location",
          "/locations",
          "/location/all",
          "/locations/all",
        ];

        let response = null;
        let lastError = null;

        for (
          const endpoint of endpoints
        ) {

          try {

            console.log(
              `Trying location endpoint: ${endpoint}`
            );

            const result =
              await API.get(
                endpoint
              );

            console.log(
              `LOCATION RESPONSE [${endpoint}]:`,
              result?.data
            );

            if (
              result?.status >= 200 &&
              result?.status < 300
            ) {

              response =
                result;

              break;
            }

          } catch (error) {

            lastError =
              error;

            console.warn(
              `LOCATION ENDPOINT FAILED [${endpoint}]:`,
              error?.response?.status,
              error?.response?.data ||
                error?.message
            );
          }
        }

        if (!response) {

          throw (
            lastError ||
            new Error(
              "Location API not available."
            )
          );
        }

        const data =
          getResponseArray(
            response
          );

        console.log(
          "RAW LOCATIONS:",
          data
        );

        const normalized =
          data
            .map(
              (
                location,
                index
              ) => {

                if (!location) {
                  return null;
                }

                /*
                  If API returns:

                  ["Bhubaneswar", "Cuttack"]

                  handle it.
                */

                if (
                  typeof location ===
                  "string"
                ) {

                  const name =
                    location.trim();

                  if (!name) {
                    return null;
                  }

                  return {
                    id:
                      `location-${index}`,

                    name,

                    locationName:
                      name,
                  };
                }

                const id =
                  location._id ||
                  location.id ||
                  location.locationId ||
                  location.branchId ||
                  `location-${index}`;

                const name =
                  location.name ||
                  location.locationName ||
                  location.location ||
                  location.city ||
                  location.branchName ||
                  location.branch ||
                  location.title ||
                  location.label ||
                  location.address ||
                  "";

                return {
                  ...location,

                  id,

                  name:
                    String(
                      name
                    ).trim(),
                };
              }
            )
            .filter(Boolean)
            .filter(
              (location) =>
                location.name
            );

        /*
          Remove duplicates.
        */

        const uniqueLocations =
          Array.from(
            new Map(
              normalized.map(
                (location) => [
                  location.name
                    .toLowerCase(),

                  location,
                ]
              )
            ).values()
          );

        console.log(
          "NORMALIZED LOCATIONS:",
          uniqueLocations
        );

        setLocations(
          uniqueLocations
        );

      } catch (error) {

        console.error(
          "FETCH LOCATIONS ERROR:",
          error
        );

        console.error(
          "STATUS:",
          error?.response?.status
        );

        console.error(
          "SERVER RESPONSE:",
          error?.response?.data
        );

        setLocations([]);

      } finally {

        setLoadingLocations(
          false
        );
      }
    };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    fetchVehicles();

    fetchBookings();

    fetchLocations();

  }, []);

  /* =======================================================
     VEHICLE CHANGE
  ======================================================= */

  const handleVehicleChange =
    (event) => {

      const vehicleId =
        event.target.value;

      const vehicle =
        vehicles.find(
          (item) =>
            String(
              item.id
            ) ===
            String(
              vehicleId
            )
        );

      setSelectedVehicle(
        vehicle || null
      );
    };

  /* =======================================================
     FILTER
  ======================================================= */

  const handleApplyFilter =
    () => {

      setAppliedFilters({
        vehicle:
          filterVehicle,

        location:
          filterLocation,

        status:
          filterStatus,
      });
    };

  /* =======================================================
     FILTERED BOOKINGS
  ======================================================= */

  const filteredBookings =
    useMemo(() => {

      return bookings.filter(
        (item) => {

          const vehicleName =
            item.car || "";

          const location =
            item.location || "";

          const status =
            item.status || "";

          const vehicleMatch =
            appliedFilters.vehicle ===
              "All Vehicles" ||
            vehicleName
              .toLowerCase()
              .includes(
                appliedFilters.vehicle
                  .toLowerCase()
              );

          const locationMatch =
            appliedFilters.location ===
              "All Locations" ||
            location
              .toLowerCase()
              .includes(
                appliedFilters.location
                  .toLowerCase()
              );

          const statusMatch =
            appliedFilters.status ===
              "All Status" ||
            status
              .toLowerCase() ===
              appliedFilters.status
                .toLowerCase();

          return (
            vehicleMatch &&
            locationMatch &&
            statusMatch
          );
        }
      );

    }, [
      bookings,
      appliedFilters,
    ]);

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetBookingForm =
    () => {

      setFullName("");

      setEmail("");

      setPhone("");

      setPhoneCode("+91");

      setAdditionalMessage("");

      setBookingDate(
        getTodayInputDate()
      );

      setBookingTime(
        "10:00 AM"
      );

      setPickupDate(
        getTodayInputDate()
      );

      setPickupTime(
        "10:00 AM"
      );

      setDropoffDate(
        getFutureInputDate(2)
      );

      setDropoffTime(
        "10:00 AM"
      );

      setPickupLocation("");

      setDropoffLocation("");

      setSelectedVehicle(
        vehicles[0] || null
      );
    };

  /* =======================================================
     OPEN MODAL
  ======================================================= */

  const handleOpenModal =
    (booking = null) => {

      if (!booking) {

        resetBookingForm();

        setIsModalOpen(
          true
        );

        return;
      }

      const bookingVehicleId =
        booking.vehicle?._id ||
        booking.vehicle?.id ||
        booking.vehicle ||
        booking.vehicleId;

      const foundVehicle =
        vehicles.find(
          (vehicle) =>
            String(
              vehicle.id
            ) ===
            String(
              bookingVehicleId
            )
        );

      if (foundVehicle) {

        setSelectedVehicle(
          foundVehicle
        );
      }

      setFullName(
        booking.customer?.name ||
        booking.customer?.fullName ||
        booking.customerName ||
        booking.fullName ||
        booking.name ||
        ""
      );

      setEmail(
        booking.customer?.email ||
        booking.email ||
        ""
      );

      const existingPhone =
        booking.customer?.phone ||
        booking.phone ||
        "";

      if (
        existingPhone.startsWith(
          "+91"
        )
      ) {

        setPhoneCode(
          "+91"
        );

        setPhone(
          existingPhone
            .replace(
              /^\+91/,
              ""
            )
            .replace(
              /\D/g,
              ""
            )
        );

      } else {

        setPhone(
          existingPhone.replace(
            /\D/g,
            ""
          )
        );
      }

      setPickupLocation(
        booking.location ||
        ""
      );

      setDropoffLocation(
        booking.dropLocation ||
        ""
      );

      if (
        booking.fullPickupDate
      ) {

        const date =
          new Date(
            booking.fullPickupDate
          );

        if (
          !Number.isNaN(
            date.getTime()
          )
        ) {

          setPickupDate(
            date
              .toISOString()
              .slice(0, 10)
          );
        }
      }

      if (
        booking.fullDropoffDate
      ) {

        const date =
          new Date(
            booking.fullDropoffDate
          );

        if (
          !Number.isNaN(
            date.getTime()
          )
        ) {

          setDropoffDate(
            date
              .toISOString()
              .slice(0, 10)
          );
        }
      }

      setPickupTime(
        booking.pickupTime ||
        "10:00 AM"
      );

      setDropoffTime(
        booking.dropoffTime ||
        "10:00 AM"
      );

      setIsModalOpen(
        true
      );
    };

  /* =======================================================
     CREATE BOOKING
  ======================================================= */

  const handleCreateBookingSubmit =
    async (event) => {

      event.preventDefault();

      if (
        !selectedVehicle ||
        !selectedVehicle.id
      ) {

        alert(
          "Please select a vehicle."
        );

        return;
      }

      if (
        !fullName.trim()
      ) {

        alert(
          "Please enter customer name."
        );

        return;
      }

      if (
        !email.trim()
      ) {

        alert(
          "Please enter customer email."
        );

        return;
      }

      const cleanPhone =
        phone.replace(
          /\D/g,
          ""
        );

      if (
        !cleanPhone
      ) {

        alert(
          "Please enter customer phone number."
        );

        return;
      }

      if (
        phoneCode === "+91" &&
        cleanPhone.length !== 10
      ) {

        alert(
          "Please enter a valid 10 digit Indian mobile number."
        );

        return;
      }

      if (!bookingDate) {

        alert(
          "Please select booking date."
        );

        return;
      }

      if (!pickupDate) {

        alert(
          "Please select pickup date."
        );

        return;
      }

      if (!dropoffDate) {

        alert(
          "Please select drop-off date."
        );

        return;
      }

      if (
        new Date(dropoffDate) <
        new Date(pickupDate)
      ) {

        alert(
          "Drop-off date cannot be before pickup date."
        );

        return;
      }

      if (!pickupLocation) {

        alert(
          "Please select pickup location."
        );

        return;
      }

      if (!dropoffLocation) {

        alert(
          "Please select drop-off location."
        );

        return;
      }

      const bookingDateTime =
        combineDateTime(
          bookingDate,
          bookingTime
        );

      const pickupDateTime =
        combineDateTime(
          pickupDate,
          pickupTime
        );

      const dropoffDateTime =
        combineDateTime(
          dropoffDate,
          dropoffTime
        );

      /*
        Payload contains both common
        frontend/backend field names.
      */

      const payload = {

        customerName:
          fullName.trim(),

        fullName:
          fullName.trim(),

        email:
          email.trim(),

        phone:
          `${phoneCode}${cleanPhone}`,

        vehicle:
          selectedVehicle.id,

        vehicleId:
          selectedVehicle.id,

        listingId:
          selectedVehicle.listingId ||
          selectedVehicle.id,

        vehicleName:
          selectedVehicle.name,

        vehicleImage:
          selectedVehicle.image,

        bookingDate:
          bookingDateTime,

        bookingTime:
          bookingTime,

        pickupDate:
          pickupDateTime,

        pickupTime:
          pickupTime,

        startDate:
          pickupDateTime,

        returnDate:
          dropoffDateTime,

        dropoffDate:
          dropoffDateTime,

        dropoffTime:
          dropoffTime,

        endDate:
          dropoffDateTime,

        pickupLocation:
          pickupLocation,

        pickupLoc:
          pickupLocation,

        dropoffLocation:
          dropoffLocation,

        dropLocation:
          dropoffLocation,

        returnLoc:
          dropoffLocation,

        amount:
          0,

        price:
          0,

        status:
          "Pending",

        paymentStatus:
          "Unpaid",

        additionalMessage:
          additionalMessage.trim(),

        message:
          additionalMessage.trim(),
      };

      console.log(
        "================================================"
      );

      console.log(
        "BOOKING PAYLOAD:",
        payload
      );

      console.log(
        "================================================"
      );

      try {

        setSaving(true);

        const response =
          await API.post(
            "/bookings",
            payload
          );

        console.log(
          "CREATE BOOKING RESPONSE:",
          response?.data
        );

        const success =
          response?.status >= 200 &&
          response?.status < 300 &&
          response?.data?.success !==
            false;

        if (success) {

          alert(
            response?.data?.message ||
            "Booking created successfully."
          );

          setIsModalOpen(
            false
          );

          resetBookingForm();

          await fetchBookings();

        } else {

          alert(
            response?.data?.message ||
            "Booking creation failed."
          );
        }

      } catch (error) {

        console.error(
          "CREATE BOOKING ERROR:",
          error
        );

        console.error(
          "STATUS:",
          error?.response?.status
        );

        console.error(
          "SERVER RESPONSE:",
          error?.response?.data
        );

        alert(
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to create booking."
        );

      } finally {

        setSaving(false);
      }
    };

  /* =======================================================
     CALENDAR
  ======================================================= */

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const previousMonthDays =
    new Date(
      year,
      month,
      0
    ).getDate();

  const calendarCells = [];

  for (
    let i =
      firstDay - 1;
    i >= 0;
    i--
  ) {

    calendarCells.push({
      day:
        previousMonthDays -
        i,

      isCurrentMonth:
        false,
    });
  }

  for (
    let i = 1;
    i <= daysInMonth;
    i++
  ) {

    calendarCells.push({
      day:
        i,

      isCurrentMonth:
        true,
    });
  }

  while (
    calendarCells.length %
      7 !==
    0
  ) {

    calendarCells.push({
      day:
        calendarCells.length -
        daysInMonth -
        firstDay +
        1,

      isCurrentMonth:
        false,
    });
  }

  const monthName =
    currentDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );

  /* =======================================================
     UPCOMING BOOKINGS
  ======================================================= */

  const upcomingBookings =
    useMemo(() => {

      const now =
        new Date();

      const endDate =
        new Date(now);

      endDate.setDate(
        endDate.getDate() + 7
      );

      return [
        ...filteredBookings,
      ]
        .filter(
          (booking) => {

            if (
              !booking.fullPickupDate
            ) {
              return false;
            }

            const pickup =
              new Date(
                booking.fullPickupDate
              );

            return (
              !Number.isNaN(
                pickup.getTime()
              ) &&
              pickup >= now &&
              pickup <= endDate
            );
          }
        )
        .sort(
          (a, b) =>
            new Date(
              a.fullPickupDate
            ) -
            new Date(
              b.fullPickupDate
            )
        );

    }, [
      filteredBookings,
    ]);

  /* =======================================================
     LOCATIONS
  ======================================================= */

  const locationOptions =
    locations;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="bc-container">

      {/* HEADER */}

      <div className="bc-header">

        <div>

          <h2>
            Booking Calendar
          </h2>

          <p>
            View vehicle bookings and availability by date
          </p>

        </div>

        <div className="bc-breadcrumb">

          <span className="active-green">
            Bookings
          </span>

          {" > "}

          <span>
            Calendar
          </span>

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
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      year,
                      month - 1,
                      1
                    )
                  )
                }
              >

                <ChevronLeft
                  size={16}
                />

              </button>

              <span className="bc-current-month">

                {monthName}

              </span>

              <button
                type="button"
                className="bc-icon-btn"
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      year,
                      month + 1,
                      1
                    )
                  )
                }
              >

                <ChevronRight
                  size={16}
                />

              </button>

            </div>

            <div className="bc-toolbar-filters">

              {/* VEHICLE FILTER */}

              <select
                className="bc-select"
                value={
                  filterVehicle
                }
                onChange={(e) =>
                  setFilterVehicle(
                    e.target.value
                  )
                }
              >

                <option value="All Vehicles">
                  All Vehicles
                </option>

                {vehicles.map(
                  (vehicle) => (

                    <option
                      key={
                        vehicle.id
                      }
                      value={
                        vehicle.name
                      }
                    >

                      {
                        vehicle.name
                      }

                    </option>

                  )
                )}

              </select>

              {/* LOCATION FILTER */}

              <select
                className="bc-select"
                value={
                  filterLocation
                }
                onChange={(e) =>
                  setFilterLocation(
                    e.target.value
                  )
                }
              >

                <option value="All Locations">
                  All Locations
                </option>

                {locationOptions.map(
                  (location) => (

                    <option
                      key={
                        location.id
                      }
                      value={
                        location.name
                      }
                    >

                      {
                        location.name
                      }

                    </option>

                  )
                )}

              </select>

              <button
                type="button"
                className="bc-btn-secondary"
                onClick={() => {

                  const today =
                    new Date();

                  setCurrentDate(
                    new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      1
                    )
                  );

                  setSelectedMiniDate(
                    today.getDate()
                  );

                }}
              >

                Today

              </button>

              <button
                type="button"
                className="bc-btn-primary"
                onClick={() =>
                  handleOpenModal()
                }
              >

                <Plus
                  size={16}
                />

                <span>
                  New Booking
                </span>

              </button>

            </div>

          </div>

          {/* CALENDAR */}

          <div className="bc-calendar-card">

            <div className="bc-weekdays">

              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>

            </div>

            <div className="bc-days-grid">

              {calendarCells.map(
                (
                  cell,
                  index
                ) => {

                  const dayBookings =
                    cell.isCurrentMonth
                      ? filteredBookings.filter(
                          (booking) => {

                            if (
                              !booking.fullPickupDate
                            ) {
                              return false;
                            }

                            const date =
                              new Date(
                                booking.fullPickupDate
                              );

                            return (
                              date.getFullYear() ===
                                year &&
                              date.getMonth() ===
                                month &&
                              date.getDate() ===
                                cell.day
                            );
                          }
                        )
                      : [];

                  return (

                    <div
                      key={
                        index
                      }
                      className={`bc-day-cell ${
                        !cell.isCurrentMonth
                          ? "outside"
                          : ""
                      }`}
                      onClick={() => {

                        if (
                          cell.isCurrentMonth
                        ) {

                          setSelectedMiniDate(
                            cell.day
                          );

                        }

                      }}
                    >

                      <div className="bc-day-header">

                        <span className="bc-day-number">

                          {
                            cell.day
                          }

                        </span>

                      </div>

                      <div className="bc-events-list">

                        {dayBookings.map(
                          (booking) => (

                            <div
                              key={
                                booking.id
                              }
                              className={`bc-event-tag tag-${booking.type}`}
                              onClick={(
                                event
                              ) => {

                                event.stopPropagation();

                                handleOpenModal(
                                  booking
                                );

                              }}
                            >

                              <span className="dot"></span>

                              <div className="event-info">

                                <strong>
                                  {
                                    booking.car
                                  }
                                </strong>

                                <small>
                                  {
                                    booking.time
                                  }
                                </small>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  );
                }
              )}

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

            <h3>
              Upcoming Bookings (Next 7 Days)
            </h3>

            <div className="table-responsive">

              <table className="bc-table">

                <thead>

                  <tr>

                    <th>
                      DATE
                    </th>

                    <th>
                      VEHICLE
                    </th>

                    <th>
                      CUSTOMER
                    </th>

                    <th>
                      TYPE
                    </th>

                    <th>
                      PICKUP LOCATION
                    </th>

                    <th>
                      DROP-OFF LOCATION
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th></th>

                  </tr>

                </thead>

                <tbody>

                  {loadingBookings ? (

                    <tr>

                      <td
                        colSpan="8"
                        style={{
                          textAlign:
                            "center",

                          padding:
                            "30px",
                        }}
                      >

                        Loading bookings...

                      </td>

                    </tr>

                  ) : upcomingBookings.length >
                    0 ? (

                    upcomingBookings.map(
                      (booking) => {

                        const vehicle =
                          booking.vehicle;

                        const vehicleImage =
                          booking.vehicleImage ||
                          getVehicleImage(
                            vehicle
                          );

                        return (

                          <tr
                            key={
                              booking.id
                            }
                          >

                            {/* DATE */}

                            <td>

                              <div className="bc-td-date">

                                <strong>
                                  {
                                    formatDate(
                                      booking.fullPickupDate
                                    )
                                  }
                                </strong>

                                <small>
                                  {
                                    booking.pickupTime
                                  }
                                </small>

                              </div>

                            </td>

                            {/* VEHICLE */}

                            <td>

                              <div className="bc-td-vehicle">

                                <div
                                  style={{
                                    width:
                                      "55px",

                                    height:
                                      "40px",

                                    borderRadius:
                                      "7px",

                                    overflow:
                                      "hidden",

                                    background:
                                      "#f1f5f9",

                                    display:
                                      "flex",

                                    alignItems:
                                      "center",

                                    justifyContent:
                                      "center",

                                    flexShrink:
                                      0,
                                  }}
                                >

                                  {vehicleImage ? (

                                    <img
                                      src={
                                        vehicleImage
                                      }
                                      alt={
                                        booking.car
                                      }
                                      style={{
                                        width:
                                          "100%",

                                        height:
                                          "100%",

                                        objectFit:
                                          "cover",

                                        display:
                                          "block",
                                      }}

                                      onError={(
                                        event
                                      ) => {

                                        event.currentTarget.style.display =
                                          "none";

                                      }}
                                    />

                                  ) : (

                                    <ImageIcon
                                      size={20}
                                      color="#94a3b8"
                                    />

                                  )}

                                </div>

                                <div>

                                  <strong>
                                    {
                                      booking.car
                                    }
                                  </strong>

                                  <small>
                                    {
                                      vehicle?.category ||
                                      vehicle?.type ||
                                      ""
                                    }
                                  </small>

                                </div>

                              </div>

                            </td>

                            {/* CUSTOMER */}

                            <td>

                              <div className="bc-td-customer">

                                <div>

                                  <strong>
                                    {
                                      booking.customer?.name ||
                                      booking.customer?.fullName ||
                                      booking.customerName ||
                                      booking.fullName ||
                                      booking.name ||
                                      "N/A"
                                    }
                                  </strong>

                                  <small>
                                    {
                                      booking.customer?.email ||
                                      booking.email ||
                                      ""
                                    }
                                  </small>

                                </div>

                              </div>

                            </td>

                            {/* TYPE */}

                            <td>

                              <span className="bc-badge badge-pickup-drop">

                                Pickup & Drop

                              </span>

                            </td>

                            {/* PICKUP */}

                            <td>

                              <div className="bc-td-loc">

                                <MapPin
                                  size={12}
                                  className="text-green"
                                />

                                <strong>
                                  {
                                    booking.location ||
                                    "N/A"
                                  }
                                </strong>

                              </div>

                            </td>

                            {/* DROP */}

                            <td>

                              <div className="bc-td-loc">

                                <MapPin
                                  size={12}
                                  className="text-green"
                                />

                                <strong>
                                  {
                                    booking.dropLocation ||
                                    "N/A"
                                  }
                                </strong>

                              </div>

                            </td>

                            {/* STATUS */}

                            <td>

                              <span className="bc-status-confirmed">

                                {
                                  booking.status
                                }

                              </span>

                            </td>

                            {/* ACTION */}

                            <td>

                              <button
                                type="button"
                                className="bc-icon-btn"
                                onClick={() =>
                                  handleOpenModal(
                                    booking
                                  )
                                }
                              >

                                <MoreVertical
                                  size={16}
                                />

                              </button>

                            </td>

                          </tr>

                        );
                      }
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="8"
                        style={{
                          textAlign:
                            "center",

                          padding:
                            "30px",
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

        {/* ===================================================
            RIGHT SIDEBAR
        =================================================== */}

        <div className="bc-right-sidebar">

          {/* MINI CALENDAR */}

          <div className="bc-panel-card">

            <div className="bc-panel-header">

              <h4>
                Mini Calendar
              </h4>

            </div>

            <div className="bc-mini-cal-header">

              <button
                type="button"
                className="bc-icon-btn"
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      year,
                      month - 1,
                      1
                    )
                  )
                }
              >

                <ChevronLeft
                  size={14}
                />

              </button>

              <strong>
                {monthName}
              </strong>

              <button
                type="button"
                className="bc-icon-btn"
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      year,
                      month + 1,
                      1
                    )
                  )
                }
              >

                <ChevronRight
                  size={14}
                />

              </button>

            </div>

            <div className="bc-mini-grid">

              <div className="mini-day-name">
                Su
              </div>

              <div className="mini-day-name">
                Mo
              </div>

              <div className="mini-day-name">
                Tu
              </div>

              <div className="mini-day-name">
                We
              </div>

              <div className="mini-day-name">
                Th
              </div>

              <div className="mini-day-name">
                Fr
              </div>

              <div className="mini-day-name">
                Sa
              </div>

              {Array.from({
                length:
                  firstDay,
              }).map(
                (_, index) => (

                  <div
                    key={
                      `prev-${index}`
                    }
                    className="mini-date muted"
                  >

                    {
                      previousMonthDays -
                      firstDay +
                      index +
                      1
                    }

                  </div>

                )
              )}

              {Array.from({
                length:
                  daysInMonth,
              }).map(
                (_, index) => {

                  const day =
                    index + 1;

                  return (

                    <div
                      key={
                        day
                      }
                      className={`mini-date ${
                        day ===
                        selectedMiniDate
                          ? "active-green"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedMiniDate(
                          day
                        )
                      }
                    >

                      {
                        day
                      }

                    </div>

                  );
                }
              )}

            </div>

          </div>

          {/* FILTER */}

          <div className="bc-panel-card">

            <div className="bc-panel-header">

              <h4>
                Filters
              </h4>

            </div>

            <div className="bc-filter-form">

              <div className="form-group">

                <label>
                  Vehicle
                </label>

                <select
                  value={
                    filterVehicle
                  }
                  onChange={(e) =>
                    setFilterVehicle(
                      e.target.value
                    )
                  }
                >

                  <option value="All Vehicles">
                    All Vehicles
                  </option>

                  {vehicles.map(
                    (vehicle) => (

                      <option
                        key={
                          vehicle.id
                        }
                        value={
                          vehicle.name
                        }
                      >

                        {
                          vehicle.name
                        }

                      </option>

                    )
                  )}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Location
                </label>

                <select
                  value={
                    filterLocation
                  }
                  onChange={(e) =>
                    setFilterLocation(
                      e.target.value
                    )
                  }
                >

                  <option value="All Locations">
                    All Locations
                  </option>

                  {locationOptions.map(
                    (location) => (

                      <option
                        key={
                          location.id
                        }
                        value={
                          location.name
                        }
                      >

                        {
                          location.name
                        }

                      </option>

                    )
                  )}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Booking Status
                </label>

                <select
                  value={
                    filterStatus
                  }
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value
                    )
                  }
                >

                  <option value="All Status">
                    All Status
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Ongoing">
                    Ongoing
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

              <button
                type="button"
                className="bc-apply-filter-btn"
                onClick={
                  handleApplyFilter
                }
              >

                <Filter
                  size={14}
                />

                Apply Filter

              </button>

            </div>

          </div>

          {/* LEGEND */}

          <div className="bc-panel-card">

            <div className="bc-panel-header">

              <h4>
                Calendar Legend
              </h4>

            </div>

            <div className="bc-side-legend-list">

              <div className="side-legend-item">

                <div className="badge-box tag-pickup-drop">
                  Pickup & Drop
                </div>

                <span>
                  Full day booking
                </span>

              </div>

              <div className="side-legend-item">

                <div className="badge-box tag-pickup-only">
                  Pickup Only
                </div>

                <span>
                  Vehicle picked up
                </span>

              </div>

              <div className="side-legend-item">

                <div className="badge-box tag-drop-only">
                  Drop Only
                </div>

                <span>
                  Vehicle drop off
                </span>

              </div>

              <div className="side-legend-item">

                <div className="badge-box tag-partially">
                  Partially Booked
                </div>

                <span>
                  Some hours booked
                </span>

              </div>

              <div className="side-legend-item">

                <div className="badge-box tag-maintenance">
                  Maintenance / Blocked
                </div>

                <span>
                  Not available
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          NEW BOOKING MODAL
      ===================================================== */}

      {isModalOpen && (

        <div
          className="bc-modal-overlay"
          onClick={() => {

            if (!saving) {
              setIsModalOpen(
                false
              );
            }

          }}
        >

          <div
            className="new-booking-modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="new-booking-close-btn"
              onClick={() =>
                !saving &&
                setIsModalOpen(
                  false
                )
              }
              disabled={
                saving
              }
            >

              <X
                size={18}
              />

            </button>

            {/* HEADER */}

            <div className="new-booking-header">

              <div className="calendar-icon-badge">

                <CalendarIcon
                  size={18}
                  className="green-icon"
                />

              </div>

              <div>

                <h2>
                  New Booking
                </h2>

                <p>
                  Fill in the details to create a new vehicle booking
                </p>

              </div>

            </div>

            <div className="new-booking-body">

              <form
                onSubmit={
                  handleCreateBookingSubmit
                }
              >

                <div className="new-booking-grid">

                  {/* =================================================
                      LEFT
                  ================================================= */}

                  <div className="nb-col">

                    <div className="nb-section-title">
                      Vehicle Information
                    </div>

                    {/* VEHICLE */}

                    <div className="nb-form-group">

                      <label>
                        Select Vehicle
                      </label>

                      <div className="custom-vehicle-select-box">

                        <select
                          value={
                            selectedVehicle?.id ||
                            ""
                          }
                          onChange={
                            handleVehicleChange
                          }
                          disabled={
                            loadingVehicles ||
                            saving
                          }
                          required
                        >

                          <option value="">

                            {loadingVehicles
                              ? "Loading vehicles..."
                              : vehicles.length ===
                                0
                              ? "No vehicles found"
                              : "Select Vehicle"}

                          </option>

                          {vehicles.map(
                            (vehicle) => (

                              <option
                                key={
                                  vehicle.id
                                }
                                value={
                                  vehicle.id
                                }
                              >

                                {
                                  vehicle.name
                                }

                              </option>

                            )
                          )}

                        </select>

                        {/* VEHICLE IMAGE */}

                        {selectedVehicle && (

                          <div
                            className="selected-vehicle-preview"
                            style={{
                              marginTop:
                                "10px",

                              display:
                                "flex",

                              alignItems:
                                "center",

                              gap:
                                "12px",

                              padding:
                                "10px",

                              border:
                                "1px solid #e2e8f0",

                              borderRadius:
                                "10px",

                              background:
                                "#f8fafc",
                            }}
                          >

                            <div
                              style={{
                                width:
                                  "80px",

                                height:
                                  "55px",

                                borderRadius:
                                  "8px",

                                overflow:
                                  "hidden",

                                background:
                                  "#e2e8f0",

                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                justifyContent:
                                  "center",

                                flexShrink:
                                  0,
                              }}
                            >

                              {selectedVehicle.image ? (

                                <img
                                  src={
                                    selectedVehicle.image
                                  }
                                  alt={
                                    selectedVehicle.name
                                  }
                                  style={{
                                    width:
                                      "100%",

                                    height:
                                      "100%",

                                    objectFit:
                                      "cover",

                                    display:
                                      "block",
                                  }}

                                  onError={(
                                    event
                                  ) => {

                                    event.currentTarget.style.display =
                                      "none";

                                  }}
                                />

                              ) : (

                                <ImageIcon
                                  size={22}
                                  color="#94a3b8"
                                />

                              )}

                            </div>

                            <div>

                              <strong
                                style={{
                                  display:
                                    "block",
                                }}
                              >

                                {
                                  selectedVehicle.name
                                }

                              </strong>

                              <span
                                style={{
                                  fontSize:
                                    "12px",

                                  color:
                                    "#64748b",
                                }}
                              >

                                {
                                  selectedVehicle.category
                                }

                              </span>

                            </div>

                          </div>

                        )}

                      </div>

                    </div>

                    {/* TYPE */}

                    <div className="nb-form-group">

                      <label>
                        Vehicle Type
                      </label>

                      <div className="nb-display-input">

                        <Car
                          size={15}
                          className="green-icon"
                        />

                        <span>

                          {
                            selectedVehicle?.type ||
                            "Select vehicle"
                          }

                        </span>

                      </div>

                    </div>

                    {/* TRANSMISSION/FUEL */}

                    <div className="nb-dual-row">

                      <div className="nb-form-group">

                        <label>
                          Transmission
                        </label>

                        <div className="nb-display-input">

                          <Settings
                            size={15}
                            className="muted-icon"
                          />

                          <span>

                            {
                              selectedVehicle?.transmission ||
                              "-"
                            }

                          </span>

                        </div>

                      </div>

                      <div className="nb-form-group">

                        <label>
                          Fuel Type
                        </label>

                        <div className="nb-display-input">

                          <Fuel
                            size={15}
                            className="muted-icon"
                          />

                          <span>

                            {
                              selectedVehicle?.fuel ||
                              "-"
                            }

                          </span>

                        </div>

                      </div>

                    </div>

                    {/* SEATS */}

                    <div className="nb-form-group">

                      <label>
                        Seating Capacity
                      </label>

                      <div className="nb-display-input">

                        <Users
                          size={15}
                          className="muted-icon"
                        />

                        <span>

                          {
                            selectedVehicle?.seats ||
                            "-"
                          }

                        </span>

                      </div>

                    </div>

                    {/* BOOKING */}

                    <div
                      className="nb-section-title"
                      style={{
                        marginTop:
                          "12px",
                      }}
                    >

                      Booking Information

                    </div>

                    {/* BOOKING DATE/TIME */}

                    <div className="nb-dual-row">

                      <div className="nb-form-group">

                        <label>
                          Booking Date
                        </label>

                        <input
                          type="date"
                          value={
                            bookingDate
                          }
                          onChange={(e) =>
                            setBookingDate(
                              e.target.value
                            )
                          }
                          required
                          disabled={
                            saving
                          }
                        />

                      </div>

                      <div className="nb-form-group">

                        <label>
                          Booking Time
                        </label>

                        <select
                          value={
                            bookingTime
                          }
                          onChange={(e) =>
                            setBookingTime(
                              e.target.value
                            )
                          }
                          disabled={
                            saving
                          }
                        >

                          <option>
                            10:00 AM
                          </option>

                          <option>
                            11:00 AM
                          </option>

                          <option>
                            12:00 PM
                          </option>

                          <option>
                            01:00 PM
                          </option>

                          <option>
                            02:00 PM
                          </option>

                          <option>
                            03:00 PM
                          </option>

                          <option>
                            04:00 PM
                          </option>

                          <option>
                            05:00 PM
                          </option>

                        </select>

                      </div>

                    </div>

                    {/* PICKUP */}

                    <div className="nb-dual-row">

                      <div className="nb-form-group">

                        <label>
                          Pick-up Date
                        </label>

                        <input
                          type="date"
                          value={
                            pickupDate
                          }
                          onChange={(e) =>
                            setPickupDate(
                              e.target.value
                            )
                          }
                          required
                          disabled={
                            saving
                          }
                        />

                      </div>

                      <div className="nb-form-group">

                        <label>
                          Pick-up Time
                        </label>

                        <select
                          value={
                            pickupTime
                          }
                          onChange={(e) =>
                            setPickupTime(
                              e.target.value
                            )
                          }
                          disabled={
                            saving
                          }
                        >

                          <option>
                            10:00 AM
                          </option>

                          <option>
                            11:00 AM
                          </option>

                          <option>
                            12:00 PM
                          </option>

                          <option>
                            01:00 PM
                          </option>

                          <option>
                            02:00 PM
                          </option>

                          <option>
                            03:00 PM
                          </option>

                          <option>
                            04:00 PM
                          </option>

                          <option>
                            05:00 PM
                          </option>

                        </select>

                      </div>

                    </div>

                    {/* DROP */}

                    <div className="nb-dual-row">

                      <div className="nb-form-group">

                        <label>
                          Drop-off Date
                        </label>

                        <input
                          type="date"
                          value={
                            dropoffDate
                          }
                          min={
                            pickupDate
                          }
                          onChange={(e) =>
                            setDropoffDate(
                              e.target.value
                            )
                          }
                          required
                          disabled={
                            saving
                          }
                        />

                      </div>

                      <div className="nb-form-group">

                        <label>
                          Drop-off Time
                        </label>

                        <select
                          value={
                            dropoffTime
                          }
                          onChange={(e) =>
                            setDropoffTime(
                              e.target.value
                            )
                          }
                          disabled={
                            saving
                          }
                        >

                          <option>
                            10:00 AM
                          </option>

                          <option>
                            11:00 AM
                          </option>

                          <option>
                            12:00 PM
                          </option>

                          <option>
                            01:00 PM
                          </option>

                          <option>
                            02:00 PM
                          </option>

                          <option>
                            03:00 PM
                          </option>

                          <option>
                            04:00 PM
                          </option>

                          <option>
                            05:00 PM
                          </option>

                        </select>

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      RIGHT
                  ================================================= */}

                  <div className="nb-col">

                    {/* LOCATION */}

                    <div className="nb-section-title">
                      Location Details
                    </div>

                    {/* PICKUP LOCATION */}

                    <div className="nb-form-group">

                      <label>
                        Pick-up Location
                      </label>

                      <div className="input-with-icon-left select-wrapper">

                        <MapPin
                          size={15}
                          className="input-icon"
                        />

                        <select
                          value={
                            pickupLocation
                          }
                          onChange={(e) =>
                            setPickupLocation(
                              e.target.value
                            )
                          }
                          required
                          disabled={
                            loadingLocations ||
                            saving
                          }
                        >

                          <option value="">

                            {loadingLocations
                              ? "Loading locations..."
                              : locationOptions.length ===
                                0
                              ? "No locations found - Check API"
                              : "Select pickup location"}

                          </option>

                          {locationOptions.map(
                            (location) => (

                              <option
                                key={
                                  location.id
                                }
                                value={
                                  location.name
                                }
                              >

                                {
                                  location.name
                                }

                              </option>

                            )
                          )}

                        </select>

                      </div>

                    </div>

                    {/* DROP LOCATION */}

                    <div className="nb-form-group">

                      <label>
                        Drop-off Location
                      </label>

                      <div className="input-with-icon-left select-wrapper">

                        <MapPin
                          size={15}
                          className="input-icon"
                        />

                        <select
                          value={
                            dropoffLocation
                          }
                          onChange={(e) =>
                            setDropoffLocation(
                              e.target.value
                            )
                          }
                          required
                          disabled={
                            loadingLocations ||
                            saving
                          }
                        >

                          <option value="">

                            {loadingLocations
                              ? "Loading locations..."
                              : locationOptions.length ===
                                0
                              ? "No locations found - Check API"
                              : "Select drop-off location"}

                          </option>

                          {locationOptions.map(
                            (location) => (

                              <option
                                key={
                                  location.id
                                }
                                value={
                                  location.name
                                }
                              >

                                {
                                  location.name
                                }

                              </option>

                            )
                          )}

                        </select>

                      </div>

                    </div>

                    {/* CUSTOMER */}

                    <div
                      className="nb-section-title"
                      style={{
                        marginTop:
                          "12px",
                      }}
                    >

                      Customer Information

                    </div>

                    {/* NAME + EMAIL */}

                    <div className="nb-dual-row">

                      <div className="nb-form-group">

                        <label>
                          Full Name
                        </label>

                        <div className="input-with-icon-left">

                          <User
                            size={15}
                            className="input-icon"
                          />

                          <input
                            type="text"
                            placeholder="Enter full name"
                            value={
                              fullName
                            }
                            onChange={(e) =>
                              setFullName(
                                e.target.value
                              )
                            }
                            required
                            disabled={
                              saving
                            }
                          />

                        </div>

                      </div>

                      <div className="nb-form-group">

                        <label>
                          Email Address
                        </label>

                        <div className="input-with-icon-left">

                          <Mail
                            size={15}
                            className="input-icon"
                          />

                          <input
                            type="email"
                            placeholder="Enter email address"
                            value={
                              email
                            }
                            onChange={(e) =>
                              setEmail(
                                e.target.value
                              )
                            }
                            required
                            disabled={
                              saving
                            }
                          />

                        </div>

                      </div>

                    </div>

                    {/* PHONE */}

                    <div className="nb-form-group">

                      <label>
                        Phone Number
                      </label>

                      <div className="phone-picker-wrapper">

                        <div className="country-code-select">

                          <span className="flag">
                            🇮🇳
                          </span>

                          <select
                            value={
                              phoneCode
                            }
                            onChange={(e) =>
                              setPhoneCode(
                                e.target.value
                              )
                            }
                            disabled={
                              saving
                            }
                          >

                            <option value="+91">
                              +91
                            </option>

                            <option value="+1">
                              +1
                            </option>

                            <option value="+44">
                              +44
                            </option>

                          </select>

                        </div>

                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          value={
                            phone
                          }
                          onChange={(e) =>
                            setPhone(
                              e.target.value.replace(
                                /\D/g,
                                ""
                              )
                            )
                          }
                          maxLength={
                            phoneCode ===
                            "+91"
                              ? 10
                              : 15
                          }
                          required
                          disabled={
                            saving
                          }
                        />

                      </div>

                    </div>

                    {/* MESSAGE */}

                    <div className="nb-form-group">

                      <label>
                        Additional Message (Optional)
                      </label>

                      <textarea
                        rows="3"
                        placeholder="Enter any special requests or notes..."
                        value={
                          additionalMessage
                        }
                        onChange={(e) =>
                          setAdditionalMessage(
                            e.target.value
                          )
                        }
                        disabled={
                          saving
                        }
                      />

                    </div>

                    {/* SECURE */}

                    <div className="nb-secure-banner">

                      <ShieldCheck
                        size={18}
                        className="shield-green"
                      />

                      <div>

                        <strong>
                          Secure Booking
                        </strong>

                        <p>
                          We use secure encryption to protect your data.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* FOOTER */}

                <div className="nb-footer-actions">

                  <button
                    type="button"
                    className="btn-nb-cancel"
                    onClick={() =>
                      setIsModalOpen(
                        false
                      )
                    }
                    disabled={
                      saving
                    }
                  >

                    Cancel

                  </button>

                  <button
                    type="submit"
                    className="btn-nb-submit"
                    disabled={
                      saving ||
                      loadingVehicles ||
                      vehicles.length ===
                        0 ||
                      !selectedVehicle?.id
                    }
                  >

                    <CalendarIcon
                      size={15}
                    />

                    <span>

                      {saving
                        ? "Creating Booking..."
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