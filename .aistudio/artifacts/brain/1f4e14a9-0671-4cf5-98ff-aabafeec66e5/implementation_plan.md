# Multi-Category Studio Booking System (Tattoo, Removal, Training & Piercing)

A redesigned, high-clarity appointment booking system for Phoenix Tattooz featuring four top-level category tabs—**Tattooing**, **Laser Tattoo Removal**, **Tattoo Academy Training**, and **Sterile Piercing**—each delivering a specialized workflow, accurate pricing indicators, and instant WhatsApp & database booking confirmation.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions were confirmed during the interactive clarification phase and govern the architecture of this feature:

- **Confirmed Decision 1 (Category Layout)**: Four dedicated category buttons appear at the top of the booking modal (`Tattoo`, `Tattoo Removal`, `Tattoo Training`, `Piercing`), instantly adapting the sub-services, pricing, and input fields below without modal jarring.
- **Confirmed Decision 2 (Tattoo Removal Pricing)**: Displays transparent sizing tiers (Small, Medium, Large, Extra Large) with starting price points (₹1,499 to ₹4,999+) and expected session ranges (3–6 sessions) alongside consultation scheduling.
- **Confirmed Decision 3 (Academy & Piercing Confirmation)**: All bookings across all 4 categories will persist to the studio Supabase database (and local fallback) and generate an instant formatted WhatsApp booking notification for direct client-studio communication.

---

## 1. Overview & Core Concept

Currently, the booking modal presents a flat service dropdown that groups all studio offerings into standard tattoo options. This upgrade transforms the booking experience into a **specialized multi-service consultation portal**:

1. **Tattooing Flow**:
   - Sub-service selector: *Custom Tattoo*, *Commercial Tattoo*, *Cosmetic Tattoo (Brows/Lips)*, *Cover-Up Tattoo*.
   - Lead artist selection, body placement, approximate size selection, date & time slot, reference notes.
2. **Laser Tattoo Removal Flow**:
   - Approximate tattoo size selector: *Small (<2 sq in)*, *Medium (2–5 sq in)*, *Large (5–10 sq in)*, *Full Sleeve/Back*.
   - Estimated laser sessions predictor and transparent pricing guide (starting ₹1,499).
   - Medical & skin safety questionnaire checklist (e.g. ink age, color type, skin sensitivity).
   - Predicted date and time slot scheduling.
3. **Tattoo Academy Training Flow**:
   - Course curriculum highlights: *Hygiene & Sterilization*, *Needle & Machine Anatomy*, *Stenciling & Linework*, *Greywash Shading & Color Packing*, *Client Psychology & Studio Business*.
   - Course tiers & charges: *1-Month Foundation (₹25,000)*, *3-Month Professional Masterclass (₹65,000)*, *Weekend Specialization Workshop (₹12,000)*.
   - Batch intake date selector and enrollment seat reservation.
4. **Sterile Body Piercing Flow**:
   - Anatomical area selector: *Ear Lobe*, *Helix / Cartilage*, *Tragus*, *Nostril*, *Septum*, *Eyebrow*, *Lip / Labret*, *Navel / Belly*.
   - Jewelry preference: *Titanium Grade 23 (Hypoallergenic)*, *316L Surgical Steel*, *Gold Plated Aesthetic*.
   - Area-based pricing breakdown (₹500 to ₹1,500).
   - Appointment date & time slot selection.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[User clicks "Book Appointment"]
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│ Category Tabs: [ Tattoo ] [ Removal ] [ Training ] [ Pierce]│
└─────────────────────────────────────────────────────────────┘
      │               │                │               │
      ▼               ▼                ▼               ▼
┌───────────┐   ┌───────────┐    ┌───────────┐   ┌───────────┐
│Sub-Service│   │Size & Tier│    │Curriculum │   │Piercing   │
│Selection  │   │Price Est. │    │& Fee Card │   │Area & Type│
└─────┬─────┘   └─────┬─────┘    └─────┬─────┘   └─────┬─────┘
      │               │                │               │
      ▼               ▼                ▼               ▼
┌───────────┐   ┌───────────┐    ┌───────────┐   ┌───────────┐
│Artist Pick│   │Laser Dates│    │Batch Date │   │Jewelry &  │
│& Placement│   │& Time Slot│    │& Seat Res │   │Slot Pick  │
└─────┬─────┘   └─────┬─────┘    └─────┬─────┘   └─────┬─────┘
      └───────────────┼────────────────┼───────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ Client Name, 10-Digit Mobile Phone & Special Notes          │
