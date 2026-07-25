// Single source of truth for the sticky offset used below the fixed
// Navbar (h-[82px]) in the owner area. OwnerSidebar and any sticky
// section rendered inside OwnerLayout's <main> (e.g. the wizard's
// progress header) must share this exact value - otherwise each sticks
// at a different viewport offset and drifts out of alignment with the
// sidebar while scrolling.
//
// Tailwind's scanner needs each full class token (including any
// variant prefix) to appear literally in source, so both the plain and
// the `md:`-prefixed forms are exported rather than composed at
// runtime - `` `md:${OWNER_STICKY_TOP}` `` would never be recognized.
export const OWNER_STICKY_TOP = "top-[102px]";
export const OWNER_STICKY_TOP_MD = "md:top-[102px]";
