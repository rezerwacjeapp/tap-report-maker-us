import type { CustomFieldDef, CustomFieldType, TileItem } from "./storage";

// ============================================================
// DATA MODEL
// ============================================================

export interface SignatureFieldDef {
  id: string;
  label: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  builtIn: boolean;
  pdfTitle: string;
  fields: CustomFieldDef[];
  tiles: TileItem[];
  hasPhotos: boolean;
  showCompanyHeader?: boolean;
  signatureFields: SignatureFieldDef[];
}

// A catalog block = a group of related fields or tiles the user can toggle on/off
export interface FieldBlock {
  id: string;
  category: string;
  label: string;
  fields: CustomFieldDef[];
}

export interface TileBlock {
  id: string;
  category: string;
  label: string;
  tiles: TileItem[];
}

// ============================================================
// FIELD CATALOG — ready-made blocks grouped by category
// ============================================================

export const FIELD_CATALOG: FieldBlock[] = [
  // --- Customer ---
  {
    id: "fb_client_name",
    category: "Customer",
    label: "Customer name",
    fields: [{ id: "f_client", label: "Customer name", type: "text", remember: false, order: 0 }],
  },
  {
    id: "fb_client_address",
    category: "Customer",
    label: "Service address",
    fields: [{ id: "f_address", label: "Service address", type: "text", remember: false, order: 1 }],
  },
  {
    id: "fb_client_phone",
    category: "Customer",
    label: "Customer phone",
    fields: [{ id: "f_phone", label: "Customer phone", type: "text", remember: false, order: 2 }],
  },
  {
    id: "fb_client_email",
    category: "Customer",
    label: "Customer email",
    fields: [{ id: "f_email", label: "Customer email", type: "text", remember: false, order: 3 }],
  },
  {
    id: "fb_contact_person",
    category: "Customer",
    label: "Contact person",
    fields: [{ id: "f_contact", label: "Contact person", type: "text", remember: false, order: 4 }],
  },

  // --- Date & job ---
  {
    id: "fb_date",
    category: "Date & job",
    label: "Service date",
    fields: [{ id: "f_date", label: "Service date", type: "date", remember: false, order: 5 }],
  },
  {
    id: "fb_date_next",
    category: "Date & job",
    label: "Next service date",
    fields: [{ id: "f_date_next", label: "Next service date", type: "date", remember: false, order: 6 }],
  },
  {
    id: "fb_contract_nr",
    category: "Date & job",
    label: "Work order / contract #",
    fields: [{ id: "f_contract", label: "Work order / contract #", type: "text", remember: false, order: 7 }],
  },
  {
    id: "fb_po_nr",
    category: "Date & job",
    label: "PO number",
    fields: [{ id: "f_po", label: "PO number", type: "text", remember: false, reuse: false, order: 8 }],
  },

  // --- Site / equipment ---
  {
    id: "fb_object_name",
    category: "Site / equipment",
    label: "Site / building name",
    fields: [{ id: "f_obj_name", label: "Site / building name", type: "text", remember: false, order: 9 }],
  },
  {
    id: "fb_object_location",
    category: "Site / equipment",
    label: "Location",
    fields: [{ id: "f_obj_loc", label: "Location", type: "text", remember: false, order: 10 }],
  },
  {
    id: "fb_object_number",
    category: "Site / equipment",
    label: "Unit / tag number",
    fields: [{ id: "f_obj_num", label: "Unit / tag number", type: "text", remember: false, order: 11 }],
  },
  {
    id: "fb_object_desc",
    category: "Site / equipment",
    label: "Description",
    fields: [{ id: "f_obj_desc", label: "Description", type: "textarea", remember: false, order: 12 }],
  },

  // --- Other ---
  {
    id: "fb_notes",
    category: "Other",
    label: "Notes",
    fields: [{ id: "f_notes", label: "Notes", type: "textarea", remember: false, reuse: false, order: 13 }],
  },
  {
    id: "fb_condition",
    category: "Other",
    label: "Overall condition",
    fields: [{ id: "f_condition", label: "Overall condition", type: "textarea", remember: false, reuse: false, order: 14 }],
  },
  {
    id: "fb_recommendations",
    category: "Other",
    label: "Recommendations",
    fields: [{ id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 15 }],
  },

  // --- Tables ---
  {
    id: "fb_table_materials",
    category: "Tables",
    label: "Parts & materials used",
    fields: [{ id: "tb_materials", label: "Parts & materials used", type: "table" as CustomFieldType, remember: false, reuse: false, order: 16,
      tableColumns: [{ id: "c_name", label: "Item" }, { id: "c_qty", label: "Qty", kind: "number" }, { id: "c_unit", label: "Unit" }] }],
  },
  {
    id: "fb_table_devices",
    category: "Tables",
    label: "Equipment list",
    fields: [{ id: "tb_devices", label: "Equipment list", type: "table" as CustomFieldType, remember: false, order: 17,
      tableColumns: [{ id: "c_dev", label: "Equipment" }, { id: "c_model", label: "Make / model" }, { id: "c_sn", label: "Serial #" }, { id: "c_loc", label: "Location" }] }],
  },
];

// ============================================================
// TILE CATALOG — ready-made activity groups
// ============================================================

export const TILE_CATALOG: TileBlock[] = [];

// ============================================================
// TEXTS ABOVE SIGNATURES (printed on the PDF)
// ============================================================

/** What the customer confirms by signing a service or inspection report. */
const ACK_SERVICE = "By signing, I acknowledge that the service described in this report was performed at the location above on the date shown and that I received a copy of this report.";
const ACK_GAS = `${ACK_SERVICE} If an unsafe condition is noted above, I acknowledge that it was explained to me and that the appliance was shut off and tagged as noted.`;
const ACK_BACKFLOW_TESTER = "I certify that I tested this assembly on the date shown using the test kit listed above and that the results in this report are true and accurate.";
const ACK_RENTAL = "Landlord/agent and tenant agree that this report describes the condition of the unit on the date shown, except as noted under Tenant comments. The tenant received a copy of this report.";
const ACK_WORK_ORDER = "By signing, I acknowledge that the work described above was completed and that I received a copy of this work order.";
const ACK_ESTIMATE = "By signing, I approve the work and price described in this estimate.";

/** Estimate: printed terms, and a note for the contractor that stays in the app. */
const ESTIMATE_TERMS = "This estimate is based on the conditions observed at the time of the visit and on the scope of work described above. Prices are valid until the date shown. Work not listed, hidden conditions and changes in scope need separate approval. This estimate is not an invoice.";
const ESTIMATE_GUIDE = "A signed estimate can become a contract. Home improvement contracts may need state-specific terms, for example California (B&P Code 7159 for contracts over $500 and 7159.10 for service and repair contracts), New York (General Business Law 771) and Florida (license number on bids, F.S. 489.119). Sales of $25 or more made at the customer's home may need a 3-day cancellation notice under the FTC Cooling-Off Rule (16 CFR Part 429), unless an exemption applies. Add the terms you need under \"Other terms and notices required in your state\".";

// ============================================================
// BUILT-IN TEMPLATE STARTERS (presets)
// ============================================================

