"use client";

import Image from "next/image";
import { Menu, MessageCircle, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { useEffect, useState, type CSSProperties } from "react";

type Service = {
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  size: string;
  length: string;
  active?: boolean;
};

const services: Service[] = [
  { name: "Knotless braids", category: "Knotless", description: "Des tresses légères et protectrices, personnalisées selon votre style.", price: 85, image: "/inspiration/image.jpeg", size: "Moyenne", length: "Épaules" },
  { name: "Boho braids", category: "Braids", description: "Un mélange de tresses et de boucles pour une finition souple et aérienne.", price: 120, image: "/inspiration/idee2.jpeg", size: "Fine", length: "Mi-dos" },
  { name: "Fulani braids", category: "Tresses", description: "Une coiffure graphique et élégante avec des détails qui attirent le regard.", price: 95, image: "/inspiration/prestation-detail.jpeg", size: "Moyenne", length: "Longues" },
  { name: "Tresses signature", category: "Tresses", description: "Une création sur mesure, pensée avec vous pour vous ressembler.", price: 75, image: "/inspiration/bg2.jpeg", size: "Large", length: "Mi-dos" },
];

const timeSlots = ["08:00", "10:30", "13:00", "15:30", "18:00"];
const reviews = [
  { name: "Aïcha", service: "Knotless braids", text: "Un moment doux, une coiffure magnifique et beaucoup de soin dans chaque détail." },
  { name: "Mélissa", service: "Boho braids", text: "Mouam's a parfaitement compris ce que je voulais. Je suis repartie ravie." },
  { name: "Sarah", service: "Fulani braids", text: "Une vraie parenthèse beauté. Les tresses sont encore plus belles que dans mon inspiration." },
];
const countryCodes = [{ code: "+32", name: "Belgique" }, { code: "+33", name: "France" }, { code: "+352", name: "Luxembourg" }, { code: "+41", name: "Suisse" }, { code: "+49", name: "Allemagne" }];
const minimumBookingDate = "2026-10-27";
const minimumBookingMonth = new Date(2026, 9, 1);
const schoolHolidayRanges = [["2026-10-26", "2026-11-01"], ["2026-12-21", "2027-01-03"], ["2027-02-15", "2027-02-21"], ["2027-03-29", "2027-04-11"], ["2027-07-01", "2027-08-31"]];

function isSchoolHoliday(date: string) {
  return schoolHolidayRanges.some(([start, end]) => date >= start && date <= end);
}

function WeekendCalendar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [month, setMonth] = useState(() => value ? new Date(`${value}T12:00:00`) : new Date(2026, 9, 1));
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const monthLabel = month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const isBeforeMinimumMonth = month.getFullYear() === minimumBookingMonth.getFullYear() && month.getMonth() <= minimumBookingMonth.getMonth() || month < minimumBookingMonth;
  const dateForDay = (day: number) => `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return <div className="weekend-calendar"><div className="calendar-header"><button type="button" disabled={isBeforeMinimumMonth} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Mois précédent">←</button><strong>{monthLabel}</strong><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Mois suivant">→</button></div><div className="calendar-weekdays">{["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-days">{Array.from({ length: firstDay }, (_, index) => <span className="calendar-empty" key={`empty-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => { const day = index + 1; const date = new Date(month.getFullYear(), month.getMonth(), day); const weekend = date.getDay() === 0 || date.getDay() === 6; const isoDate = dateForDay(day); const past = isoDate < minimumBookingDate; const holiday = isSchoolHoliday(isoDate); const selectable = (weekend || holiday) && !past; return <button type="button" key={isoDate} disabled={!selectable} className={`${selectable ? "calendar-weekend" : "calendar-weekday"} ${past ? "calendar-past" : ""} ${holiday ? "calendar-holiday" : ""} ${value === isoDate ? "selected" : ""}`} onClick={() => onChange(isoDate)}>{day}</button>; })}</div></div>;
}

