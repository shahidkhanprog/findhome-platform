
// pages/dashboard/AddProperty.jsx
import { useState, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";

import {
  STEPS, PROPERTY_HAS_BEDROOMS, PROPERTY_HAS_ROOMS, LISTING_IS_RENT,
  OK, ERR, CLS_DIS, IC
} from "../../../constants/addPropertyConstants.jsx";
import ProgressBar from "../../../components/property/ProgressBar";
import StepCard from "../../../components/property/StepCard";
import Field from "../../../components/property/Field";
import SelectField from "../../../components/property/SelectField";
import Counter from "../../../components/property/Counter";
import PhotoUploadZone from "../../../components/property/PhotoUploadZone";

export default function AddProperty({ post, postDetails, onCancel }) {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [failed, setFailed] = useState(new Set());
  const [visited, setVisited] = useState(new Set([0]));

  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    title:       post?.title       ?? "",
    price:       post?.price       ?? "",
    address:     post?.address     ?? "",
    city:        post?.city        ?? "",
    bedroom:     post?.bedroom     ?? "",
    bathroom:    post?.bathroom    ?? "",
    latitude:    post?.latitude    ?? "",
    longitude:   post?.longitude   ?? "",
    listingType: post?.listingType ?? "",
    property:    post?.property    ?? "",
    status:      post?.status      ?? "",
  });

  const [det, setDet] = useState({
    desc:       postDetails?.desc       ?? post?.postDetails?.desc       ?? "",
    utilities:  postDetails?.utilities  ?? post?.postDetails?.utilities  ?? "",
    pet:        postDetails?.pet        ?? post?.postDetails?.pet        ?? "",
    size:       postDetails?.size       ?? post?.postDetails?.size       ?? "",
    school:     postDetails?.school     ?? post?.postDetails?.school     ?? 0,
    bus:        postDetails?.bus        ?? post?.postDetails?.bus        ?? 0,
    restaurant: postDetails?.restaurant ?? post?.postDetails?.restaurant ?? 0,
  });

  const [images, setImages] = useState(post?.images ?? []);
  const addImage = useCallback((url) => {
    setImages((prev) => {
      if (prev.includes(url)) return prev;
      if (prev.length >= 10) return prev;
      return [...prev, url];
    });
  }, []);
  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const [errors, setErrors] = useState({});
  const clr = (k) => setErrors((e) => { if (!e[k]) return e; const n = { ...e }; delete n[k]; return n; });
  const sf  = (k, v) => { setForm((f) => ({ ...f, [k]: v })); clr(k); };
  const sd  = (k, v) => { setDet((d)  => ({ ...d, [k]: v })); clr(k); };

  const showBedrooms   = PROPERTY_HAS_BEDROOMS.includes(form.property);
  const showBathrooms  = PROPERTY_HAS_ROOMS.includes(form.property);
  const showRentFields = LISTING_IS_RENT.includes(form.listingType);

  const R = {
    images: useRef(null), title: useRef(null), price: useRef(null),
    city: useRef(null), address: useRef(null), listingType: useRef(null),
    property: useRef(null), status: useRef(null), bedroom: useRef(null),
    bathroom: useRef(null), latitude: useRef(null), longitude: useRef(null),
    desc: useRef(null), size: useRef(null), utilities: useRef(null),
    pet: useRef(null),
  };

  const focusFirst = useCallback((errs, keys) => {
    for (const k of keys) {
      if (errs[k] && R[k]?.current) {
        R[k].current.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => R[k].current?.focus?.(), 280);
        return;
      }
    }
  }, []);

  const validate = useCallback((s) => {
    const e = {};
    if (s === 0) {
      if (images.length < 4) e.images = `${images.length} of 4 required photos uploaded — please upload at least 4`;
    }
    if (s === 1) {
      if (!form.title.trim())     e.title       = "Property title is required";
      if (!form.price)            e.price       = "Price is required";
      if (!form.city.trim())      e.city        = "City is required";
      if (!form.address.trim())   e.address     = "Address is required";
      if (!form.listingType)      e.listingType = "Select a listing type";
      if (!form.property)         e.property    = "Select a property type";
      if (!form.status)           e.status      = "Select a listing status";
      if (showBedrooms  && !form.bedroom)  e.bedroom  = "Number of bedrooms is required";
      if (showBathrooms && !form.bathroom) e.bathroom = "Number of bathrooms is required";
      if (!form.latitude.trim())  e.latitude    = "Latitude is required";
      if (!form.longitude.trim()) e.longitude   = "Longitude is required";
    }
    if (s === 2) {
      if (!det.desc.trim())  e.desc = "Description is required";
      if (!det.size)         e.size = "Size is required";
      if (showRentFields && !det.utilities) e.utilities = "Select a utilities policy";
      if (showRentFields && !det.pet)       e.pet       = "Select a pet policy";
    }
    return e;
  }, [form, det, images, showBedrooms, showBathrooms, showRentFields]);

  const ORDER = {
    0: ["images"],
    1: ["title","price","city","address","listingType","property","status","bedroom","bathroom","latitude","longitude"],
    2: ["desc","size","utilities","pet"],
    3: [],
  };

  const handleNext = () => {
    const e = validate(current);
    setErrors(e);
    if (Object.keys(e).length) {
      setFailed((prev) => new Set([...prev, current]));
      focusFirst(e, ORDER[current]);
      return;
    }
    setFailed((prev) => { const n = new Set(prev); n.delete(current); return n; });
    setCompleted((prev) => new Set([...prev, current]));
    if (current < 3) {
      const next = current + 1;
      setVisited((prev) => new Set([...prev, next]));
      setCurrent(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNav = (i) => {
    setVisited((prev) => new Set([...prev, i]));
    setCurrent(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePublish = async () => {
    setSubmitError("");
    setSubmitStatus("loading");
    try {
      const postRes = await apiRequest.post("/posts", {
        title:       form.title.trim(),
        price:       parseInt(form.price, 10),
        address:     form.address.trim(),
        city:        form.city.trim(),
        bedroom:     showBedrooms  ? parseInt(form.bedroom,  10) : 0,
        bathroom:    showBathrooms ? parseInt(form.bathroom, 10) : 0,
        latitude:    form.latitude.trim(),
        longitude:   form.longitude.trim(),
        listingType: form.listingType,
        property:    form.property,
        status:      form.status,
        images,
      });

      await apiRequest.post("/posts/details", {
        postId:     postRes.data.id,
        desc:       det.desc.trim(),
        utilities:  showRentFields ? det.utilities : null,
        pet:        showRentFields ? det.pet       : null,
        size:       parseInt(det.size, 10),
        school:     det.school,
        bus:        det.bus,
        restaurant: det.restaurant,
      });

      setSubmitStatus("success");
      setCompleted((prev) => new Set([...prev, 3]));
      setTimeout(() => navigate("/dashboard/myProperties"), 1200);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to publish listing. Please try again.");
      setSubmitStatus("error");
    }
  };

  const iCls     = (k) => (isLocked ? CLS_DIS : errors[k] ? ERR : OK);
  const fieldErr = (k) => (isLocked ? undefined : errors[k]);
  const isLocked = current > 0 && !completed.has(current - 1);

  return (
    <div className="w-full max-w-3xl mx-auto pb-10">
      <div className="mb-5 px-1">
        <h2 className="text-xl font-bold text-slate-800">{post ? "Edit Property" : "Add New Property"}</h2>
        <p className="text-sm text-slate-400 mt-1">
          Fields marked <span className="text-red-400 font-medium">*</span> are required.
          Complete each step to continue.
        </p>
      </div>

      <ProgressBar current={current} completed={completed} failed={failed} visited={visited} onNav={handleNav} />

      {/* STEP 0 — PHOTOS */}
      {current === 0 && (
        <StepCard stepIndex={0}>
          <PhotoUploadZone images={images} onAdd={addImage} onRemove={removeImage} error={errors.images} />
        </StepCard>
      )}

      {/* STEP 1 — BASIC INFO */}
      {current === 1 && (
        <StepCard stepIndex={1}>
          {isLocked && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 mb-4">
              <IC.Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700 font-medium">Complete <strong>Photos</strong> first to fill this step.</p>
            </div>
          )}
          <fieldset disabled={isLocked} className="contents">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Property Title" required error={fieldErr("title")} icon={IC.Tag}>
                  <input ref={R.title} type="text" value={form.title} onChange={(e) => sf("title", e.target.value)}
                    placeholder="e.g. Modern 3BR Apartment in Blue Area" className={`${iCls("title")} scroll-mt-4`} />
                </Field>
              </div>

              <Field label="Price (PKR)" required error={fieldErr("price")} icon={IC.Dollar}>
                <input ref={R.price} type="number" value={form.price} onChange={(e) => sf("price", e.target.value)}
                  placeholder="e.g. 25000000" className={`${iCls("price")} scroll-mt-4`} />
              </Field>

              <Field label="City" required error={fieldErr("city")}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"><IC.Pin className="w-4 h-4 text-slate-400" /></span>
                  <input ref={R.city} type="text" value={form.city} onChange={(e) => sf("city", e.target.value)}
                    placeholder="e.g. Islamabad" className={`${iCls("city")} pl-9 scroll-mt-4`} />
                </div>
              </Field>

              <div className="sm:col-span-2">
                <Field label="Full Address" required error={fieldErr("address")}>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"><IC.Pin className="w-4 h-4 text-slate-400" /></span>
                    <input ref={R.address} type="text" value={form.address} onChange={(e) => sf("address", e.target.value)}
                      placeholder="e.g. House 12, Street 5, Blue Area" className={`${iCls("address")} pl-9 scroll-mt-4`} />
                  </div>
                </Field>
              </div>

              <SelectField label="Listing Type" required error={fieldErr("listingType")} fieldRef={R.listingType}
                value={form.listingType} onChange={(e) => sf("listingType", e.target.value)} placeholder="Select listing type…">
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </SelectField>

              <SelectField label="Property Type" required icon={IC.Build} error={fieldErr("property")} fieldRef={R.property}
                value={form.property} onChange={(e) => {
                  sf("property", e.target.value);
                  if (!PROPERTY_HAS_BEDROOMS.includes(e.target.value)) sf("bedroom", "");
                  if (!PROPERTY_HAS_ROOMS.includes(e.target.value))    sf("bathroom", "");
                }} placeholder="Select property type…">
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </SelectField>

              <SelectField label="Listing Status" required error={fieldErr("status")} fieldRef={R.status}
                value={form.status} onChange={(e) => sf("status", e.target.value)} placeholder="Select status…">
                <option value="available">Available</option>
                <option value="pending">Pending</option>
              </SelectField>

              {showBedrooms && (
                <Field label="Bedrooms" required error={fieldErr("bedroom")} icon={IC.Bed}>
                  <input ref={R.bedroom} type="number" min="0" value={form.bedroom} onChange={(e) => sf("bedroom", e.target.value)}
                    placeholder="e.g. 3" className={`${iCls("bedroom")} scroll-mt-4`} />
                </Field>
              )}

              {showBathrooms && (
                <Field label="Bathrooms" required error={fieldErr("bathroom")} icon={IC.Drop}>
                  <input ref={R.bathroom} type="number" min="0" value={form.bathroom} onChange={(e) => sf("bathroom", e.target.value)}
                    placeholder="e.g. 2" className={`${iCls("bathroom")} scroll-mt-4`} />
                </Field>
              )}

              <div className="sm:col-span-2 flex items-center gap-3 mt-1">
                <hr className="flex-1 border-slate-200" />
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full shrink-0">
                  <IC.Nav className="w-3.5 h-3.5" /> GPS Coordinates <span className="text-red-400">*</span>
                </span>
                <hr className="flex-1 border-slate-200" />
              </div>

              <Field label="Latitude" required error={fieldErr("latitude")} icon={IC.Nav}>
                <input ref={R.latitude} type="text" value={form.latitude} onChange={(e) => sf("latitude", e.target.value)}
                  placeholder="e.g. 33.7294" className={`${iCls("latitude")} scroll-mt-4`} />
              </Field>

              <Field label="Longitude" required error={fieldErr("longitude")} icon={IC.Nav}>
                <input ref={R.longitude} type="text" value={form.longitude} onChange={(e) => sf("longitude", e.target.value)}
                  placeholder="e.g. 73.0931" className={`${iCls("longitude")} scroll-mt-4`} />
              </Field>
            </div>
          </fieldset>
        </StepCard>
      )}

      {/* STEP 2 — PROPERTY DETAILS */}
      {current === 2 && (
        <StepCard stepIndex={2}>
          {isLocked && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 mb-4">
              <IC.Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700 font-medium">Complete <strong>Basic Info</strong> first to fill this step.</p>
            </div>
          )}
          <fieldset disabled={isLocked} className="contents">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Description" required error={fieldErr("desc")}>
                  <textarea ref={R.desc} rows={4} value={det.desc} onChange={(e) => sd("desc", e.target.value)}
                    placeholder="Describe the property — highlights, condition, renovations…"
                    className={`${isLocked ? CLS_DIS : errors.desc ? ERR : OK} resize-none scroll-mt-4`} />
                </Field>
              </div>

              <Field label="Size (sqft)" required error={fieldErr("size")} icon={IC.Ruler}>
                <input ref={R.size} type="number" min="0" value={det.size} onChange={(e) => sd("size", e.target.value)}
                  placeholder="e.g. 1800" className={`${isLocked ? CLS_DIS : errors.size ? ERR : OK} scroll-mt-4`} />
              </Field>

              {showRentFields ? (
                <>
                  <SelectField label="Utilities Included" required icon={IC.Zap} error={fieldErr("utilities")} fieldRef={R.utilities}
                    value={det.utilities} onChange={(e) => sd("utilities", e.target.value)} placeholder="Select utilities policy…">
                    <option value="owner">Owner pays</option>
                    <option value="tenant">Tenant pays</option>
                    <option value="shared">Shared</option>
                  </SelectField>

                  <SelectField label="Pet Policy" required icon={IC.Paw} error={fieldErr("pet")} fieldRef={R.pet}
                    value={det.pet} onChange={(e) => sd("pet", e.target.value)} placeholder="Select pet policy…">
                    <option value="allowed">Allowed</option>
                    <option value="not-allowed">Not Allowed</option>
                    <option value="cats-only">Cats Only</option>
                    <option value="negotiable">Negotiable</option>
                  </SelectField>
                </>
              ) : form.listingType === "sale" ? (
                <div className="sm:col-span-2 flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-3.5 py-2.5">
                  <IC.Alert className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <p className="text-xs text-teal-700">Utilities and pet policy fields are not applicable for sale listings — the buyer decides.</p>
                </div>
              ) : null}
            </div>
          </fieldset>
        </StepCard>
      )}

      {/* STEP 3 — NEARBY */}
      {current === 3 && (
        <StepCard stepIndex={3}>
          {isLocked && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 mb-4">
              <IC.Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700 font-medium">Complete <strong>Property Details</strong> first to fill this step.</p>
            </div>
          )}
          <fieldset disabled={isLocked} className="contents">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { key: "school",     label: "Schools",     col: "blue",   Icon: IC.School, btn: "bg-blue-100   hover:bg-blue-200   text-blue-700"   },
                { key: "bus",        label: "Bus Stops",   col: "violet", Icon: IC.Bus,    btn: "bg-violet-100 hover:bg-violet-200 text-violet-700" },
                { key: "restaurant", label: "Restaurants", col: "orange", Icon: IC.Fork,   btn: "bg-orange-100 hover:bg-orange-200 text-orange-700" },
              ].map(({ key, label, col, Icon, btn }) => (
                <div key={key} className={`bg-${col}-50 border border-${col}-100 rounded-xl p-4 flex sm:flex-col flex-row items-center sm:items-start gap-4`}>
                  <div className="flex items-center gap-2.5 flex-1 sm:flex-none">
                    <div className={`w-9 h-9 rounded-xl bg-${col}-100 text-${col}-600 flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold text-${col}-900 leading-tight`}>{label}</p>
                      <p className={`text-xs text-${col}-400`}>nearby</p>
                    </div>
                  </div>
                  <div className="shrink-0 sm:w-full flex sm:flex-col items-center sm:items-start gap-3">
                    <Counter value={det[key]} onChange={(v) => sd(key, v)} btnCls={btn} />
                    <div className="hidden sm:flex gap-1 flex-wrap min-h-[14px]">
                      {Array.from({ length: Math.min(det[key], 10) }, (_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-full bg-${col}-400`} />
                      ))}
                      {det[key] > 10 && <span className={`text-[10px] text-${col}-500 self-center`}>+{det[key] - 10}</span>}
                      {det[key] === 0 && <span className={`text-[11px] text-${col}-300`}>None added</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(det.school > 0 || det.bus > 0 || det.restaurant > 0) && (
              <div className="mt-4 flex items-center gap-2 bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2.5 flex-wrap">
                <span className="text-xs text-slate-500 font-medium shrink-0">Nearby:</span>
                {det.school > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    <IC.School className="w-3.5 h-3.5" />{det.school} school{det.school !== 1 ? "s" : ""}
                  </span>
                )}
                {det.bus > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                    <IC.Bus className="w-3.5 h-3.5" />{det.bus} bus stop{det.bus !== 1 ? "s" : ""}
                  </span>
                )}
                {det.restaurant > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    <IC.Fork className="w-3.5 h-3.5" />{det.restaurant} restaurant{det.restaurant !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}

            {submitError && (
              <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                <IC.Alert className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <p className="text-xs text-red-600 font-medium">{submitError}</p>
              </div>
            )}

            {submitStatus === "success" && (
              <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
                <IC.Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700 font-medium">Listing published! Redirecting…</p>
              </div>
            )}
          </fieldset>
        </StepCard>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 mt-5">
        {current === 0 ? (
          <button onClick={onCancel}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-50 active:scale-[.98] transition-all">
            <IC.X className="w-4 h-4" /> Cancel
          </button>
        ) : (
          <button onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 active:scale-[.98] transition-all">
            <IC.ArrL className="w-4 h-4" /> Back
          </button>
        )}

        <div className="flex-1 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-indigo-600" : completed.has(i) ? "w-3 bg-emerald-400" : "w-3 bg-slate-200"
            }`} />
          ))}
        </div>

        {current < 3 ? (
          <button onClick={!isLocked ? handleNext : undefined} disabled={isLocked}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              isLocked ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-700 active:scale-[.98]"
            }`}>
            {isLocked && <IC.Lock className="w-4 h-4" />}
            Next {!isLocked && <IC.ArrR className="w-4 h-4" />}
          </button>
        ) : (
          <button
            onClick={!isLocked && submitStatus !== "loading" && submitStatus !== "success" ? handlePublish : undefined}
            disabled={isLocked || submitStatus === "loading" || submitStatus === "success"}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              isLocked ? "bg-slate-100 text-slate-300 cursor-not-allowed"
              : submitStatus === "loading" ? "bg-indigo-400 text-white cursor-not-allowed"
              : submitStatus === "success" ? "bg-emerald-500 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.98]"
            }`}>
            {submitStatus === "loading" && <IC.Spinner className="w-4 h-4 animate-spin" />}
            {submitStatus === "loading"  ? "Publishing…"
              : submitStatus === "success" ? <><IC.Check className="w-4 h-4" /> Published!</>
              : isLocked ? <IC.Lock className="w-4 h-4" />
              : <>{post ? "Save Changes" : "Publish Listing"} <IC.Save className="w-4 h-4" /></>
            }
          </button>
        )}
      </div>
    </div>
  );
}