export const STARTER_TEMPLATES: ReportTemplate[] = [
  // ===================== 1. HVAC MAINTENANCE =====================
  {
    id: "us_hvac",
    name: "HVAC Maintenance",
    description: "AC and heat pump maintenance with readings",
    icon: "Wind",
    category: "HVAC",
    builtIn: true,
    pdfTitle: "HVAC MAINTENANCE REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Technicians who maintain, service, repair or dispose of equipment that could release refrigerant must be EPA Section 608 certified (40 CFR Part 82, Subpart F). Since 01/01/2026, appliances with 15 lbs or more of HFC refrigerant (or a substitute with GWP above 53), other than residential and light commercial AC and heat pumps, are also subject to leak repair and recordkeeping under 40 CFR 84.106 (documented in a separate refrigerant service record). HVAC/mechanical licensing is set by each state or locality.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Service Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Service date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_license", label: "State license #", type: "text", remember: true, order: 11 },
      { id: "f_epa_cert", label: "EPA 608 certification #", type: "text", remember: true, order: 12 },
      { id: "h_equipment", label: "Equipment", type: "heading", remember: false, order: 13, labelStyle: { bold: true } },
      { id: "f_system_type", label: "System type (split AC, heat pump, package unit, mini-split, RTU)", type: "text", remember: false, order: 14 },
      { id: "f_outdoor_unit", label: "Outdoor unit make / model / serial #", type: "text", remember: false, order: 15 },
      { id: "f_indoor_unit", label: "Indoor unit / air handler / furnace make / model / serial #", type: "text", remember: false, order: 16 },
      { id: "f_capacity", label: "Nominal capacity (tons)", type: "number", remember: false, reuse: true, order: 17 },
      { id: "f_refrigerant_type", label: "Refrigerant type (e.g., R-410A, R-454B, R-32)", type: "text", remember: false, order: 18 },
      { id: "f_factory_charge", label: "Nameplate refrigerant charge (lbs)", type: "number", remember: false, reuse: true, order: 19 },
      { id: "f_filter_size", label: "Filter size (in., e.g., 16x25x1)", type: "text", remember: false, order: 20 },
      { id: "h_measurements", label: "Measurements", type: "heading", remember: false, order: 21, labelStyle: { bold: true } },
      { id: "f_outdoor_temp", label: "Outdoor ambient temperature (°F)", type: "number", remember: false, order: 22 },
      { id: "f_return_temp", label: "Return air temperature (°F)", type: "number", remember: false, order: 23 },
      { id: "f_supply_temp", label: "Supply air temperature (°F)", type: "number", remember: false, order: 24 },
      { id: "f_temp_split", label: "Temperature split ΔT (°F)", type: "number", remember: false, order: 25 },
      { id: "f_suction_pressure", label: "Suction pressure (psig)", type: "number", remember: false, order: 26 },
      { id: "f_liquid_pressure", label: "Liquid line pressure (psig)", type: "number", remember: false, order: 27 },
      { id: "f_superheat", label: "Superheat (°F)", type: "number", remember: false, order: 28 },
      { id: "f_subcooling", label: "Subcooling (°F)", type: "number", remember: false, order: 29 },
      { id: "f_static_pressure", label: "Total external static pressure (in. w.c.)", type: "number", remember: false, order: 30 },
      { id: "f_airflow", label: "Airflow (CFM)", type: "number", remember: false, order: 31 },
      { id: "f_line_voltage", label: "Line voltage (V)", type: "number", remember: false, order: 32 },
      { id: "tb_electrical", label: "Electrical components", type: "table", remember: false, order: 33, tableColumns: [{ id: "c1", label: "Component (compressor, condenser fan, blower, capacitor)", kind: "text" }, { id: "c2", label: "Rated (A or µF)", kind: "number", reuse: true }, { id: "c3", label: "Measured (A or µF)", kind: "number" }, { id: "c4", label: "Result", kind: "choice", options: ["Pass", "Fail", "N/A"] }] },
      { id: "f_refrigerant_added", label: "Refrigerant added (lbs)", type: "number", remember: false, order: 34 },
      { id: "f_maintenance_tiles", label: "Maintenance checklist", type: "tiles", remember: false, order: 35, tileOptions: [
        { id: "t_h1", label: "Replaced / cleaned air filter" },
        { id: "t_h2", label: "Checked thermostat operation" },
        { id: "t_h3", label: "Inspected / cleaned evaporator coil" },
        { id: "t_h4", label: "Cleaned condenser coil" },
        { id: "t_h5", label: "Flushed condensate drain line" },
        { id: "t_h6", label: "Checked drain pan and float switch" },
        { id: "t_h7", label: "Tightened electrical connections" },
        { id: "t_h8", label: "Inspected contactor" },
        { id: "t_h9", label: "Tested capacitor(s)" },
        { id: "t_h10", label: "Lubricated motors / bearings (if applicable)" },
        { id: "t_h11", label: "Inspected blower wheel and motor" },
        { id: "t_h12", label: "Inspected / adjusted belts (if applicable)" },
        { id: "t_h13", label: "Checked line set insulation" },
        { id: "t_h14", label: "Checked for refrigerant leaks" },
        { id: "t_h15", label: "Verified defrost operation (heat pump)" },
        { id: "t_h16", label: "Checked ductwork and registers" },
        { id: "t_h17", label: "Inspected vent / flue (gas furnace)" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 36, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall result", type: "table", remember: false, reuse: false, order: 37, tableColumns: [{ id: "c1", label: "System", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["Operating normally", "Operating - repairs recommended", "Not operating / shut down"] }], tableRows: ["Overall"] },
      { id: "tb_deficiencies", label: "Deficiencies found", type: "table", remember: false, reuse: false, order: 38, tableColumns: [{ id: "c1", label: "Deficiency", kind: "text" }, { id: "c2", label: "Component / location", kind: "text" }, { id: "c3", label: "Priority", kind: "choice", options: ["Safety", "Urgent", "Recommended"] }, { id: "c4", label: "Corrected on site", kind: "choice", options: ["Yes", "No"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 39 },
      { id: "f_date_next", label: "Next scheduled maintenance", type: "date", remember: false, order: 40 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 41 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 42 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 43, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 44 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 2. REFRIGERANT SERVICE LOG =====================
  {
    id: "us_refrigerant",
    name: "Refrigerant Service Log",
    description: "EPA 608 / AIM Act refrigerant record for the owner",
    icon: "Snowflake",
    category: "HVAC",
    builtIn: true,
    pdfTitle: "REFRIGERANT SERVICE RECORD",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Under 40 CFR 84.106 (AIM Act Emissions Reduction and Reclamation rule), applicable as of 01/01/2026, appliances with a full charge of 15 lbs or more of an HFC or a substitute with GWP above 53 are subject to leak rate calculation, leak repair and recordkeeping; residential and light commercial AC and heat pumps are excluded. A technician who adds or removes refrigerant must give the owner/operator a record of the appliance identity and location, date, parts serviced, type of service, name of the person performing it, and the amount and type of refrigerant added or removed. Appliances with 50 lbs or more of ozone-depleting refrigerant (e.g., R-22) remain under 40 CFR 82.157. Records must be kept for at least 3 years.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Owner / Operator", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Service Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Service date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_epa_cert_type", label: "EPA 608 certification type (Type I / II / III / Universal)", type: "text", remember: true, order: 11 },
      { id: "f_epa_cert", label: "EPA 608 certification #", type: "text", remember: true, order: 12 },
      { id: "f_license", label: "State license #", type: "text", remember: true, order: 13 },
      { id: "h_appliance", label: "Appliance", type: "heading", remember: false, order: 14, labelStyle: { bold: true } },
      { id: "f_appliance_id", label: "Appliance ID / asset tag", type: "text", remember: false, order: 15 },
      { id: "f_appliance_location", label: "Location of appliance at site (e.g., roof, RTU-3)", type: "text", remember: false, order: 16 },
      { id: "f_appliance_make", label: "Make / model / serial #", type: "text", remember: false, order: 17 },
      { id: "tb_appliance_class", label: "Appliance classification", type: "table", remember: false, order: 18, tableColumns: [{ id: "c1", label: "Appliance type", kind: "choice", reuse: true, options: ["Comfort cooling", "Commercial refrigeration", "Industrial process refrigeration", "Refrigerated transport", "Residential / light commercial AC"] }, { id: "c2", label: "Refrigerant class", kind: "choice", reuse: true, options: ["HFC / GWP > 53", "ODS (CFC / HCFC)", "Low-GWP (GWP ≤ 53)"] }] },
      { id: "f_refrigerant_type", label: "Refrigerant type (ASHRAE #, e.g., R-404A)", type: "text", remember: false, order: 19 },
      { id: "f_full_charge", label: "Full charge (lbs)", type: "number", remember: false, reuse: true, order: 20 },
      { id: "f_full_charge_method", label: "Method used to determine full charge", type: "text", remember: false, order: 21 },
      { id: "h_service", label: "Service Performed", type: "heading", remember: false, order: 22, labelStyle: { bold: true } },
      { id: "f_parts_serviced", label: "Part(s) of appliance installed, serviced, repaired or disposed", type: "textarea", remember: false, reuse: false, order: 23 },
      { id: "f_service_type", label: "Type of service (installation, service, repair, disposal)", type: "text", remember: false, reuse: false, order: 24 },
      { id: "f_refrigerant_added", label: "Refrigerant added (lbs)", type: "number", remember: false, order: 25 },
      { id: "f_refrigerant_removed", label: "Refrigerant recovered / removed (lbs)", type: "number", remember: false, order: 26 },
      { id: "f_last_addition", label: "Date of previous refrigerant addition", type: "date", remember: false, reuse: false, order: 27 },
      { id: "f_leak_rate", label: "Calculated leak rate (% per year)", type: "number", remember: false, order: 28 },
      { id: "f_leak_rate_method", label: "Leak rate method (annualizing / rolling average)", type: "text", remember: false, order: 29 },
      { id: "f_recovery_machine", label: "Recovery machine make / model / serial #", type: "text", remember: true, order: 30 },
      { id: "f_recovery_cylinder", label: "Recovery cylinder ID", type: "text", remember: false, reuse: false, order: 31 },
      { id: "h_leak", label: "Leak Inspection & Verification", type: "heading", remember: false, order: 32, labelStyle: { bold: true } },
      { id: "f_leak_method", label: "Leak inspection method(s) (electronic, bubble, UV dye, standing pressure)", type: "text", remember: false, order: 33 },
      { id: "tb_leaks", label: "Leaks found / repaired", type: "table", remember: false, reuse: false, order: 34, tableColumns: [{ id: "c1", label: "Leak location", kind: "text" }, { id: "c2", label: "Repaired", kind: "choice", options: ["Yes", "No"] }, { id: "c3", label: "Initial verification test", kind: "choice", options: ["Pass", "Fail", "N/A"] }, { id: "c4", label: "Follow-up verification test", kind: "choice", options: ["Pass", "Fail", "Pending"] }, { id: "c5", label: "Test method", kind: "text" }] },
      { id: "f_initial_test_date", label: "Initial verification test date", type: "date", remember: false, reuse: false, order: 35 },
      { id: "f_followup_test_date", label: "Follow-up verification test date", type: "date", remember: false, reuse: false, order: 36 },
      { id: "f_compliance_tiles", label: "Compliance checklist", type: "tiles", remember: false, order: 37, tileOptions: [
        { id: "t_r1", label: "All visible and accessible parts inspected" },
        { id: "t_r2", label: "Leak rate calculated after refrigerant addition" },
        { id: "t_r3", label: "Leak(s) located and tagged" },
        { id: "t_r4", label: "Repair performed by certified technician" },
        { id: "t_r5", label: "Initial verification test performed" },
        { id: "t_r6", label: "Follow-up verification test performed" },
        { id: "t_r7", label: "Recovered to required evacuation level" },
        { id: "t_r8", label: "Recovered refrigerant weighed and recorded" },
        { id: "t_r9", label: "Recovery cylinder labeled with refrigerant type" },
        { id: "t_r10", label: "Owner advised of repair deadline (leak rate exceeded)" },
        { id: "t_r11", label: "Refrigerant sent for reclamation / destruction" },
        { id: "t_r12", label: "Copy of record given to owner/operator" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 38, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Leak rate compliance", type: "table", remember: false, order: 39, tableColumns: [{ id: "c1", label: "Applicable threshold", kind: "choice", reuse: true, options: ["10% comfort cooling / refrigerated transport / other", "20% commercial refrigeration", "30% industrial process", "Not subject to leak repair"] }, { id: "c2", label: "Threshold exceeded", kind: "choice", options: ["Yes", "No", "N/A"] }] },
      { id: "f_transfer", label: "Refrigerant transferred to (reclaimer / person) and date", type: "text", remember: false, reuse: false, order: 40 },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 41 },
      { id: "f_date_next", label: "Next leak inspection / follow-up due", type: "date", remember: false, order: 42 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 43 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 44 },
      { id: "i_ack", label: "Owner / operator acknowledgment", type: "info", remember: false, order: 45, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 46 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 3. GAS FURNACE / BOILER =====================
  {
    id: "us_gas_heating",
    name: "Gas Furnace / Boiler",
    description: "Furnace or boiler safety check with combustion test",
    icon: "Flame",
    category: "Heating",
    builtIn: true,
    pdfTitle: "GAS HEATING SAFETY INSPECTION REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Gas-fired furnaces, boilers and water heaters are installed and serviced per the fuel gas code adopted by the jurisdiction (NFPA 54 National Fuel Gas Code or the International Fuel Gas Code) and the manufacturer's instructions. Boilers in commercial and multifamily buildings may also be subject to a state boiler inspection program; this report documents contractor service and does not replace a state certificate of operation. Gas fitter and mechanical licensing varies by state and locality.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Service Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Service date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_license", label: "State license #", type: "text", remember: true, order: 11 },
      { id: "h_appliance", label: "Appliance", type: "heading", remember: false, order: 12, labelStyle: { bold: true } },
      { id: "f_appliance_type", label: "Appliance type (furnace, boiler, water heater)", type: "text", remember: false, order: 13 },
      { id: "f_make", label: "Make / model / serial #", type: "text", remember: false, order: 14 },
      { id: "f_input", label: "Input rating (BTU/h)", type: "number", remember: false, reuse: true, order: 15 },
      { id: "f_fuel", label: "Fuel type (natural gas / LP)", type: "text", remember: false, order: 16 },
      { id: "f_vent", label: "Vent type (B-vent, PVC, masonry chimney)", type: "text", remember: false, order: 17 },
      { id: "h_measurements", label: "Measurements", type: "heading", remember: false, order: 18, labelStyle: { bold: true } },
      { id: "f_inlet_pressure", label: "Inlet gas pressure (in. w.c.)", type: "number", remember: false, order: 19 },
      { id: "f_manifold_pressure", label: "Manifold gas pressure (in. w.c.)", type: "number", remember: false, order: 20 },
      { id: "f_temp_rise", label: "Measured temperature rise (°F)", type: "number", remember: false, order: 21 },
      { id: "f_rated_rise", label: "Rated temperature rise range (°F)", type: "text", remember: false, order: 22 },
      { id: "f_flue_temp", label: "Flue gas temperature (°F)", type: "number", remember: false, order: 23 },
      { id: "f_o2", label: "O2 (%)", type: "number", remember: false, order: 24 },
      { id: "f_co2", label: "CO2 (%)", type: "number", remember: false, order: 25 },
      { id: "f_co_airfree", label: "CO air-free (ppm)", type: "number", remember: false, order: 26 },
      { id: "f_draft", label: "Draft (in. w.c.)", type: "number", remember: false, order: 27 },
      { id: "f_efficiency", label: "Combustion efficiency (%)", type: "number", remember: false, order: 28 },
      { id: "f_flame_signal", label: "Flame signal (µA)", type: "number", remember: false, order: 29 },
      { id: "f_ambient_co", label: "Ambient CO in living space (ppm)", type: "number", remember: false, order: 30 },
      { id: "f_boiler_pressure", label: "Boiler operating pressure (psi)", type: "number", remember: false, order: 31 },
      { id: "f_relief_rating", label: "Relief valve rating (psi)", type: "number", remember: false, reuse: true, order: 32 },
      { id: "f_safety_tiles", label: "Inspection checklist", type: "tiles", remember: false, order: 33, tileOptions: [
        { id: "t_g1", label: "Gas leak check at connections and valves" },
        { id: "t_g2", label: "Heat exchanger visually inspected" },
        { id: "t_g3", label: "Burners inspected and cleaned" },
        { id: "t_g4", label: "Flame sensor cleaned" },
        { id: "t_g5", label: "Igniter / pilot checked" },
        { id: "t_g6", label: "High limit switch tested" },
        { id: "t_g7", label: "Flame rollout switches checked" },
        { id: "t_g8", label: "Pressure switch and inducer checked" },
        { id: "t_g9", label: "Blower cleaned and amp draw checked" },
        { id: "t_g10", label: "Air filter replaced" },
        { id: "t_g11", label: "Condensate drain and trap cleared" },
        { id: "t_g12", label: "Vent connector and chimney inspected" },
        { id: "t_g13", label: "Combustion air openings clear" },
        { id: "t_g14", label: "Thermostat cycle test" },
        { id: "t_g15", label: "CO alarm present and tested" },
        { id: "t_g16", label: "Low-water cutoff tested (boiler)" },
        { id: "t_g17", label: "Relief valve inspected (boiler / water heater)" },
        { id: "t_g18", label: "Expansion tank checked (boiler)" },
        { id: "t_g19", label: "Customer informed of unsafe condition, tag left (if applicable)" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 34, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall result", type: "table", remember: false, reuse: false, order: 35, tableColumns: [{ id: "c1", label: "Appliance", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["No hazards observed", "Operating - repairs recommended", "Unsafe - shut off / red-tagged"] }], tableRows: ["Overall"] },
      { id: "tb_deficiencies", label: "Deficiencies", type: "table", remember: false, reuse: false, order: 36, tableColumns: [{ id: "c1", label: "Component", kind: "text" }, { id: "c2", label: "Description", kind: "text" }, { id: "c3", label: "Priority", kind: "choice", options: ["Hazard", "Urgent", "Recommended"] }, { id: "c4", label: "Corrected on site", kind: "choice", options: ["Yes", "No"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 37 },
      { id: "f_date_next", label: "Next service due", type: "date", remember: false, order: 38 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 39 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 40 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 41, content: ACK_GAS },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 42 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 4. BACKFLOW TEST REPORT =====================
  {
    id: "us_backflow",
    name: "Backflow Test Report",
    description: "Assembly field test for the water purveyor",
    icon: "Droplets",
    category: "Plumbing",
    builtIn: true,
    pdfTitle: "BACKFLOW PREVENTION ASSEMBLY TEST REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Backflow prevention assembly testing is governed by state drinking water and cross-connection control rules and enforced by the local water purveyor; there is no single national form. Testers must hold a certification recognized by the state or purveyor, and the test kit must have a current accuracy verification or calibration. Many purveyors require results on their own form or through an online portal by a set deadline.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "f_water_purveyor", label: "Water purveyor / utility", type: "text", remember: false, order: 8 },
      { id: "f_account", label: "Water account / meter #", type: "text", remember: false, order: 9 },
      { id: "h_details", label: "Test Details", type: "heading", remember: false, order: 10, labelStyle: { bold: true } },
      { id: "f_date", label: "Test date", type: "date", remember: false, order: 11 },
      { id: "f_test_time", label: "Test time", type: "text", remember: false, reuse: false, order: 12 },
      { id: "f_tech_name", label: "Tester name", type: "text", remember: true, order: 13 },
      { id: "f_tester_cert", label: "Tester certification #", type: "text", remember: true, order: 14 },
      { id: "f_tester_cert_exp", label: "Tester certification expiration", type: "date", remember: true, order: 15 },
      { id: "f_license_plumb", label: "State plumbing license # (if repairs made)", type: "text", remember: true, order: 16 },
      { id: "f_kit", label: "Test kit make / model", type: "text", remember: true, order: 17 },
      { id: "f_kit_serial", label: "Test kit serial #", type: "text", remember: true, order: 18 },
      { id: "f_kit_cal", label: "Test kit calibration / verification date", type: "date", remember: true, order: 19 },
      { id: "h_assembly", label: "Assembly", type: "heading", remember: false, order: 20, labelStyle: { bold: true } },
      { id: "f_assembly_type", label: "Assembly type (RP, DC, PVB, SVB, RPDA, DCDA)", type: "text", remember: false, order: 21 },
      { id: "f_assembly_make", label: "Make / model", type: "text", remember: false, order: 22 },
      { id: "f_assembly_serial", label: "Serial #", type: "text", remember: false, order: 23 },
      { id: "f_assembly_size", label: "Size (in.)", type: "number", remember: false, reuse: true, order: 24 },
      { id: "f_assembly_location", label: "Assembly location", type: "text", remember: false, order: 25 },
      { id: "f_service_type", label: "Service type (domestic, fire, irrigation)", type: "text", remember: false, order: 26 },
      { id: "f_line_pressure", label: "Line pressure (psi)", type: "number", remember: false, order: 27 },
      { id: "h_initial", label: "Initial Test", type: "heading", remember: false, order: 28, labelStyle: { bold: true } },
      { id: "f_cv1", label: "Check valve #1 - differential (psid)", type: "number", remember: false, order: 29 },
      { id: "f_cv2", label: "Check valve #2 - differential (psid)", type: "number", remember: false, order: 30 },
      { id: "f_rv", label: "Relief valve - opened at (psid)", type: "number", remember: false, order: 31 },
      { id: "f_air_inlet", label: "PVB / SVB air inlet - opened at (psid)", type: "number", remember: false, order: 32 },
      { id: "f_pvb_check", label: "PVB / SVB check valve (psid)", type: "number", remember: false, order: 33 },
      { id: "tb_initial_result", label: "Initial test result", type: "table", remember: false, reuse: false, order: 34, tableColumns: [{ id: "c1", label: "Component", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["Closed tight", "Leaked", "Opened", "Did not open", "N/A"] }] },
      { id: "h_repair", label: "Repairs & Final Test", type: "heading", remember: false, order: 35, labelStyle: { bold: true } },
      { id: "f_repairs", label: "Repairs / parts replaced", type: "textarea", remember: false, reuse: false, order: 36 },
      { id: "tb_final_test", label: "Final test after repair", type: "table", remember: false, reuse: false, order: 37, tableColumns: [{ id: "c1", label: "Component", kind: "text" }, { id: "c2", label: "Reading (psid)", kind: "number" }, { id: "c3", label: "Result", kind: "choice", options: ["Pass", "Fail", "N/A"] }] },
      { id: "f_test_tiles", label: "Test checklist", type: "tiles", remember: false, order: 38, tileOptions: [
        { id: "t_b1", label: "Assembly identified, serial # verified" },
        { id: "t_b2", label: "Installation orientation and clearance correct" },
        { id: "t_b3", label: "Customer notified of water shutoff" },
        { id: "t_b4", label: "Test cocks flushed" },
        { id: "t_b5", label: "Shutoff valve #2 held tight" },
        { id: "t_b6", label: "Check valve #1 tested" },
        { id: "t_b7", label: "Check valve #2 tested" },
        { id: "t_b8", label: "Relief valve / air inlet tested" },
        { id: "t_b9", label: "Shutoff valves returned to open position" },
        { id: "t_b10", label: "Water service restored" },
        { id: "t_b11", label: "Test tag attached to assembly" },
        { id: "t_b12", label: "Report submitted to water purveyor" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 39, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall result", type: "table", remember: false, reuse: false, order: 40, tableColumns: [{ id: "c1", label: "Assembly serial #", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["Pass", "Fail", "Pass after repair"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 41 },
      { id: "f_date_next", label: "Next test due", type: "date", remember: false, order: 42 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 43 },
      { id: "i_tester_cert", label: "Tester certification", type: "info", remember: false, order: 44, content: ACK_BACKFLOW_TESTER },
      { id: "sig_tech", label: "Tester signature", type: "signature", remember: false, order: 45 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 46, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 47 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 5. PLUMBING / WATER HEATER =====================
  {
    id: "us_plumbing",
    name: "Plumbing / Water Heater",
    description: "Plumbing service call with water heater check",
    icon: "Wrench",
    category: "Plumbing",
    builtIn: true,
    pdfTitle: "PLUMBING SERVICE REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Plumbing work is done under the plumbing code adopted by the jurisdiction (International Plumbing Code or Uniform Plumbing Code, with local amendments) and the manufacturer's instructions. Water heater replacement usually requires a permit and inspection. Both model codes require a pressure-reducing valve where static water pressure exceeds 80 psi. In California, water heaters must be braced, anchored or strapped against earthquake motion (Health and Safety Code 19211). Plumbing licensing varies by state and locality.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Service Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Service date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_license_plumb", label: "State/local plumbing license #", type: "text", remember: true, order: 11 },
      { id: "f_permit", label: "Permit # (if required)", type: "text", remember: false, reuse: false, order: 12 },
      { id: "f_complaint", label: "Customer request / reported problem", type: "textarea", remember: false, reuse: false, order: 13 },
      { id: "h_water_heater", label: "Water Heater", type: "heading", remember: false, order: 14, labelStyle: { bold: true } },
      { id: "f_wh_type", label: "Type (tank, tankless, heat pump)", type: "text", remember: false, order: 15 },
      { id: "f_wh_fuel", label: "Fuel / power (natural gas, LP, electric)", type: "text", remember: false, order: 16 },
      { id: "f_wh_make", label: "Make / model / serial #", type: "text", remember: false, order: 17 },
      { id: "f_wh_capacity", label: "Capacity (gal)", type: "number", remember: false, reuse: true, order: 18 },
      { id: "f_wh_input", label: "Input rating (BTU/h or kW)", type: "text", remember: false, order: 19 },
      { id: "f_wh_year", label: "Year of manufacture", type: "number", remember: false, reuse: true, order: 20 },
      { id: "f_wh_location", label: "Location (garage, attic, closet, basement)", type: "text", remember: false, order: 21 },
      { id: "h_measurements", label: "Measurements", type: "heading", remember: false, order: 22, labelStyle: { bold: true } },
      { id: "f_water_pressure", label: "Static water pressure (psi)", type: "number", remember: false, order: 23 },
      { id: "f_hot_water_temp", label: "Hot water temperature at nearest fixture (°F)", type: "number", remember: false, order: 24 },
      { id: "f_expansion_tank", label: "Expansion tank pre-charge (psi)", type: "number", remember: false, order: 25 },
      { id: "f_ambient_co", label: "Ambient CO near appliance (ppm, gas units)", type: "number", remember: false, order: 26 },
      { id: "f_wh_tiles", label: "Water heater checklist", type: "tiles", remember: false, order: 27, tileOptions: [
        { id: "t_wh1", label: "T&P relief valve present, full-size discharge pipe to an approved location" },
        { id: "t_wh2", label: "T&P relief valve tested" },
        { id: "t_wh3", label: "Thermal expansion control present where required" },
        { id: "t_wh4", label: "Seismic straps installed (required in California)" },
        { id: "t_wh5", label: "Drain pan present where required" },
        { id: "t_wh6", label: "Gas shutoff valve and sediment trap present (gas)" },
        { id: "t_wh7", label: "Vent connector and termination inspected (gas)" },
        { id: "t_wh8", label: "Draft / spillage test performed (atmospheric vent)" },
        { id: "t_wh9", label: "Combustion air openings clear (gas)" },
        { id: "t_wh10", label: "Ignition source 18 in. above garage floor or FVIR-listed unit (gas)" },
        { id: "t_wh11", label: "Electrical connections and bonding inspected (electric)" },
        { id: "t_wh12", label: "Tank flushed / sediment removed" },
        { id: "t_wh13", label: "Anode rod inspected" },
        { id: "t_wh14", label: "No leaks at connections after service" },
      ]},
      { id: "f_plumb_tiles", label: "Plumbing checklist", type: "tiles", remember: false, order: 28, tileOptions: [
        { id: "t_pl1", label: "Main shutoff valve located and operable" },
        { id: "t_pl2", label: "Pressure-reducing valve present (static pressure over 80 psi)" },
        { id: "t_pl3", label: "Fixtures and supply lines checked for leaks" },
        { id: "t_pl4", label: "Drains flow freely" },
        { id: "t_pl5", label: "Exposed supply and drain piping inspected" },
        { id: "t_pl6", label: "Hose bibb vacuum breakers present" },
        { id: "t_pl7", label: "System tested after work" },
      ]},
      { id: "tb_materials", label: "Parts & materials", type: "table", remember: false, reuse: false, order: 29, tableColumns: [{ id: "c1", label: "Description", kind: "text" }, { id: "c2", label: "Qty", kind: "number" }, { id: "c3", label: "Unit (ea, ft, gal)", kind: "text" }] },
      { id: "f_work_description", label: "Description of work performed", type: "textarea", remember: false, reuse: false, order: 30 },
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 31, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_deficiencies", label: "Deficiencies found", type: "table", remember: false, reuse: false, order: 32, tableColumns: [{ id: "c1", label: "Deficiency", kind: "text" }, { id: "c2", label: "Location", kind: "text" }, { id: "c3", label: "Priority", kind: "choice", options: ["Safety", "Urgent", "Recommended"] }, { id: "c4", label: "Corrected on site", kind: "choice", options: ["Yes", "No"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 33 },
      { id: "f_date_next", label: "Recommended next service date", type: "date", remember: false, order: 34 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 35 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 36 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 37, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 38 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 6. FIRE EXTINGUISHER SERVICE =====================
  {
    id: "us_fire_extinguisher",
    name: "Fire Extinguisher Service",
    description: "Annual maintenance, recharge and hydro test",
    icon: "FireExtinguisher",
    category: "Fire Protection",
    builtIn: true,
    pdfTitle: "FIRE EXTINGUISHER SERVICE REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Portable fire extinguishers are selected, inspected, maintained and tested per NFPA 10 in the edition adopted by the authority having jurisdiction (AHJ). In workplaces, OSHA (29 CFR 1910.157) also requires an annual maintenance check and a record of the maintenance date. Many states license extinguisher service companies and technicians separately; follow state and AHJ requirements for tagging and record retention.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Service Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Service date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_license_fe", label: "State fire extinguisher license / permit #", type: "text", remember: true, order: 11 },
      { id: "f_cert_fe", label: "Technician certification #", type: "text", remember: true, order: 12 },
      { id: "h_site", label: "Site", type: "heading", remember: false, order: 13, labelStyle: { bold: true } },
      { id: "f_building", label: "Building / occupancy type", type: "text", remember: false, order: 14 },
      { id: "f_total_units", label: "Total extinguishers on site", type: "number", remember: false, reuse: true, order: 15 },
      { id: "h_units", label: "Extinguisher Inventory", type: "heading", remember: false, order: 16, labelStyle: { bold: true } },
      { id: "tb_extinguishers", label: "Extinguishers serviced", type: "table", remember: false, order: 17, tableColumns: [{ id: "c1", label: "Unit #", kind: "text" }, { id: "c2", label: "Location", kind: "text" }, { id: "c3", label: "Type", kind: "choice", reuse: true, options: ["ABC dry chemical", "BC dry chemical", "CO2", "Class K wet chemical", "Water", "Clean agent", "Class D", "Foam"] }, { id: "c4", label: "Size (lbs)", kind: "number", reuse: true }, { id: "c5", label: "Manufacture year", kind: "number", reuse: true }, { id: "c6", label: "Last hydro test (year)", kind: "number", reuse: true }, { id: "c7", label: "Service performed", kind: "choice", options: ["Annual maintenance", "6-year maintenance", "Hydrostatic test", "Recharge", "New unit installed", "Removed from service"] }, { id: "c8", label: "Result", kind: "choice", options: ["Pass", "Fail", "N/A"] }] },
      { id: "f_maintenance_tiles", label: "Maintenance checklist", type: "tiles", remember: false, order: 18, tileOptions: [
        { id: "t_e1", label: "Verified location matches plan" },
        { id: "t_e2", label: "Visible and unobstructed" },
        { id: "t_e3", label: "Mounted securely at proper height" },
        { id: "t_e4", label: "Operating instructions legible and facing out" },
        { id: "t_e5", label: "Pressure gauge in operable range" },
        { id: "t_e6", label: "Safety pin and tamper seal intact" },
        { id: "t_e7", label: "Weighed / hefted for full charge" },
        { id: "t_e8", label: "No physical damage, corrosion or leakage" },
        { id: "t_e9", label: "Hose, nozzle and horn inspected" },
        { id: "t_e10", label: "Signage in place" },
        { id: "t_e11", label: "6-year maintenance due date checked" },
        { id: "t_e12", label: "Hydrostatic test due date checked" },
        { id: "t_e13", label: "Class K unit provided at cooking area" },
        { id: "t_e14", label: "New service tag attached" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 19, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall result", type: "table", remember: false, reuse: false, order: 20, tableColumns: [{ id: "c1", label: "Area / building", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["Pass", "Pass with deficiencies", "Fail"] }], tableRows: ["Overall"] },
      { id: "tb_deficiencies", label: "Deficiencies", type: "table", remember: false, reuse: false, order: 21, tableColumns: [{ id: "c1", label: "Unit # / location", kind: "text" }, { id: "c2", label: "Deficiency", kind: "text" }, { id: "c3", label: "Action", kind: "choice", options: ["Corrected on site", "Replacement quoted", "Owner to correct"] }] },
      { id: "f_units_failed", label: "Units failed / removed from service", type: "number", remember: false, order: 22 },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 23 },
      { id: "f_date_next", label: "Next annual maintenance due", type: "date", remember: false, order: 24 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 25 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 26 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 27, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 28 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 7. SPRINKLER ITM =====================
  {
    id: "us_sprinkler",
    name: "Sprinkler ITM",
    description: "Sprinkler and standpipe inspection and testing",
    icon: "ShowerHead",
    category: "Fire Protection",
    builtIn: true,
    pdfTitle: "FIRE SPRINKLER INSPECTION REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Water-based fire protection systems are inspected, tested and maintained per NFPA 25 in the edition adopted by the AHJ. The property owner is responsible for ITM; deficiencies and impairments must be reported to the owner, and many fire departments require reports to be filed through a designated third-party portal. Contractor licensing and technician certification requirements vary by state.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Inspection Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Inspection date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_license_spr", label: "State fire sprinkler contractor license #", type: "text", remember: true, order: 11 },
      { id: "f_nicet", label: "Technician certification # (e.g., NICET)", type: "text", remember: true, order: 12 },
      { id: "h_system", label: "System Information", type: "heading", remember: false, order: 13, labelStyle: { bold: true } },
      { id: "f_inspection_type", label: "Inspection frequency (quarterly / semiannual / annual / 5-year)", type: "text", remember: false, reuse: false, order: 14 },
      { id: "f_water_supply", label: "Water supply (city main, tank, fire pump)", type: "text", remember: false, order: 15 },
      { id: "tb_systems", label: "Systems / risers", type: "table", remember: false, order: 16, tableColumns: [{ id: "c1", label: "Riser / system ID", kind: "text" }, { id: "c2", label: "System type", kind: "choice", reuse: true, options: ["Wet", "Dry", "Preaction", "Deluge", "Antifreeze", "Standpipe"] }, { id: "c3", label: "Area served", kind: "text" }, { id: "c4", label: "Result", kind: "choice", options: ["Pass", "Fail", "N/A"] }] },
      { id: "h_tests", label: "Test Results", type: "heading", remember: false, order: 17, labelStyle: { bold: true } },
      { id: "f_static_pressure", label: "Main drain static pressure (psi)", type: "number", remember: false, order: 18 },
      { id: "f_residual_pressure", label: "Main drain residual pressure (psi)", type: "number", remember: false, order: 19 },
      { id: "f_prev_static", label: "Previous main drain static pressure (psi)", type: "number", remember: false, reuse: true, reuseFrom: "f_static_pressure", order: 20 },
      { id: "f_air_pressure", label: "Dry / preaction system air pressure (psi)", type: "number", remember: false, order: 21 },
      { id: "f_supply_pressure_dry", label: "Dry valve water supply pressure (psi)", type: "number", remember: false, order: 22 },
      { id: "f_trip_time", label: "Dry valve trip time (sec)", type: "number", remember: false, order: 23 },
      { id: "f_water_delivery", label: "Water delivery time to inspector's test (sec)", type: "number", remember: false, order: 24 },
      { id: "f_alarm_time", label: "Waterflow alarm activation time (sec)", type: "number", remember: false, order: 25 },
      { id: "f_antifreeze", label: "Antifreeze solution freeze point (°F)", type: "number", remember: false, order: 26 },
      { id: "f_itm_tiles", label: "Inspection & test checklist", type: "tiles", remember: false, order: 27, tileOptions: [
        { id: "t_s1", label: "Control valves open, sealed / locked or supervised" },
        { id: "t_s2", label: "Gauges in good condition and readable" },
        { id: "t_s3", label: "Sprinklers free of damage, corrosion, paint or loading" },
        { id: "t_s4", label: "Clearance to storage maintained" },
        { id: "t_s5", label: "Spare sprinklers and wrench in cabinet" },
        { id: "t_s6", label: "Pipe, fittings and hangers in good condition" },
        { id: "t_s7", label: "Waterflow alarm devices tested" },
        { id: "t_s8", label: "Valve supervisory switches tested" },
        { id: "t_s9", label: "Main drain test performed" },
        { id: "t_s10", label: "Inspector's test connection flowed" },
        { id: "t_s11", label: "FDC caps, threads, clappers and signage inspected" },
        { id: "t_s12", label: "Hydraulic nameplate legible" },
        { id: "t_s13", label: "Hose valves / standpipe components inspected" },
        { id: "t_s14", label: "Valve room protected from freezing" },
        { id: "t_s15", label: "Owner / AHJ notified of impairments" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 28, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall result", type: "table", remember: false, reuse: false, order: 29, tableColumns: [{ id: "c1", label: "System", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["Pass", "Deficiencies noted", "Impaired"] }], tableRows: ["Overall"] },
      { id: "tb_deficiencies", label: "Deficiencies & impairments", type: "table", remember: false, reuse: false, order: 30, tableColumns: [{ id: "c1", label: "Location", kind: "text" }, { id: "c2", label: "Description", kind: "text" }, { id: "c3", label: "Classification", kind: "choice", options: ["Impairment", "Critical deficiency", "Noncritical deficiency"] }, { id: "c4", label: "Owner notified", kind: "choice", options: ["Yes", "No"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 31 },
      { id: "f_date_next", label: "Next inspection due", type: "date", remember: false, order: 32 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 33 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 34 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 35, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 36 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 8. FIRE PUMP TEST =====================
  {
    id: "us_fire_pump",
    name: "Fire Pump Test",
    description: "Churn test and annual flow test",
    icon: "Gauge",
    category: "Fire Protection",
    builtIn: true,
    pdfTitle: "FIRE PUMP INSPECTION & TEST REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Fire pumps are inspected, tested and maintained per NFPA 25 (Chapter 8) in the edition adopted by the AHJ. Recent editions call for a no-flow (churn) test weekly for at least 30 minutes on diesel engine-driven pumps and monthly for at least 10 minutes on electric motor-driven pumps, with weekly tests still required for electric pumps in some installations (for example certain high-rise buildings or limited-service controllers). The annual flow test is run at no flow, 100% and 150% of rated capacity and compared with the acceptance test or the pump curve. Deficiencies and impairments are reported to the owner. Contractor licensing varies by state.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Test Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Test date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_license_spr", label: "State fire sprinkler contractor license #", type: "text", remember: true, order: 11 },
      { id: "f_nicet", label: "Technician certification # (e.g., NICET)", type: "text", remember: true, order: 12 },
      { id: "f_test_type", label: "Test type (weekly / monthly churn test, annual flow test)", type: "text", remember: false, reuse: false, order: 13 },
      { id: "h_pump", label: "Pump & Driver", type: "heading", remember: false, order: 14, labelStyle: { bold: true } },
      { id: "f_pump_make", label: "Pump make / model / serial #", type: "text", remember: false, order: 15 },
      { id: "f_driver", label: "Driver (electric motor / diesel engine) make / model", type: "text", remember: false, order: 16 },
      { id: "f_controller", label: "Controller make / model", type: "text", remember: false, order: 17 },
      { id: "f_rated_flow", label: "Rated capacity (gpm)", type: "number", remember: false, reuse: true, order: 18 },
      { id: "f_rated_pressure", label: "Rated net pressure (psi)", type: "number", remember: false, reuse: true, order: 19 },
      { id: "f_rated_speed", label: "Rated speed (rpm)", type: "number", remember: false, reuse: true, order: 20 },
      { id: "h_churn", label: "No-Flow (Churn) Test", type: "heading", remember: false, order: 21, labelStyle: { bold: true } },
      { id: "f_run_time", label: "Run time (min)", type: "number", remember: false, order: 22 },
      { id: "f_start_pressure", label: "Pump start pressure (psi)", type: "number", remember: false, order: 23 },
      { id: "f_suction_psi", label: "Suction pressure (psi)", type: "number", remember: false, order: 24 },
      { id: "f_discharge_psi", label: "Discharge pressure (psi)", type: "number", remember: false, order: 25 },
      { id: "f_pump_rpm", label: "Pump speed (rpm)", type: "number", remember: false, order: 26 },
      { id: "f_volts", label: "Voltage L1 / L2 / L3 (V, electric)", type: "text", remember: false, reuse: false, order: 27 },
      { id: "f_amps", label: "Current L1 / L2 / L3 (A, electric)", type: "text", remember: false, reuse: false, order: 28 },
      { id: "f_oil_pressure", label: "Oil pressure (psi, diesel)", type: "number", remember: false, order: 29 },
      { id: "f_coolant_temp", label: "Coolant temperature (°F, diesel)", type: "number", remember: false, order: 30 },
      { id: "f_battery_volts", label: "Battery 1 / 2 voltage (V, diesel)", type: "text", remember: false, reuse: false, order: 31 },
      { id: "f_fuel_level", label: "Fuel tank level (% full, diesel)", type: "number", remember: false, order: 32 },
      { id: "f_room_temp", label: "Pump room temperature (°F)", type: "number", remember: false, order: 33 },
      { id: "tb_flow", label: "Annual flow test", type: "table", remember: false, order: 34, tableColumns: [{ id: "c1", label: "Flow point", kind: "text" }, { id: "c2", label: "Flow (gpm)", kind: "number" }, { id: "c3", label: "Suction (psi)", kind: "number" }, { id: "c4", label: "Discharge (psi)", kind: "number" }, { id: "c5", label: "Net (psi)", kind: "number" }, { id: "c6", label: "Speed (rpm)", kind: "number" }, { id: "c7", label: "Volts / amps", kind: "text", reuse: false }], tableRows: ["No flow (churn)", "100% rated", "150% rated"] },
      { id: "f_flow_method", label: "Flow measured with (hose streams, flowmeter, test header)", type: "text", remember: false, order: 35 },
      { id: "f_pump_tiles", label: "Inspection & test checklist", type: "tiles", remember: false, order: 36, tileOptions: [
        { id: "t_fp1", label: "Pump room temperature at least 40°F (70°F for diesel without engine heater)" },
        { id: "t_fp2", label: "Suction, discharge and bypass valves open" },
        { id: "t_fp3", label: "No piping or casing leaks" },
        { id: "t_fp4", label: "Controller in automatic, no alarm or trouble signals" },
        { id: "t_fp5", label: "Power available, transfer switch in normal position (electric)" },
        { id: "t_fp6", label: "Pump started automatically on pressure drop" },
        { id: "t_fp7", label: "Packing glands with slight discharge, not overheating" },
        { id: "t_fp8", label: "Casing relief / circulation relief valve discharging during churn" },
        { id: "t_fp9", label: "Fuel tank at least two-thirds full (diesel)" },
        { id: "t_fp10", label: "Batteries and charger in normal condition (diesel)" },
        { id: "t_fp11", label: "Cooling water flow verified (diesel)" },
        { id: "t_fp12", label: "Alarm and supervisory signals received" },
        { id: "t_fp13", label: "Pump stopped and controller returned to automatic" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 37, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall result", type: "table", remember: false, reuse: false, order: 38, tableColumns: [{ id: "c1", label: "System", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["Pass", "Deficiencies noted", "Impaired"] }], tableRows: ["Overall"] },
      { id: "tb_deficiencies", label: "Deficiencies & impairments", type: "table", remember: false, reuse: false, order: 39, tableColumns: [{ id: "c1", label: "Location / component", kind: "text" }, { id: "c2", label: "Description", kind: "text" }, { id: "c3", label: "Classification", kind: "choice", options: ["Impairment", "Critical deficiency", "Noncritical deficiency"] }, { id: "c4", label: "Owner notified", kind: "choice", options: ["Yes", "No"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 40 },
      { id: "f_date_next", label: "Next test due", type: "date", remember: false, order: 41 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 42 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 43 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 44, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 45 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 9. FIRE ALARM INSPECTION =====================
  {
    id: "us_fire_alarm",
    name: "Fire Alarm Inspection",
    description: "Panel, devices and batteries tested",
    icon: "BellRing",
    category: "Fire Protection",
    builtIn: true,
    pdfTitle: "FIRE ALARM INSPECTION & TEST REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Fire alarm systems are inspected and tested per NFPA 72 (Chapter 14) in the edition adopted by the AHJ. The owner keeps inspection and test records and makes them available to the AHJ; impairments require notification of the owner, the supervising station and the AHJ. Some states set stricter licensing and record-retention rules, and many AHJs require reports to be submitted through a third-party portal.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Inspection Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Inspection date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_license_fa", label: "State fire alarm license #", type: "text", remember: true, order: 11 },
      { id: "f_nicet", label: "Technician certification # (e.g., NICET)", type: "text", remember: true, order: 12 },
      { id: "h_system", label: "System Information", type: "heading", remember: false, order: 13, labelStyle: { bold: true } },
      { id: "f_inspection_type", label: "Inspection type (annual / semiannual / quarterly / other)", type: "text", remember: false, reuse: false, order: 14 },
      { id: "f_panel", label: "Fire alarm control panel (FACP) make / model", type: "text", remember: false, order: 15 },
      { id: "f_panel_location", label: "Panel location", type: "text", remember: false, order: 16 },
      { id: "f_monitoring", label: "Supervising / monitoring station", type: "text", remember: false, order: 17 },
      { id: "f_account", label: "Monitoring account #", type: "text", remember: false, order: 18 },
      { id: "f_offline_time", label: "System placed on test at", type: "text", remember: false, reuse: false, order: 19 },
      { id: "f_online_time", label: "System restored at", type: "text", remember: false, reuse: false, order: 20 },
      { id: "h_power", label: "Power Supplies", type: "heading", remember: false, order: 21, labelStyle: { bold: true } },
      { id: "f_battery_ah", label: "Battery rating (Ah)", type: "number", remember: false, reuse: true, order: 22 },
      { id: "f_battery_voltage", label: "Battery voltage, no load (V DC)", type: "number", remember: false, order: 23 },
      { id: "f_battery_load", label: "Battery voltage under load (V DC)", type: "number", remember: false, order: 24 },
      { id: "f_battery_date", label: "Battery date code", type: "text", remember: false, order: 25 },
      { id: "tb_devices", label: "Devices tested", type: "table", remember: false, order: 26, tableColumns: [{ id: "c1", label: "Device type", kind: "choice", reuse: true, options: ["Smoke detector", "Heat detector", "Duct detector", "Pull station", "Horn / strobe", "Waterflow switch", "Tamper switch", "Other"] }, { id: "c2", label: "Address / zone", kind: "text" }, { id: "c3", label: "Location", kind: "text" }, { id: "c4", label: "Result", kind: "choice", options: ["Pass", "Fail", "N/A"] }] },
      { id: "f_devices_tested", label: "Total devices tested", type: "number", remember: false, order: 27 },
      { id: "f_devices_failed", label: "Devices failed", type: "number", remember: false, order: 28 },
      { id: "f_test_tiles", label: "Inspection & test checklist", type: "tiles", remember: false, order: 29, tileOptions: [
        { id: "t_a1", label: "Monitoring station and occupants notified before test" },
        { id: "t_a2", label: "Panel in normal condition on arrival" },
        { id: "t_a3", label: "Lamp / LED / display test" },
        { id: "t_a4", label: "Primary (AC) power verified" },
        { id: "t_a5", label: "Batteries inspected and load tested" },
        { id: "t_a6", label: "Trouble signals verified" },
        { id: "t_a7", label: "Supervisory signals verified" },
        { id: "t_a8", label: "Alarm signals received by monitoring station" },
        { id: "t_a9", label: "Notification appliances operated" },
        { id: "t_a10", label: "Smoke detector sensitivity within listed range" },
        { id: "t_a11", label: "Elevator recall tested (if applicable)" },
        { id: "t_a12", label: "HVAC shutdown / door release tested" },
        { id: "t_a13", label: "System restored to normal" },
        { id: "t_a14", label: "Monitoring station notified test complete" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 30, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall result", type: "table", remember: false, reuse: false, order: 31, tableColumns: [{ id: "c1", label: "System", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["Pass", "Fail", "Impaired"] }], tableRows: ["Overall"] },
      { id: "tb_deficiencies", label: "Deficiencies", type: "table", remember: false, reuse: false, order: 32, tableColumns: [{ id: "c1", label: "Device / location", kind: "text" }, { id: "c2", label: "Description", kind: "text" }, { id: "c3", label: "Classification", kind: "choice", options: ["Impairment", "Deficiency", "Observation"] }, { id: "c4", label: "Corrected on site", kind: "choice", options: ["Yes", "No"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 33 },
      { id: "f_date_next", label: "Next inspection due", type: "date", remember: false, order: 34 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 35 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 36 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 37, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 38 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 10. EMERGENCY LIGHTING & EXIT SIGNS =====================
  {
    id: "us_emergency_lighting",
    name: "Emergency Lighting & Exit Signs",
    description: "Monthly 30-second and annual 90-minute tests",
    icon: "Lightbulb",
    category: "Life Safety",
    builtIn: true,
    pdfTitle: "EMERGENCY LIGHTING & EXIT SIGN TEST REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Emergency lighting and battery-powered exit signs are tested per NFPA 101 (Life Safety Code, 7.9.3) and the fire code adopted by the AHJ: a functional test of at least 30 seconds every month (at intervals of 3 to 5 weeks) and a test of at least 90 minutes every year, with written records kept for the AHJ. Self-testing and computer-based self-testing units have their own options under the code. The edition and any local amendments are set by the AHJ.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Test Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Test date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_license_el", label: "License / certification # (if required)", type: "text", remember: true, order: 11 },
      { id: "f_building", label: "Building / area", type: "text", remember: false, order: 12 },
      { id: "f_test_type", label: "Test type (monthly 30-second / annual 90-minute)", type: "text", remember: false, reuse: false, order: 13 },
      { id: "h_units", label: "Units Tested", type: "heading", remember: false, order: 14, labelStyle: { bold: true } },
      { id: "tb_units", label: "Emergency lights and exit signs", type: "table", remember: false, order: 15, tableColumns: [{ id: "c1", label: "Unit # / location", kind: "text" }, { id: "c2", label: "Type", kind: "choice", reuse: true, options: ["Emergency light", "Exit sign", "Combination unit", "Remote head"] }, { id: "c3", label: "Battery date", kind: "text" }, { id: "c4", label: "Minutes tested", kind: "number" }, { id: "c5", label: "Result", kind: "choice", options: ["Pass", "Fail", "N/A"] }, { id: "c6", label: "Action", kind: "choice", options: ["None", "Battery replaced", "Lamp replaced", "Unit replaced", "Repair needed"] }] },
      { id: "f_units_tested", label: "Total units tested", type: "number", remember: false, order: 16 },
      { id: "f_units_failed", label: "Units failed", type: "number", remember: false, order: 17 },
      { id: "f_test_tiles", label: "Test checklist", type: "tiles", remember: false, order: 18, tileOptions: [
        { id: "t_el1", label: "Normal power cut for the test (test switch, breaker or panel)" },
        { id: "t_el2", label: "All lamps lit for the full test duration" },
        { id: "t_el3", label: "Exit signs lit and legible" },
        { id: "t_el4", label: "Directional arrows point the right way" },
        { id: "t_el5", label: "Charging indicator on after the test" },
        { id: "t_el6", label: "Battery terminals clean, no corrosion or leakage" },
        { id: "t_el7", label: "Lamp heads aimed along the exit path" },
        { id: "t_el8", label: "Units undamaged and securely mounted" },
        { id: "t_el9", label: "Self-diagnostic indicator normal (self-testing units)" },
        { id: "t_el10", label: "Normal power restored after the test" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 19, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall result", type: "table", remember: false, reuse: false, order: 20, tableColumns: [{ id: "c1", label: "Building / area", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["Pass", "Deficiencies noted", "Fail"] }], tableRows: ["Overall"] },
      { id: "tb_deficiencies", label: "Deficiencies", type: "table", remember: false, reuse: false, order: 21, tableColumns: [{ id: "c1", label: "Unit # / location", kind: "text" }, { id: "c2", label: "Deficiency", kind: "text" }, { id: "c3", label: "Corrected on site", kind: "choice", options: ["Yes", "No"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 22 },
      { id: "f_date_next", label: "Next test due", type: "date", remember: false, order: 23 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 24 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 25 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 26, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 27 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 11. KITCHEN SUPPRESSION =====================
  {
    id: "us_kitchen_suppression",
    name: "Kitchen Suppression",
    description: "Semiannual service of UL 300 wet chemical systems",
    icon: "ChefHat",
    category: "Fire Protection",
    builtIn: true,
    pdfTitle: "KITCHEN FIRE SUPPRESSION SERVICE REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Pre-engineered wet chemical systems protecting commercial cooking equipment are installed and serviced per NFPA 17A and NFPA 96 as adopted by the AHJ and must be listed to UL 300. The system is serviced by trained, certified personnel at least every six months and after any discharge, following the manufacturer's installation and maintenance manual; fusible-alloy links are replaced at least semiannually. Technician licensing varies by state.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Service Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Service date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_license_ks", label: "State fire suppression license #", type: "text", remember: true, order: 11 },
      { id: "f_mfr_cert", label: "Manufacturer certification #", type: "text", remember: true, order: 12 },
      { id: "h_system", label: "System Information", type: "heading", remember: false, order: 13, labelStyle: { bold: true } },
      { id: "f_system_make", label: "System manufacturer / model", type: "text", remember: false, order: 14 },
      { id: "tb_system", label: "Hoods / cylinders", type: "table", remember: false, order: 15, tableColumns: [{ id: "c1", label: "Hood ID", kind: "text" }, { id: "c2", label: "UL 300 listed", kind: "choice", reuse: true, options: ["Yes", "No", "Unknown"] }, { id: "c3", label: "Agent cylinder size (gal)", kind: "number", reuse: true }, { id: "c4", label: "Last hydrostatic test (year)", kind: "number", reuse: true }, { id: "c5", label: "Result", kind: "choice", options: ["Pass", "Fail", "N/A"] }] },
      { id: "f_links_replaced", label: "Fusible links replaced (qty)", type: "number", remember: false, order: 16 },
      { id: "f_link_rating", label: "Fusible link temperature rating (°F)", type: "number", remember: false, reuse: true, order: 17 },
      { id: "f_link_date", label: "Date code on new links", type: "text", remember: false, reuse: false, order: 18 },
      { id: "f_cartridge_weight", label: "Expellant cartridge weight (oz)", type: "number", remember: false, order: 19 },
      { id: "f_service_tiles", label: "Semiannual service checklist", type: "tiles", remember: false, order: 20, tileOptions: [
        { id: "t_q1", label: "Appliances match nozzle coverage / hood layout" },
        { id: "t_q2", label: "Nozzles aimed correctly, blow-off caps in place" },
        { id: "t_q3", label: "Detection line and fusible links replaced" },
        { id: "t_q4", label: "Agent cylinder pressure / weight verified" },
        { id: "t_q5", label: "Expellant cartridge weighed or replaced" },
        { id: "t_q6", label: "Piping and brackets secure" },
        { id: "t_q7", label: "Manual pull station tested and accessible" },
        { id: "t_q8", label: "Mechanical / electric gas shutoff valve operated" },
        { id: "t_q9", label: "Electrical shunt trip tested" },
        { id: "t_q10", label: "Fire alarm interconnection tested" },
        { id: "t_q11", label: "Exhaust fan / makeup air interlock verified" },
        { id: "t_q12", label: "Class K extinguisher present and tagged" },
        { id: "t_q13", label: "System re-armed and sealed" },
        { id: "t_q14", label: "Service tag attached" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 21, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall result", type: "table", remember: false, reuse: false, order: 22, tableColumns: [{ id: "c1", label: "System", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["Pass", "Pass with deficiencies", "Fail / out of service"] }], tableRows: ["Overall"] },
      { id: "tb_deficiencies", label: "Deficiencies", type: "table", remember: false, reuse: false, order: 23, tableColumns: [{ id: "c1", label: "Location / component", kind: "text" }, { id: "c2", label: "Description", kind: "text" }, { id: "c3", label: "Corrected on site", kind: "choice", options: ["Yes", "No"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 24 },
      { id: "f_date_next", label: "Next semiannual service due", type: "date", remember: false, order: 25 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 26 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 27 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 28, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 29 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 12. KITCHEN HOOD CLEANING =====================
  {
    id: "us_hood_cleaning",
    name: "Kitchen Hood Cleaning",
    description: "Hood, duct and fan cleaning with areas not cleaned",
    icon: "Fan",
    category: "Kitchen Exhaust",
    builtIn: true,
    pdfTitle: "KITCHEN EXHAUST CLEANING REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Commercial kitchen exhaust systems are inspected and cleaned per NFPA 96 in the edition adopted by the AHJ. Inspection frequency depends on cooking volume and fuel type, from monthly for solid fuel to annually for low-volume cooking. After each inspection or cleaning, NFPA 96 requires a dated record on site (a certificate and a label in the kitchen area) showing the servicing company and the person who did the work, and noting any areas not cleaned; check the edition your AHJ enforces for the exact contents. Some states and cities require hood cleaner certification or licensing.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Service Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Service date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 10 },
      { id: "f_cert_hood", label: "Technician certification / license # (if required)", type: "text", remember: true, order: 11 },
      { id: "h_system", label: "Exhaust System", type: "heading", remember: false, order: 12, labelStyle: { bold: true } },
      { id: "f_cooking_volume", label: "Cooking type / volume (solid fuel, high, moderate, low)", type: "text", remember: false, order: 13 },
      { id: "f_hoods", label: "Number of hoods", type: "number", remember: false, reuse: true, order: 14 },
      { id: "f_fans", label: "Number of exhaust fans", type: "number", remember: false, reuse: true, order: 15 },
      { id: "f_duct_length", label: "Approx. duct length cleaned (ft)", type: "number", remember: false, order: 16 },
      { id: "f_frequency", label: "Recommended cleaning frequency", type: "text", remember: false, reuse: true, order: 17 },
      { id: "tb_components", label: "System components", type: "table", remember: false, order: 18, tableColumns: [{ id: "c1", label: "Component (hood, plenum, filters, duct, fan)", kind: "text" }, { id: "c2", label: "Grease buildup before", kind: "choice", options: ["Light", "Moderate", "Heavy"] }, { id: "c3", label: "Cleaning result", kind: "choice", options: ["Cleaned", "Partially cleaned", "Not cleaned"] }] },
      { id: "f_not_cleaned", label: "Areas not cleaned and reason (e.g., no access)", type: "textarea", remember: false, reuse: false, order: 19 },
      { id: "f_cleaning_tiles", label: "Cleaning checklist", type: "tiles", remember: false, order: 20, tileOptions: [
        { id: "t_k1", label: "Before photos taken" },
        { id: "t_k2", label: "Cooking equipment off and cooled" },
        { id: "t_k3", label: "Appliances and floor covered / protected" },
        { id: "t_k4", label: "Suppression nozzles and links protected" },
        { id: "t_k16", label: "Suppression system service tag current" },
        { id: "t_k5", label: "Filters removed and cleaned" },
        { id: "t_k6", label: "Hood canopy and plenum cleaned" },
        { id: "t_k7", label: "Horizontal ductwork cleaned" },
        { id: "t_k8", label: "Vertical ductwork cleaned" },
        { id: "t_k9", label: "Exhaust fan and housing cleaned" },
        { id: "t_k10", label: "Fan hinge kit / access verified" },
        { id: "t_k11", label: "Rooftop grease containment checked" },
        { id: "t_k12", label: "Access panels reinstalled and sealed" },
        { id: "t_k13", label: "Service tags placed at access panels" },
        { id: "t_k14", label: "Dated label attached to hood" },
        { id: "t_k15", label: "After photos taken and kitchen cleaned up" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 21, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall result", type: "table", remember: false, reuse: false, order: 22, tableColumns: [{ id: "c1", label: "Hood / system", kind: "text" }, { id: "c2", label: "Result", kind: "choice", options: ["Cleaned - all accessible areas", "Cleaned - see areas not cleaned", "Not cleaned"] }], tableRows: ["Overall"] },
      { id: "tb_deficiencies", label: "Deficiencies", type: "table", remember: false, reuse: false, order: 23, tableColumns: [{ id: "c1", label: "Location", kind: "text" }, { id: "c2", label: "Deficiency (e.g., missing access panel, no hinge kit)", kind: "text" }, { id: "c3", label: "Priority", kind: "choice", options: ["Fire hazard", "Repair needed", "Recommended"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 24 },
      { id: "f_date_next", label: "Next scheduled cleaning", type: "date", remember: false, order: 25 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 26 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 27 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 28, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 29 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 13. PEST CONTROL SERVICE =====================
  {
    id: "us_pest_control",
    name: "Pest Control Service",
    description: "Service visit with pesticide application record",
    icon: "Bug",
    category: "Pest Control",
    builtIn: true,
    pdfTitle: "PEST CONTROL SERVICE REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Pesticide use is regulated under FIFRA and by each state's pesticide regulatory agency. Federal rules (40 CFR 171.303) require state certification plans to make certified commercial applicators keep records of restricted use pesticide applications for at least 2 years, including the customer's name and address, location, size of the area treated, site treated, date and time, product name, EPA registration number, total amount applied, the certified applicator's name and certification number, and the name of any noncertified applicator who applied under their direct supervision. Many states require similar records for every commercial application, and some require written notice before the application (for example California, B&P Code 8538); this report does not replace that notice. Required fields, retention periods and notification rules vary by state.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Application Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Application date", type: "date", remember: false, order: 9 },
      { id: "f_time", label: "Application completed at", type: "text", remember: false, reuse: false, order: 10 },
      { id: "f_business_license", label: "State pest control business license #", type: "text", remember: true, order: 11 },
      { id: "f_tech_name", label: "Applicator name", type: "text", remember: true, order: 12 },
      { id: "f_applicator_cert", label: "Applicator certification / license #", type: "text", remember: true, order: 13 },
      { id: "f_pest_category", label: "License category (e.g., structural, lawn & ornamental)", type: "text", remember: true, order: 14 },
      { id: "f_supervising_applicator", label: "Supervising certified applicator and certification # (if the applicator is not certified)", type: "text", remember: true, order: 15 },
      { id: "h_site", label: "Site & Conditions", type: "heading", remember: false, order: 16, labelStyle: { bold: true } },
      { id: "f_target_area", label: "Treated site (structure, rooms, perimeter, lawn)", type: "text", remember: false, order: 17 },
      { id: "f_area_size", label: "Area treated (sq ft)", type: "number", remember: false, reuse: true, order: 18 },
      { id: "f_temperature", label: "Outdoor temperature (°F)", type: "number", remember: false, order: 19 },
      { id: "f_wind", label: "Wind speed (mph)", type: "number", remember: false, order: 20 },
      { id: "f_wind_dir", label: "Wind direction", type: "text", remember: false, reuse: false, order: 21 },
      { id: "tb_products", label: "Products applied", type: "table", remember: false, order: 22, tableColumns: [{ id: "c1", label: "Product (brand) name", kind: "text" }, { id: "c2", label: "EPA Reg. No.", kind: "text" }, { id: "c3", label: "Active ingredient", kind: "text" }, { id: "c4", label: "Dilution (%)", kind: "number" }, { id: "c5", label: "Total amount applied (e.g., 2 gal, 8 oz, 1 lb)", kind: "text", reuse: false }, { id: "c6", label: "Target pest", kind: "text", reuse: false }, { id: "c7", label: "Method", kind: "choice", options: ["Spray", "Bait", "Dust", "Granular", "Fog", "Other"] }, { id: "c8", label: "Restricted use pesticide", kind: "choice", reuse: true, options: ["Yes", "No"] }] },
      { id: "f_service_tiles", label: "Service checklist", type: "tiles", remember: false, order: 23, tileOptions: [
        { id: "t_p1", label: "Inspection performed" },
        { id: "t_p2", label: "Pest activity identified and documented" },
        { id: "t_p3", label: "Label directions followed" },
        { id: "t_p4", label: "PPE worn per label" },
        { id: "t_p5", label: "Interior treatment" },
        { id: "t_p6", label: "Exterior perimeter treatment" },
        { id: "t_p7", label: "Bait stations inspected / serviced" },
        { id: "t_p8", label: "Monitoring traps / glue boards placed or checked" },
        { id: "t_p9", label: "Entry points sealed / exclusion recommended" },
        { id: "t_p10", label: "Sanitation recommendations given" },
        { id: "t_p11", label: "Re-entry interval explained to customer" },
        { id: "t_p12", label: "Children / pets precautions explained" },
        { id: "t_p13", label: "Posting / notification provided where required" },
        { id: "t_p14", label: "Equipment checked for leaks / calibrated" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 24, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Pest activity", type: "table", remember: false, order: 25, tableColumns: [{ id: "c1", label: "Area", kind: "text" }, { id: "c2", label: "Activity level", kind: "choice", options: ["None", "Low", "Moderate", "High"] }], tableRows: ["Interior", "Exterior"] },
      { id: "f_reentry", label: "Re-entry interval / precautions given", type: "text", remember: false, reuse: false, order: 26 },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 27 },
      { id: "f_date_next", label: "Next service date", type: "date", remember: false, order: 28 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 29 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 30 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 31, content: ACK_SERVICE },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 32 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 14. MOVE-IN / MOVE-OUT =====================
  {
    id: "us_rental_inspection",
    name: "Move-In / Move-Out",
    description: "Room-by-room condition with tenant sign-off",
    icon: "KeyRound",
    category: "Property",
    builtIn: true,
    pdfTitle: "RENTAL PROPERTY CONDITION REPORT",
    fields: [
      { id: "h_compliance", label: "Compliance Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true, align: "center", color: "#2563eb" } },
      { id: "i_compliance", label: "Compliance note", type: "info", remember: false, order: 2, content: "Move-in and move-out condition reports support security deposit accounting under state landlord-tenant law. Several states (including Georgia, Kentucky, Washington and Wisconsin) require a written move-in condition checklist when a security deposit is collected; Washington requires it to be signed and dated by the landlord and the tenant, with a copy for the tenant. In Maryland, the tenant may ask for a move-in inspection within 15 days of moving in. California (AB 2801) requires photos before and after repairs or cleaning to support deposit deductions, and photos at move-in for tenancies starting on or after 07/01/2025. Deposit return deadlines and itemization rules vary by state and city; follow the applicable statute.", labelStyle: { bold: true, color: "#2563eb" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Owner / Client", type: "heading", remember: false, order: 3, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 4 },
      { id: "f_address", label: "Property address", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Inspection Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Inspection date", type: "date", remember: false, order: 9 },
      { id: "f_tech_name", label: "Inspector name", type: "text", remember: true, order: 10 },
      { id: "f_license_re", label: "State real estate / property management license # (if required)", type: "text", remember: true, order: 11 },
      { id: "h_tenancy", label: "Unit & Tenancy", type: "heading", remember: false, order: 12, labelStyle: { bold: true } },
      { id: "f_unit", label: "Unit #", type: "text", remember: false, order: 13 },
      { id: "f_tenant_names", label: "Tenant name(s)", type: "text", remember: false, order: 14 },
      { id: "f_inspection_kind", label: "Inspection type (move-in / move-out / periodic)", type: "text", remember: false, reuse: false, order: 15 },
      { id: "f_lease_start", label: "Lease start date", type: "date", remember: false, order: 16 },
      { id: "f_lease_end", label: "Lease end / move-out date", type: "date", remember: false, order: 17 },
      { id: "f_keys", label: "Keys / remotes issued or returned (qty)", type: "number", remember: false, order: 18 },
      { id: "f_electric_meter", label: "Electric meter reading (kWh)", type: "number", remember: false, order: 19 },
      { id: "f_gas_meter", label: "Gas meter reading (CCF)", type: "number", remember: false, order: 20 },
      { id: "f_water_meter", label: "Water meter reading (gal)", type: "number", remember: false, order: 21 },
      { id: "tb_rooms", label: "Room-by-room condition", type: "table", remember: false, order: 22, tableColumns: [{ id: "c1", label: "Room / area", kind: "text" }, { id: "c2", label: "Item (walls, floor, windows, fixtures)", kind: "text" }, { id: "c3", label: "Condition", kind: "choice", options: ["New", "Good", "Fair", "Poor", "Damaged", "N/A"] }, { id: "c4", label: "Notes", kind: "text", reuse: false }] },
      { id: "f_systems_tiles", label: "Systems & safety checklist", type: "tiles", remember: false, order: 23, tileOptions: [
        { id: "t_m1", label: "Smoke alarms tested" },
        { id: "t_m2", label: "CO alarms tested" },
        { id: "t_m3", label: "Kitchen appliances operate" },
        { id: "t_m4", label: "Plumbing fixtures - no leaks" },
        { id: "t_m5", label: "Water heater operates" },
        { id: "t_m6", label: "Heating and AC operate" },
        { id: "t_m7", label: "Outlets and GFCIs tested" },
        { id: "t_m8", label: "Light fixtures operate" },
        { id: "t_m9", label: "Doors and locks operate" },
        { id: "t_m10", label: "Windows, locks and screens checked" },
        { id: "t_m11", label: "Walls and ceilings inspected" },
        { id: "t_m12", label: "Floors and carpet inspected" },
        { id: "t_m13", label: "No evidence of pests or mold" },
        { id: "t_m14", label: "Exterior, yard and parking inspected" },
        { id: "t_m15", label: "Date-stamped photos taken of each room" },
        { id: "t_m16", label: "Copy of the signed report given to the tenant" },
      ]},
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 24, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Overall condition", type: "table", remember: false, reuse: false, order: 25, tableColumns: [{ id: "c1", label: "Area", kind: "text" }, { id: "c2", label: "Condition", kind: "choice", options: ["Move-in ready", "Normal wear and tear", "Damage beyond normal wear"] }], tableRows: ["Overall"] },
      { id: "tb_damage", label: "Damage / repairs needed", type: "table", remember: false, reuse: false, order: 26, tableColumns: [{ id: "c1", label: "Location", kind: "text" }, { id: "c2", label: "Description", kind: "text" }, { id: "c3", label: "Responsibility", kind: "choice", options: ["Tenant", "Owner", "To be determined"] }, { id: "c4", label: "Estimated cost ($)", kind: "number" }] },
      { id: "f_recommend", label: "Notes / recommendations", type: "textarea", remember: false, reuse: false, order: 27 },
      { id: "f_date_next", label: "Next periodic inspection", type: "date", remember: false, order: 28 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 29 },
      { id: "f_tenant_comments", label: "Tenant comments / disagreements", type: "textarea", remember: false, reuse: false, order: 30 },
      { id: "i_ack", label: "Agreement on condition", type: "info", remember: false, order: 31, content: ACK_RENTAL },
      { id: "sig_tech", label: "Landlord / agent signature", type: "signature", remember: false, order: 32 },
      { id: "sig_client", label: "Tenant signature", type: "signature", remember: false, order: 33 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 15. GENERAL WORK ORDER =====================
  {
    id: "us_work_order",
    name: "General Work Order",
    description: "Problem, work done, parts and customer sign-off",
    icon: "ClipboardList",
    category: "General",
    builtIn: true,
    pdfTitle: "SERVICE WORK ORDER",
    fields: [
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 1, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 2 },
      { id: "f_address", label: "Service address", type: "text", remember: false, order: 3 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 4 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 5 },
      { id: "h_details", label: "Service Details", type: "heading", remember: false, order: 6, labelStyle: { bold: true } },
      { id: "f_date", label: "Service date", type: "date", remember: false, order: 7 },
      { id: "f_tech_name", label: "Technician name", type: "text", remember: true, order: 8 },
      { id: "f_license", label: "State/local contractor license #", type: "text", remember: true, order: 9 },
      { id: "f_contract", label: "Work order #", type: "text", remember: false, order: 10 },
      { id: "h_job", label: "Job Details", type: "heading", remember: false, order: 11, labelStyle: { bold: true } },
      { id: "f_complaint", label: "Customer request / reported problem", type: "textarea", remember: false, reuse: false, order: 12 },
      { id: "f_equipment", label: "Equipment / area serviced (make, model, serial #)", type: "text", remember: false, order: 13 },
      { id: "f_time_in", label: "Time in", type: "text", remember: false, reuse: false, order: 14 },
      { id: "f_time_out", label: "Time out", type: "text", remember: false, reuse: false, order: 15 },
      { id: "f_labor_hours", label: "Labor (hours)", type: "number", remember: false, order: 16 },
      { id: "f_work_tiles", label: "Work performed", type: "tiles", remember: false, order: 17, tileOptions: [
        { id: "t_w1", label: "Diagnosed problem" },
        { id: "t_w2", label: "Performed repair" },
        { id: "t_w3", label: "Replaced part(s)" },
        { id: "t_w4", label: "Performed preventive maintenance" },
        { id: "t_w5", label: "Tested operation after repair" },
        { id: "t_w6", label: "Lockout/tagout applied and removed" },
        { id: "t_w7", label: "Safety check performed" },
        { id: "t_w8", label: "Removed old parts and debris" },
        { id: "t_w9", label: "Cleaned work area" },
        { id: "t_w10", label: "Explained work to customer" },
        { id: "t_w11", label: "Provided estimate for additional work" },
        { id: "t_w12", label: "Customer walkthrough completed" },
      ]},
      { id: "tb_materials", label: "Parts & materials", type: "table", remember: false, reuse: false, order: 18, tableColumns: [{ id: "c1", label: "Description", kind: "text" }, { id: "c2", label: "Qty", kind: "number" }, { id: "c3", label: "Unit (ea, ft, gal, lbs)", kind: "text" }, { id: "c4", label: "Unit price ($)", kind: "number" }] },
      { id: "f_work_description", label: "Description of work performed", type: "textarea", remember: false, reuse: false, order: 19 },
      { id: "h_summary", label: "Results & Recommendations", type: "heading", remember: false, order: 20, labelStyle: { bold: true, align: "center", color: "#ea580c" } },
      { id: "tb_result", label: "Job status", type: "table", remember: false, reuse: false, order: 21, tableColumns: [{ id: "c1", label: "Item / equipment", kind: "text" }, { id: "c2", label: "Status", kind: "choice", options: ["Completed", "Follow-up required", "Parts on order", "Not completed"] }] },
      { id: "f_recommend", label: "Recommendations", type: "textarea", remember: false, reuse: false, order: 22 },
      { id: "f_date_next", label: "Recommended next service date", type: "date", remember: false, order: 23 },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 24 },
      { id: "sig_tech", label: "Technician signature", type: "signature", remember: false, order: 25 },
      { id: "i_ack", label: "Customer acknowledgment", type: "info", remember: false, order: 26, content: ACK_WORK_ORDER },
      { id: "sig_client", label: "Customer signature", type: "signature", remember: false, order: 27 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },

  // ===================== 16. ESTIMATE =====================
  {
    id: "us_estimate",
    name: "Estimate",
    description: "Scope, line items and optional customer approval",
    icon: "Receipt",
    category: "General",
    builtIn: true,
    pdfTitle: "ESTIMATE",
    fields: [
      { id: "i_estimate_guide", label: "Before you ask for a signature (not printed)", type: "info", remember: false, order: 1, pdf: false, content: ESTIMATE_GUIDE, labelStyle: { bold: true, color: "#ea580c" }, contentStyle: { color: "#6b7280", italic: true } },
      { id: "h_customer", label: "Customer Information", type: "heading", remember: false, order: 2, labelStyle: { bold: true } },
      { id: "f_client", label: "Customer name", type: "text", remember: false, order: 3 },
      { id: "f_address", label: "Job site address", type: "text", remember: false, order: 4 },
      { id: "f_billing_address", label: "Billing address (if different)", type: "text", remember: false, order: 5 },
      { id: "f_phone", label: "Phone", type: "text", remember: false, order: 6 },
      { id: "f_email", label: "Email", type: "text", remember: false, order: 7 },
      { id: "h_details", label: "Estimate Details", type: "heading", remember: false, order: 8, labelStyle: { bold: true } },
      { id: "f_date", label: "Estimate date", type: "date", remember: false, order: 9 },
      { id: "f_valid_until", label: "Valid until", type: "date", remember: false, reuse: false, order: 10 },
      { id: "f_tech_name", label: "Prepared by", type: "text", remember: true, order: 11 },
      { id: "f_license", label: "State/local contractor license #", type: "text", remember: true, order: 12 },
      { id: "h_scope", label: "Scope of Work", type: "heading", remember: false, order: 13, labelStyle: { bold: true } },
      { id: "f_scope", label: "Description of work", type: "textarea", remember: false, reuse: false, order: 14 },
      { id: "f_equipment", label: "Equipment / area (make, model, serial #)", type: "text", remember: false, order: 15 },
      { id: "tb_items", label: "Line items", type: "table", remember: false, reuse: false, order: 16, tableColumns: [{ id: "c1", label: "Description", kind: "text" }, { id: "c2", label: "Qty", kind: "number" }, { id: "c3", label: "Unit (ea, ft, hr)", kind: "text" }, { id: "c4", label: "Unit price ($)", kind: "number" }, { id: "c5", label: "Amount ($)", kind: "number" }] },
      { id: "f_subtotal", label: "Subtotal ($)", type: "number", remember: false, order: 17 },
      { id: "f_tax", label: "Sales tax ($), if applicable", type: "number", remember: false, order: 18 },
      { id: "f_total", label: "Estimated total ($)", type: "number", remember: false, order: 19 },
      { id: "f_payment_terms", label: "Payment terms (deposit, balance due)", type: "text", remember: true, order: 20 },
      { id: "f_exclusions", label: "Not included / exclusions", type: "textarea", remember: false, reuse: false, order: 21 },
      { id: "f_warranty", label: "Warranty (if offered)", type: "textarea", remember: true, order: 22 },
      { id: "f_notices", label: "Other terms and notices required in your state", type: "textarea", remember: true, order: 23 },
      { id: "i_terms", label: "Estimate terms", type: "info", remember: false, order: 24, content: ESTIMATE_TERMS },
      { id: "f_photos", label: "Photos", type: "photos", remember: false, order: 25 },
      { id: "sig_tech", label: "Contractor signature", type: "signature", remember: false, order: 26 },
      { id: "i_approval", label: "Customer approval", type: "info", remember: false, order: 27, content: ACK_ESTIMATE },
      { id: "sig_client", label: "Customer approval signature (optional)", type: "signature", remember: false, order: 28 },
    ],
    tiles: [], hasPhotos: false, signatureFields: [],
  },
];

// ============================================================
// USER TEMPLATES — CRUD (Supabase + localStorage cache)
// ============================================================

import {
  getCloudUserTemplates,
  saveCloudUserTemplate,
  deleteCloudUserTemplate,
  migrateLocalTemplatesToCloud,
} from "./supabase-storage";

const USER_TEMPLATES_KEY = "docswift_user_templates";
const TEMPLATES_MIGRATED_KEY = "docswift_templates_migrated";

function getStoredTemplates(): ReportTemplate[] {
  try {
    const raw = localStorage.getItem(USER_TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredTemplates(templates: ReportTemplate[]) {
  localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify(templates));
}

/** Synchronous — returns cached localStorage templates (for instant UI) */
export function getUserTemplates(): ReportTemplate[] {
  return getStoredTemplates();
}

/** Async — fetches from Supabase, updates cache, migrates if needed */
export async function fetchUserTemplates(): Promise<ReportTemplate[]> {
  try {
    // One-time migration: push localStorage templates to cloud
    const migrated = localStorage.getItem(TEMPLATES_MIGRATED_KEY);
    if (!migrated) {
      const local = getStoredTemplates();
      if (local.length > 0) {
        await migrateLocalTemplatesToCloud(local);
      }
      localStorage.setItem(TEMPLATES_MIGRATED_KEY, "1");
    }

    const cloud = await getCloudUserTemplates();
    saveStoredTemplates(cloud); // update cache
    return cloud;
  } catch {
    return getStoredTemplates(); // fallback to cache
  }
}

export async function saveUserTemplate(template: ReportTemplate): Promise<ReportTemplate> {
  // Update localStorage cache immediately
  const templates = getStoredTemplates();
  const idx = templates.findIndex((t) => t.id === template.id);
  if (idx >= 0) {
    templates[idx] = template;
  } else {
    templates.push(template);
  }
  saveStoredTemplates(templates);

  // Sync to cloud (fire & forget with error handling)
  try { await saveCloudUserTemplate(template); } catch {}

  return template;
}

export async function deleteUserTemplate(id: string): Promise<void> {
  const templates = getStoredTemplates().filter((t) => t.id !== id);
  saveStoredTemplates(templates);
  try { await deleteCloudUserTemplate(id); } catch {}
}

export async function duplicateTemplate(source: ReportTemplate, newName: string): Promise<ReportTemplate> {
  const newTemplate: ReportTemplate = {
    ...source,
    id: `user_${Date.now()}`,
    name: newName,
    builtIn: false,
  };
  return saveUserTemplate(newTemplate);
}

export async function createBlankTemplate(name: string): Promise<ReportTemplate> {
  const now = Date.now();
  return saveUserTemplate({
    id: `user_${now}`,
    name,
    description: "",
    icon: "FileText",
    category: "Custom",
    builtIn: false,
    pdfTitle: name.toUpperCase(),
    fields: [],
    tiles: [],
    hasPhotos: false,
    signatureFields: [],
  });
}

// ============================================================
// UNIFIED ACCESS
// ============================================================

export function getAllTemplates(): ReportTemplate[] {
  return [...STARTER_TEMPLATES, ...getUserTemplates()];
}

export function getTemplateById(id: string): ReportTemplate | undefined {
  return getAllTemplates().find((t) => t.id === id);
}

// Helper: get catalog categories
export function getFieldCategories(): string[] {
  return [...new Set(FIELD_CATALOG.map((b) => b.category))];
}

export function getTileCategories(): string[] {
  return [...new Set(TILE_CATALOG.map((b) => b.category))];
}

// Helper: check which catalog blocks are active in a template
export function getActiveFieldBlockIds(template: ReportTemplate): Set<string> {
  const fieldIds = new Set(template.fields.map((f) => f.id));
  const active = new Set<string>();
  FIELD_CATALOG.forEach((block) => {
    if (block.fields.some((f) => fieldIds.has(f.id))) {
      active.add(block.id);
    }
  });
  return active;
}

export function getActiveTileBlockIds(template: ReportTemplate): Set<string> {
  const tileIds = new Set(template.tiles.map((t) => t.id));
  const active = new Set<string>();
  TILE_CATALOG.forEach((block) => {
    if (block.tiles.some((t) => tileIds.has(t.id))) {
      active.add(block.id);
    }
  });
  return active;
}

/** Count total tile options across all tiles-type fields */
export function countTileOptions(template: ReportTemplate): number {
  return template.fields
    .filter((f) => f.type === "tiles")
    .reduce((sum, f) => sum + (f.tileOptions?.length || 0), 0);
}

/** Get all tile options from all tiles-type fields (flat) */
export function getAllTileOptions(template: ReportTemplate): import("./storage").TileItem[] {
  return template.fields
    .filter((f) => f.type === "tiles")
    .flatMap((f) => f.tileOptions || []);
}