export default function Home() {
  const [siteServices, setSiteServices] = useState<Service[]>(services);
  const [filters, setFilters] = useState<string[]>(["Tout voir", "Knotless", "Braids", "Tresses"]);
  const [filter, setFilter] = useState("Tout voir");
  const [activeService, setActiveService] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<Service | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [countryCode, setCountryCode] = useState("+32");
  const [bookingStyle, setBookingStyle] = useState(services[0]);
  const [withHair, setWithHair] = useState(true);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewCategory, setReviewCategory] = useState(services[0].category);
  const [displayedReviews, setDisplayedReviews] = useState(() => {
    if (typeof window === "undefined") return reviews;
    try {
      const savedReviews = JSON.parse(localStorage.getItem("mouams-reviews") ?? "[]");
      return Array.isArray(savedReviews) ? [...reviews, ...savedReviews] : reviews;
    } catch {
      return reviews;
    }
  });
  const [activeReview, setActiveReview] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [siteSlots, setSiteSlots] = useState<string[]>(timeSlots);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const unavailableSlots = blockedSlots;
  const visibleStyles = filter === "Tout voir" ? siteServices : siteServices.filter((service) => service.category === filter);
  const displayedStyles = showAllGallery ? visibleStyles : visibleStyles.slice(0, 6);
  const currentService = siteServices[activeService] ?? siteServices[0];
  const bookingPrice = bookingStyle.price;
  const isBookingComplete = customerName.trim() !== "" && customerWhatsapp.trim() !== "" && selectedDate !== "" && selectedSlot !== "";

  function submitBooking() {
    if (!isBookingComplete) return;
    const appointment = { id: `booking-${Date.now()}`, name: customerName.trim(), whatsapp: `${countryCode} ${customerWhatsapp.trim()}`, service: bookingStyle.name, date: selectedDate, time: selectedSlot, status: "En attente" as const };
    const current = JSON.parse(localStorage.getItem("mouams-appointments") ?? "[]");
    localStorage.setItem("mouams-appointments", JSON.stringify([...current, appointment]));
    window.dispatchEvent(new Event("storage"));
    setCustomerName(""); setCustomerWhatsapp(""); setSelectedDate(""); setSelectedSlot(""); setDateError(""); setBookingOpen(false);
  }

  function submitReview() {
    if (!reviewName.trim() || !reviewComment.trim() || reviewRating === 0) return;
    const review = { id: Date.now(), name: reviewName.trim(), text: reviewComment.trim(), rating: reviewRating, service: bookingStyle.name, category: reviewCategory };
    const current = JSON.parse(localStorage.getItem("mouams-reviews") ?? "[]");
    localStorage.setItem("mouams-reviews", JSON.stringify([...current, review]));
    setDisplayedReviews((items) => [...items, review]);
    setReviewName(""); setReviewComment(""); setReviewRating(0); setReviewSent(true);
  }

  useEffect(() => {
    function syncServices() {
      try {
        const saved = JSON.parse(localStorage.getItem("mouams-services") ?? "null");
        if (Array.isArray(saved) && saved.length > 0) {
          const activeServices = saved.filter((service: Service) => service.active);
          setSiteServices(activeServices);
          setFilters(["Tout voir", ...Array.from(new Set(activeServices.map((service: Service) => service.category)))]);
        }
      } catch {
        setSiteServices(services);
      }
    }
    syncServices();
    window.addEventListener("storage", syncServices);
    return () => window.removeEventListener("storage", syncServices);
  }, []);

  useEffect(() => {
    function syncBlockedSlots() {
      try {
        setBlockedSlots(JSON.parse(localStorage.getItem("mouams-blocked-slots") ?? "[]"));
        const savedSlots = JSON.parse(localStorage.getItem("mouams-time-slots") ?? "null");
        if (Array.isArray(savedSlots)) setSiteSlots(savedSlots);
      } catch {
        setBlockedSlots([]);
      }
    }
    syncBlockedSlots();
    window.addEventListener("storage", syncBlockedSlots);
    return () => window.removeEventListener("storage", syncBlockedSlots);
  }, []);

  useEffect(() => {
    function updateScrollProgress() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0);
    }
    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  function openBooking(service = bookingStyle) {
    setBookingStyle(service);
    setSelectedStyle(null);
    setBookingOpen(true);
  }

  function chooseDate(value: string) {
    if (!value) {
      setSelectedDate("");
      setDateError("");
      return;
    }
    const day = new Date(`${value}T12:00:00`).getDay();
    if (day !== 0 && day !== 6 && !isSchoolHoliday(value)) {
      setSelectedDate("");
      setDateError("Les rendez-vous sont disponibles le week-end pendant les cours et tous les jours pendant les vacances.");
      return;
    }
    setSelectedDate(value);
    setDateError("");
  }

  return (
    <div className="site-shell">
      <header className="nav-wrap">
        <a href="#accueil" className="brand"><Image src="/inspiration/logo.jpeg" alt="Mouam's Hairstyle" width={72} height={72} priority /><span className="brand-name">Mouam&apos;s<br /><em>Hairstyle</em></span></a>
        <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`}><a href="#galerie" onClick={() => setMobileMenuOpen(false)}>Galerie</a><a href="#prestations" onClick={() => setMobileMenuOpen(false)}>Prestations</a><a href="#apropos" onClick={() => setMobileMenuOpen(false)}>À propos</a><a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a><a className="mobile-booking" href="#reservation" onClick={() => setMobileMenuOpen(false)}>Prendre rendez-vous <span>↗</span></a></nav>
        <button className="menu-toggle" onClick={() => setMobileMenuOpen((isOpen) => !isOpen)} aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}>{mobileMenuOpen ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}</button>
        <a className="nav-cta" href="#reservation">Prendre rendez-vous <span>↗</span></a>
      </header>

      <main>
        <section id="accueil" className="hero">
          <div className="hero-copy"><p className="eyebrow">Coiffeuse afro · <strong>Liège</strong></p><h1>Votre style.<br /><i>Votre couronne.</i></h1><p className="hero-text">Des tresses pensées pour vous, réalisées avec soin dans un espace chaleureux à <strong>Liège</strong>.</p><div className="hero-actions"><button className="button button-dark hero-button" onClick={() => openBooking()}>Réserver ma séance <span>↗</span></button><a className="text-link" href="#galerie">Voir les coiffures <span>↓</span></a></div></div>
          <div className="hero-image"><Image src="/inspiration/imageEntree.jpg" alt="Modèle portant de longues tresses" fill priority sizes="(max-width: 800px) 100vw, 52vw" /><div className="hero-stamp">Mouam&apos;s<br /><span>Hairstyle</span><small>• depuis Liège •</small></div></div>
          <div className="hero-note">Tresses qui<br /><span>racontent</span><br />votre histoire <b>✳</b></div>
        </section>

        <section id="galerie" className="section gallery-section"><div className="section-heading"><div><p className="eyebrow">Le book</p><h2>Inspirations <i>à porter.</i></h2></div><p>Chaque création est unique.<br />Trouvez celle qui vous ressemble.</p></div><div className="filters">{filters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="gallery-grid">{displayedStyles.map((service, index) => <button className={`gallery-card card-${index + 1}`} key={service.name} onClick={() => setSelectedStyle(service)}><Image src={service.image} alt={service.name} fill sizes="(max-width: 700px) 100vw, 25vw" /><span className="card-overlay"><strong>{service.name}</strong><small>{service.price} € avec mèches</small></span><span className="card-arrow">↗</span></button>)}</div>{visibleStyles.length > 6 && <button className="text-link gallery-more" onClick={() => setShowAllGallery((value) => !value)}>{showAllGallery ? "Réduire le book" : "Afficher tout le book"}</button>}<p className="gallery-note">Les images sont des inspirations. Les coiffures réalisées peuvent être conservées dans le book de Mouam&apos;s au fil des rendez-vous.</p></section>

        <section id="prestations" className="section pricing-section"><div className="section-heading"><div><p className="eyebrow">Les prestations</p><h2>Le détail qui<br /><i>change tout.</i></h2></div><p>Faites défiler les créations<br />et trouvez votre prochaine coiffure.</p></div><div className="service-showcase" key={currentService.name}><div className="service-preview"><Image src={currentService.image} alt={currentService.name} fill sizes="(max-width: 700px) 100vw, 48vw" /><span className="service-index">0{activeService + 1} / 0{siteServices.length}</span></div><div className="service-details"><p className="eyebrow light">{currentService.category}</p><h3>{currentService.name}</h3><p>{currentService.description}</p><div className="service-price">dès <strong>{currentService.price} €</strong><small>avec mèches</small></div><div className="feature-tags"><span>Taille {currentService.size}</span><span>Longueur {currentService.length}</span><span>Mèches incluses</span></div><button className="button button-dark full" onClick={() => openBooking(currentService)}>Choisir cette coiffure <span>↗</span></button><div className="service-controls"><button onClick={() => setActiveService((activeService - 1 + siteServices.length) % siteServices.length)} aria-label="Prestation précédente">←</button><div>{siteServices.map((service, index) => <button key={service.name} className={activeService === index ? "active" : ""} onClick={() => setActiveService(index)} aria-label={`Voir ${service.name}`}></button>)}</div><button onClick={() => setActiveService((activeService + 1) % siteServices.length)} aria-label="Prestation suivante">→</button></div></div></div><p className="hair-note"><b>Bon à savoir</b> — Vous pouvez fournir vos propres mèches. Elles devront être déposées au moins <b>2 jours avant</b> la prestation. L’acompte de 20 € est obligatoire et déduit du solde.</p></section>

        <section id="apropos" className="about-section"><div className="about-image"><Image src="/inspiration/sandra.jpg" alt="Portrait de la coiffeuse Mouam's Hairstyle" fill sizes="(max-width: 800px) 100vw, 40vw" /></div><div className="about-copy"><p className="eyebrow">L&apos;intention</p><h2>Prendre soin<br /><i>de vous.</i></h2><p>Chez Mouam&apos;s, chaque rendez-vous est un moment pour ralentir, échanger et repartir avec une coiffure dans laquelle vous vous sentez pleinement vous-même.</p><div className="location">✦ Liège · haute école · disponible le week-end pendant les cours et pendant les vacances</div></div></section>

        <section id="reservation" className="booking-section"><div className="booking-intro"><p className="eyebrow">Les rendez-vous</p><h2>Votre prochaine<br /><i>couronne commence ici.</i></h2><p>Les créneaux sont ouverts le week-end, de 8h à 19h. Choisissez votre coiffure et votre moment, nous vous confirmerons le rendez-vous.</p></div><div className="booking-card"><div className="booking-top"><span>Étape 01 / 02</span><strong>Votre réservation</strong></div><label htmlFor="customer-name">Votre nom</label><input id="customer-name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Prénom et nom" required /><label htmlFor="customer-whatsapp">Votre WhatsApp</label><div className="whatsapp-field"><select value={countryCode} onChange={(event) => setCountryCode(event.target.value)} aria-label="Indicatif du pays">{countryCodes.map((country) => <option value={country.code} key={country.code}>{country.code} · {country.name}</option>)}</select><input id="customer-whatsapp" value={customerWhatsapp} onChange={(event) => setCustomerWhatsapp(event.target.value.replace(/\D/g, ""))} placeholder="470 00 00 00" required /></div><label htmlFor="booking-style">Coiffure</label><select id="booking-style" value={bookingStyle.name} onChange={(event) => setBookingStyle(siteServices.find((service) => service.name === event.target.value) ?? services[0])}>{siteServices.map((service) => <option key={service.name}>{service.name}</option>)}</select><div className="booking-summary"><strong>{bookingStyle.name}</strong><span>{bookingPrice} € · {withHair ? "mèches incluses" : "sans mèches"}</span></div><label>Options mèches</label><div className="hair-options"><button className={withHair ? "selected" : ""} onClick={() => setWithHair(true)}>Avec mèches <small>{bookingStyle.price} €</small></button><button className={!withHair ? "selected" : ""} onClick={() => setWithHair(false)}>Sans mèches <small>{bookingStyle.price - 15} €</small></button></div>{!withHair && <p className="hair-warning">Si vous fournissez vos propres mèches, elles doivent être remises à Mouam&apos;s au minimum <b>2 jours avant</b> la prestation.</p>}<label htmlFor="date">Votre date <small className="field-hint">samedi ou dimanche</small></label><WeekendCalendar value={selectedDate} onChange={chooseDate} />{dateError && <p className="date-error">{dateError}</p>}<label>Heure disponible <small className="field-hint">gris = déjà réservé</small></label><div className="slots">{siteSlots.map((slot) => { const unavailable = unavailableSlots.includes(slot); return <button key={slot} className={`${selectedSlot === slot ? "selected" : ""} ${unavailable ? "unavailable" : ""}`} disabled={unavailable} onClick={() => setSelectedSlot(slot)}>{slot}</button>; })}</div><button className="button button-dark full rounded-action" onClick={() => setBookingOpen(true)} disabled={!isBookingComplete}>Continuer la réservation <span>↗</span></button><small className="deposit">Acompte obligatoire de 20 € · Confirmation manuelle par WhatsApp</small></div></section>

        <section id="faq" className="faq-section"><div><p className="eyebrow">Questions &amp; avis</p><h2>Tout est<br /><i>clair.</i></h2><p className="review-intro">Une question ou une expérience à partager ? Laissez un message, Mouam&apos;s pourra vous répondre.</p></div><div className="faq-list"><details open><summary>Où se déroule la prestation ? <span>+</span></summary><p>Les rendez-vous se déroulent chez Mouam&apos;s à Liège. Des prestations à domicile sont possibles occasionnellement sur demande.</p></details><details><summary>Les mèches sont-elles comprises ? <span>+</span></summary><p>Oui, les prix affichés incluent les mèches. Vous pouvez aussi fournir les vôtres au moins deux jours avant.</p></details><details><summary>Comment fonctionne l&apos;acompte ? <span>+</span></summary><p>Un acompte fixe de 20 € est demandé pour confirmer chaque réservation. Il est conservé en cas d&apos;annulation tardive.</p></details><div className="review-carousel"><div className="review-stars" aria-label="5 étoiles">★ ★ ★ ★ ★</div><blockquote key={activeReview}>{displayedReviews[activeReview].text}</blockquote><strong>{displayedReviews[activeReview].name}</strong><small>{displayedReviews[activeReview].service}</small><div className="review-controls"><button onClick={() => setActiveReview((activeReview - 1 + displayedReviews.length) % displayedReviews.length)} aria-label="Avis précédent">←</button><span>{activeReview + 1} / {displayedReviews.length}</span><button onClick={() => setActiveReview((activeReview + 1) % displayedReviews.length)} aria-label="Avis suivant">→</button></div></div><div className="review-form"><strong>Laisser un avis</strong><div className="review-rating" aria-label="Choisir une note">{[1, 2, 3, 4, 5].map((rating) => <button type="button" className={rating <= reviewRating ? "selected" : ""} key={rating} onClick={() => setReviewRating(rating)} aria-label={` étoiles`}>★</button>)}</div><select value={reviewCategory} onChange={(event) => setReviewCategory(event.target.value)} aria-label="Catégorie de la coiffure">{filters.filter((item) => item !== "Tout voir").map((category) => <option value={category} key={category}>{category}</option>)}</select><input value={reviewName} onChange={(event) => setReviewName(event.target.value)} placeholder="Votre prénom" /><textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Votre commentaire" rows={3}></textarea><button className="button button-dark" onClick={submitReview} disabled={!reviewName.trim() || !reviewComment.trim() || reviewRating === 0}>{reviewSent ? "Avis envoyé ✓" : "Envoyer mon avis ↗"}</button></div></div></section>
      </main>

      <footer><div className="brand footer-brand"><Image src="/inspiration/logo.jpeg" alt="" width={56} height={56} /><span className="brand-name">Mouam&apos;s<br /><em>Hairstyle</em></span></div><p>Une coiffure. Une énergie.<br />Une histoire à vous.</p><div className="socials"><a href="https://wa.me/32490212945" target="_blank" rel="noreferrer" aria-label="WhatsApp Mouam's Hairstyle"><MessageCircle size={18} /> +32 490 21 29 45</a><a href="https://www.facebook.com/profile.php?id=61553016847073&mibextid=rS40aB7S9Ucbxw6v" target="_blank" rel="noreferrer" aria-label="Facebook Mouam's Hairstyle"><FaFacebook size={18} /> Mouam&apos;s Hairstyle</a><a href="https://www.tiktok.com/@mouamshairstyle?_r=1&_t=ZS-9AnnaEgHxsy" target="_blank" rel="noreferrer" aria-label="TikTok Mouam's Hairstyle"><FaTiktok size={18} /> Mouam&apos;s Hairstyle</a><a href="https://www.instagram.com/mouamshairstyle?mdxt=d2lnZ2hmNnBlMXd2" target="_blank" rel="noreferrer" aria-label="Instagram Mouam's Hairstyle"><FaInstagram size={18} /> Mouam&apos;s Hairstyle</a></div><small>© 2026 Mouam&apos;s Hairstyle. Tous droits réservés.</small></footer>

      {selectedStyle && <div className="modal-backdrop" onClick={() => setSelectedStyle(null)}><div className="style-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedStyle(null)}>×</button><div className="modal-image"><Image src={selectedStyle.image} alt={selectedStyle.name} fill sizes="(max-width: 700px) 90vw, 420px" /></div><div className="modal-content"><p className="eyebrow">{selectedStyle.category}</p><h2>{selectedStyle.name}</h2><p>{selectedStyle.description}</p><div className="feature-tags"><span>Taille {selectedStyle.size}</span><span>Longueur {selectedStyle.length}</span><span>Mèches incluses</span></div><strong className="modal-price">{selectedStyle.price} € avec mèches</strong><button className="button button-dark full" onClick={() => openBooking(selectedStyle)}>Prendre rendez-vous <span>↗</span></button></div></div></div>}
      {bookingOpen && <div className="modal-backdrop booking-backdrop" onClick={() => setBookingOpen(false)}><div className="confirm-modal booking-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setBookingOpen(false)}>×</button><p className="eyebrow">Demande de rendez-vous</p><h2>On réserve votre<br /><i>moment beauté.</i></h2><label htmlFor="modal-customer-name">Votre nom</label><input id="modal-customer-name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Prénom et nom" required /><label htmlFor="modal-customer-whatsapp">Votre WhatsApp</label><div className="whatsapp-field"><select value={countryCode} onChange={(event) => setCountryCode(event.target.value)} aria-label="Indicatif du pays">{countryCodes.map((country) => <option value={country.code} key={country.code}>{country.code} · {country.name}</option>)}</select><input id="modal-customer-whatsapp" value={customerWhatsapp} onChange={(event) => setCustomerWhatsapp(event.target.value.replace(/\D/g, ""))} placeholder="470 00 00 00" required /></div><label htmlFor="modal-booking-style">Coiffure</label><select id="modal-booking-style" value={bookingStyle.name} onChange={(event) => setBookingStyle(siteServices.find((service) => service.name === event.target.value) ?? services[0])}>{siteServices.map((service) => <option key={service.name}>{service.name}</option>)}</select><div className="booking-summary"><strong>{bookingStyle.name}</strong><span>{bookingPrice} € · {withHair ? "mèches incluses" : "sans mèches"}</span></div><label>Options mèches</label><div className="hair-options"><button className={withHair ? "selected" : ""} onClick={() => setWithHair(true)}>Avec mèches <small>{bookingStyle.price} €</small></button><button className={!withHair ? "selected" : ""} onClick={() => setWithHair(false)}>Sans mèches <small>{bookingStyle.price - 15} €</small></button></div>{!withHair && <p className="hair-warning">Vos mèches doivent être remises au minimum <b>2 jours avant</b> la prestation.</p>}<label htmlFor="modal-date">Votre date <small className="field-hint">samedi ou dimanche</small></label><WeekendCalendar value={selectedDate} onChange={chooseDate} />{dateError && <p className="date-error">{dateError}</p>}<label>Créneau disponible</label><div className="slots">{siteSlots.map((slot) => { const unavailable = unavailableSlots.includes(slot); return <button key={slot} className={`${selectedSlot === slot ? "selected" : ""} ${unavailable ? "unavailable" : ""}`} disabled={unavailable} onClick={() => setSelectedSlot(slot)}>{slot}</button>; })}</div><button className="button button-dark full rounded-action" disabled={!isBookingComplete} onClick={submitBooking}>Envoyer ma demande <span>↗</span></button><small className="deposit">Acompte obligatoire de 20 € · Confirmation manuelle par WhatsApp</small></div></div>}
      <a className="scroll-progress" href="#accueil" style={{ "--scroll-progress": scrollProgress } as CSSProperties} aria-label="Retourner en haut de la page"><span className="afro-head" aria-hidden="true"></span></a>
    </div>
  );
}
