"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetTourByIdQuery } from "@/redux/features/tour/tour.api";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
import { useGetTourReviewsQuery } from "@/redux/features/review/review.api";
import WishlistButton from "@/components/ui/WishlistButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  Shield,
  Award,
  Edit,
  Trash2,
  ChevronRight,
  Share2,
  Heart,
  Camera,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { io, Socket } from "socket.io-client";

export default function TourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.tourId as string;

  const { data: tour, isLoading, error } = useGetTourByIdQuery(tourId);
  // console.log(tour);
  const { data: userData } = useGetMeQuery({});
  // console.log(userData);
  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreateBookingMutation();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [messageText, setMessageText] = useState("");

  const { data: reviewsData, isLoading: isLoadingReviews } =
    useGetTourReviewsQuery(
      { tourId: tour?._id || "", limit: 10 },
      { skip: !tour?._id }
    );
  const reviews = reviewsData?.reviews || [];

  const isGuideOwner =
    userData &&
    tour &&
    userData.role === "GUIDE" &&
    (userData.userId === (tour.guideId?._id || tour.guideId) ||
      userData._id === (tour.guideId?._id || tour.guideId));

  let socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);

    socketRef.current.on("connect", () => {
      // console.log("Frontend connected, socketID:", socketRef.current?.id);
    });

    return () => {
      socketRef?.current?.disconnect();
    };
  }, []);

  const handleMessage = () => {
    if (!userData) {
      toast.error("Please login to chat");
      router.push("/login");
      return;
    }

    if (!messageText.trim()) return;

    console.log("sending message");

    socketRef.current?.emit("identify", {
      userId: userData._id,
    });
    socketRef?.current?.emit("send-message", {
      receiverId: tour.guideId?._id || tour.guideId,
      messageText: messageText.trim(),
    });

    setMessageText("");
    toast.success("Message sent!");
  };

  const handleBookTour = () => {
    if (!userData) {
      toast.error("Please login to book this tour");
      router.push("/login");
      return;
    }

    if (userData.role !== "TOURIST") {
      toast.error("Only tourists can book tours");
      return;
    }

    if (!userData.address || !userData.phone) {
      toast.error(
        "Please update your profile with address and phone number before booking."
      );
      return;
    }

    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      const bookingDate = selectedDate;
      const bookingTime = new Date(selectedDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const totalAmount = (tour.tourFee || 0) * guestCount;

      const bookingData = {
        tourId: tour._id,
        guideId: tour.guideId?._id || tour.guideId,
        bookingDate,
        bookingTime,
        numberOfGuests: guestCount,
        totalAmount,
      };

      await createBooking(bookingData).unwrap();

      toast.success("Booking request sent successfully!");
      setShowBookingModal(false);
      router.push("/dashboard/my-bookings");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create booking.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-[#4088FD] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Experience Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The experience you're looking for doesn't exist or has been removed
            from our listings.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#4088FD] text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = (tour.tourFee * guestCount).toFixed(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Immersive Gallery Section */}
      <section className="relative pt-6 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="group flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center mr-3 group-hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to listings
            </button>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors hover:bg-gray-50">
                <Share2 className="w-4 h-4" />
              </button>
              {!isGuideOwner && <WishlistButton tourId={tour._id} size="lg" />}
            </div>
          </div>

          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 h-[300px] md:h-[500px]">
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 h-full gap-2 bg-gray-100">
              {(tour.images?.length > 0
                ? tour.images.slice(0, 5)
                : [
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
                  ]
              ).map((img: string, index: number, arr: string[]) => {
                // Calculate grid spans based on total images to display (max 5)
                let spanClass = "";
                const total = arr.length;

                if (total === 1)
                  spanClass = "col-span-1 md:col-span-4 row-span-2";
                else if (total === 2)
                  spanClass = "col-span-1 md:col-span-2 row-span-2";
                else if (total === 3) {
                  if (index === 0)
                    spanClass = "col-span-1 md:col-span-2 row-span-2";
                  else spanClass = "col-span-1 md:col-span-2 row-span-1";
                } else if (total === 4) {
                  if (index === 0)
                    spanClass = "col-span-1 md:col-span-2 row-span-2";
                  else if (index === 1)
                    spanClass = "col-span-1 md:col-span-2 row-span-1";
                  else spanClass = "col-span-1 row-span-1";
                } else {
                  // 5+ images
                  if (index === 0)
                    spanClass = "col-span-1 md:col-span-2 row-span-2";
                  else spanClass = "col-span-1 row-span-1";
                }

                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden group cursor-pointer ${spanClass} ${
                      index > 0 ? "hidden md:block" : "block"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${tour.title} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                );
              })}
            </div>

            {/* Owner/Badge overlay */}
            {isGuideOwner && (
              <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#4088FD] shadow-xl border border-blue-50 z-10">
                You are the Owner
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Details */}
            <div className="lg:col-span-2">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-blue-50 text-[#4088FD] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-blue-100">
                    {tour.category}
                  </span>
                  <div className="flex items-center text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {tour.rating || 4.8}
                    <span className="text-gray-400 font-medium ml-1">
                      ({tour.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-[1.1]">
                  {tour.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-gray-500 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#4088FD]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#4088FD]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span>{tour.maxDuration} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#4088FD]">
                      <Users className="w-5 h-5" />
                    </div>
                    <span>Up to {tour.maxGroupSize} guests</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 mb-10 overflow-x-auto scrollbar-hide">
                {["Overview", "Itinerary", "Reviews", "Important Info"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`pb-4 px-6 text-sm font-bold tracking-wide uppercase transition-all relative min-w-max ${
                        activeTab === tab.toLowerCase()
                          ? "text-[#4088FD]"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab}
                      {activeTab === tab.toLowerCase() && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-[#4088FD] rounded-t-full"
                        />
                      )}
                    </button>
                  )
                )}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-12"
                    >
                      {/* Description */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          About this{" "}
                          <span className="text-[#4088FD]">Experience</span>
                        </h3>
                        <p className="text-gray-600 leading-[1.8] text-lg">
                          {tour.description}
                        </p>
                        {tour.longDescription && (
                          <p className="text-gray-600 leading-[1.8] text-lg mt-4">
                            {tour.longDescription}
                          </p>
                        )}
                      </div>

                      {/* Highlights */}
                      {tour.highlights && tour.highlights.length > 0 && (
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            Highlights
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tour.highlights.map((h: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30"
                              >
                                <CheckCircle className="w-5 h-5 text-[#4088FD] mt-1 shrink-0" />
                                <span className="text-gray-700 font-medium leading-relaxed">
                                  {h}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Included / Not Included */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            What's included
                          </h4>
                          <ul className="space-y-4">
                            {tour.included?.map((item: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-gray-600 text-sm font-medium"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                              <XCircle className="w-4 h-4" />
                            </div>
                            What's not included
                          </h4>
                          <ul className="space-y-4">
                            {tour.notIncluded?.map(
                              (item: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-3 text-gray-600 text-sm font-medium"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                                  {item}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "itinerary" && (
                    <motion.div
                      key="itinerary"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-10"
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-8">
                        Full Itinerary
                      </h3>
                      <div className="space-y-0">
                        {tour.itinerary?.map((item: any, i: number) => (
                          <div key={i} className="flex gap-8 group">
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-blue-100 flex items-center justify-center font-black text-[#4088FD] z-10 group-hover:bg-[#4088FD] group-hover:text-white group-hover:border-[#4088FD] transition-all duration-300">
                                {i + 1}
                              </div>
                              {i !== tour.itinerary.length - 1 && (
                                <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-100 to-transparent my-2" />
                              )}
                            </div>
                            <div className="pb-12 pt-1 flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-black uppercase tracking-widest text-[#4088FD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                  {item.time}
                                </span>
                                {item.location && (
                                  <span className="text-xs font-bold text-gray-400 flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {item.location}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xl font-bold text-gray-900 mb-3">
                                {item.title}
                              </h4>
                              <p className="text-gray-600 leading-relaxed font-medium opacity-80">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-12"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
                        <div>
                          <h3 className="text-3xl font-black text-gray-900 mb-2">
                            Guest reviews
                          </h3>
                          <p className="text-gray-500 font-medium">
                            Based on {tour.reviewCount || 0} real local
                            experiences
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-5xl font-black text-[#4088FD]">
                              {tour.rating || 4.8}
                            </div>
                            <div className="flex items-center justify-center mt-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className="w-3 h-3 text-amber-500 fill-current"
                                />
                              ))}
                            </div>
                          </div>
                          <div className="h-16 w-px bg-gray-100" />
                          <Link
                            href="#"
                            className="font-bold text-sm text-[#4088FD] hover:underline"
                          >
                            Write a review
                          </Link>
                        </div>
                      </div>

                      {isLoadingReviews ? (
                        <div className="py-12 flex justify-center">
                          <Loader2 className="w-10 h-10 text-[#4088FD] animate-spin" />
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                          <p className="text-gray-400 font-bold">
                            No reviews yet. Be the first to share your journey!
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {reviews.map((r: any) => (
                            <div
                              key={r._id}
                              className="p-8 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-500/5 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100">
                                    <img
                                      src={
                                        r.userId?.image ||
                                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                                      }
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900">
                                      {r.userId?.name || "Local Explorer"}
                                    </h5>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                      {new Date(
                                        r.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center text-amber-500 gap-0.5">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="text-sm font-black">
                                    {r.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-600 font-medium italic leading-relaxed">
                                "{r.comment}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "important info" && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-12"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {tour.importantInfo &&
                          tour.importantInfo.length > 0 && (
                            <div className="space-y-6">
                              <h3 className="text-2xl font-bold text-gray-900">
                                Good to know
                              </h3>
                              <div className="space-y-4">
                                {tour.importantInfo.map(
                                  (info: string, i: number) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-3"
                                    >
                                      <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                                      <p className="text-gray-600 leading-relaxed font-medium">
                                        {info}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-gray-900">
                            Cancellation Policy
                          </h3>
                          <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100">
                            <div className="flex items-start gap-4 mb-4">
                              <Shield className="w-8 h-8 text-[#4088FD] shrink-0" />
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">
                                  Worry-free booking
                                </h4>
                                <p className="text-[#4088FD] font-bold text-sm">
                                  Flexible cancellation options available
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-600 font-medium leading-relaxed">
                              {tour.cancellationPolicy ||
                                "Full refund up to 24 hours before your experience begins. No refunds for cancellations within 24 hours."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Booking Card & Guide */}
            <div className="space-y-8">
              {/* Sticky Booking Card */}
              <div className="sticky top-24">
                <div className="relative p-1 rounded-[3rem] bg-gradient-to-br from-[#4088FD]/20 via-transparent to-blue-500/10 shadow-2xl shadow-blue-500/10">
                  <div className="bg-white rounded-[2.8rem] p-8">
                    <div className="flex items-end justify-between mb-8">
                      <div>
                        <div className="text-4xl font-black text-gray-900">
                          {tour.tourFee} TK
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                          Per person
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                          <Clock className="w-3 h-3" /> Best Price
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#4088FD] shadow-sm">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                              Arrival
                            </div>
                            <div className="text-sm font-bold text-gray-900">
                              Select Date
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#4088FD] shadow-sm">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                              Guests
                            </div>
                            <div className="text-sm font-bold text-gray-900">
                              1 person
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>

                    <button
                      onClick={handleBookTour}
                      disabled={isGuideOwner}
                      className="w-full py-5 bg-[#4088FD] text-white rounded-[1.8rem] font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isGuideOwner ? (
                        "Viewing as Owner"
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          Book Now
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </button>

                    {!userData && (
                      <p className="text-center text-xs text-gray-400 font-bold mt-4 uppercase tracking-wider">
                        Please{" "}
                        <Link href="/login" className="text-[#4088FD]">
                          Login
                        </Link>{" "}
                        to secure your spot
                      </p>
                    )}

                    <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-black text-gray-900">
                          {tour.bookingCount || 0}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Bookings
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-gray-900">
                          {tour.reviewCount || 0}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Reviews
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guide Section */}
                {tour.guideId && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl shadow-gray-500/5"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#4088FD]">
                        Your Guide
                      </h3>
                      <div className="px-3 py-1 bg-blue-50 text-[#4088FD] rounded-full text-[10px] font-black uppercase tracking-wider">
                        Verified
                      </div>
                    </div>

                    <div className="flex items-center gap-5 mb-8">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-lg">
                          <img
                            src={
                              tour.guideId.image ||
                              "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-50">
                          <Award className="w-4 h-4 text-[#4088FD]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-gray-900 leading-tight mb-1">
                          {tour.guideId.name}
                        </h4>
                        <p className="text-xs font-bold text-gray-400">
                          {tour.guideId.email}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500 gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-sm font-black">4.9</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs font-bold text-gray-400">
                            120+ tours done
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <textarea
                          placeholder="Type your message to the guide..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4088FD] transition-all resize-none"
                          rows={2}
                        />
                      </div>
                      <div className="">
                        <button
                          onClick={handleMessage}
                          disabled={!messageText.trim()}
                          className="py-4 bg-[#4088FD] text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-2xl text-xs font-black border border-transparent shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 w-full"
                        >
                          <Mail className="w-4 h-4" /> Send Message
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="bg-[#4088FD] p-10 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
            <DialogHeader className="relative z-10">
              <DialogTitle className="text-3xl font-black leading-tight text-white mb-2">
                Book your
                <br />
                local journey
              </DialogTitle>
              <DialogDescription className="text-blue-100 font-medium opacity-80">
                You're just one step away from an authentic local experience.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-10 space-y-8 bg-white">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#4088FD] transition-all"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                  Number of Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#4088FD] appearance-none transition-all"
                  >
                    {Array.from(
                      { length: tour.maxGroupSize },
                      (_, i) => i + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num} guest{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                  <span>Subtotal ({guestCount} guests)</span>
                  <span className="text-gray-900 font-bold">
                    {totalPrice} TK
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-black text-gray-900">
                    Total Price
                  </span>
                  <span className="text-3xl font-black text-[#4088FD]">
                    {totalPrice} TK
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-4 px-6 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-all border border-gray-100"
              >
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isCreatingBooking || !selectedDate}
                className="flex-[2] py-4 px-6 bg-[#4088FD] text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {isCreatingBooking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Confirm Booking
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