└─────────────────────────────┬───────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ [ Confirm Appointment ] ──> Supabase Log + WhatsApp Action  │
└─────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **Color Discipline**: Strict `#0B0B0B` dark neutral canvas, `#141414` surface containers, hairline zinc borders (`border-zinc-800`), with electric amber (`#FFD60A`) exclusively at active tab highlights and call-to-action buttons.
- **Top Category Switcher**: Four high-contrast, single-line tabs with clear icons (`Palette` for Tattoo, `Sparkles` for Removal, `GraduationCap` for Training, `Disc` / `Activity` for Piercing).
- **Responsive Layout**: Fluid single-column stacking on mobile screens ($\le 640\text{px}$) with touch-friendly 44px+ hit targets; structured multi-column input grids on desktop tablets and laptops.
- **Zero-Pill Restraint**: Clean text-based metadata with muted secondary labels, avoiding gratuitous bubble pills or noisy badge scatter.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Unified Modal State vs. 4 Separate Modals**
  - *Chosen Approach*: Single high-performance modal with internal category state `activeCategory: 'tattoo' | 'removal' | 'training' | 'piercing'`.
  - *Why*: Eliminates DOM flickering, preserves client name/phone when toggling between tabs, and avoids modal mounting lag.
- **Decision 2: Transparent Price & Session Estimates for Removal & Training**
  - *Chosen Approach*: Display upfront, realistic market ranges for laser removal (per session) and academy fees (per course) right inside the form.
  - *Why*: Reduces client hesitation and pre-qualifies genuine inquiries before studio follow-up.
- **Decision 3: Category-Tailored WhatsApp Text Generation**
  - *Chosen Approach*: Dynamically format the WhatsApp notification message with service-specific fields (e.g. laser removal size + sessions for removal; course name + batch for academy; piercing zone + jewelry for piercing).
  - *Why*: Ensures the studio manager and artist receive complete, actionable details on WhatsApp instantly.

---

## 4. Technical Architecture & Data Strategy

### Component Hierarchy

```
src/
├── components/
│   ├── BookAppointmentModal.tsx       # Primary multi-category booking modal container
│   │   ├── BookingCategoryTabs.tsx    # 4-button header switcher (Tattoo, Removal, Training, Piercing)
│   │   ├── flows/
│   │   │   ├── TattooBookingFlow.tsx      # Sub-services, Artist pick, Placement, Size
│   │   │   ├── RemovalBookingFlow.tsx     # Laser size tiers, session predictor, pricing card
│   │   │   ├── TrainingBookingFlow.tsx    # Syllabus highlights, course tiers, fee schedule
│   │   │   └── PiercingBookingFlow.tsx    # Anatomical areas, jewelry types, area pricing
│   │   └── BookingConfirmation.tsx    # Success banner, booking code, WhatsApp trigger
├── data/
│   └── bookingServicesData.ts         # Consolidated pricing, curricula, areas & tiers data
└── lib/
    └── supabase.ts                    # Supabase appointments table persistence & schemas
```

### Data Schema Mapping

```ts
interface StudioAppointmentRecord {
  booking_code: string;
  category: 'tattoo' | 'removal' | 'training' | 'piercing';
  service: string;           // e.g. "Custom Tattoo", "Laser Tattoo Removal - Medium", "Master Tattooist Course", "Nostril Piercing"
  artist?: string;           // Assigned artist or specialist
  placement?: string;        // Body location or Piercing zone
  size?: string;             // Sizing tier or Course level
  appointment_date: string;  // Scheduled consultation/session date
  time_slot: string;         // Time slot or Batch timing
  client_name: string;
  client_phone: string;
  notes?: string;
  estimated_price?: string;  // e.g. "₹2,999/session" or "₹65,000"
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
```

---

## 5. Verification & Testing Plan

1. **Compilation & Syntax**: Run `compile_applet` and `lint_applet` to confirm zero TypeScript compilation errors.
2. **Category Switching**: Test switching smoothly between all 4 tabs (`Tattoo`, `Removal`, `Training`, `Piercing`) with responsive form adjustment.
3. **Field Validation**: Ensure required fields (Client Name, 10-digit Phone, Date, Area/Service) prevent invalid submissions.
4. **Database Persistence**: Verify appointment creation saves to Supabase and fallback storage with unique `PTZ-XXXXXX` booking code.
5. **WhatsApp Message Verification**: Confirm WhatsApp URI generation reflects the specific category, pricing, and selected parameters accurately.
