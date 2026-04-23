import mongoose from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────
export const LISTING_CATEGORIES = ['Resale', 'Rental', 'New'];

export const PROPERTY_TYPES = [
  'Flat/Apartment',
  'Villa/Independent House',
  'Builder Floor',
  'Penthouse',
  'Office Space',
  'Shop',
  'Showroom',
  'Warehouse/Godown',
  'Residential Plot',
  'Agricultural Land',
  'NA Plot',
];

export const PROPERTY_STATUSES = [
  'Draft',
  'Pending',
  'Active',
  'Rejected',
  'Sold',
  'Rented',
  'Inactive',
];

export const FURNISHING_OPTIONS = [
  'Unfurnished',
  'Semi-Furnished',
  'Fully Furnished',
  'Bare Shell',
  'Warm Shell',
];

export const NAGPUR_LOCALITIES = [
  'Dharampeth', 'Sadar', 'Sitabuldi', 'Manish Nagar', 'Trimurti Nagar',
  'Besa', 'Wardha Road', 'Hingna Road', 'MIHAN', 'Mankapur',
  'Laxmi Nagar', 'Ramdaspeth', 'Bajaj Nagar', 'Pratap Nagar',
  'Kamptee Road', 'Wadi', 'Narendra Nagar', 'Nandanvan',
  'Koradi Road', 'Somalwada', 'Khamla', 'Ambazari',
  'Seminary Hills', 'Civil Lines', 'Godhni',
];

export const AMENITIES_LIST = [
  'Parking (2-wheeler)',
  'Parking (4-wheeler)',
  'Lift/Elevator',
  '24x7 Security',
  'CCTV Surveillance',
  'Gym/Fitness Centre',
  'Swimming Pool',
  'Garden/Park',
  "Children's Play Area",
  'Clubhouse',
  'Power Backup',
  'Rainwater Harvesting',
  'Fire Safety',
  'Intercom',
  'Visitor Parking',
  'Water Storage',
  'Piped Gas',
  'Sewage Treatment',
];

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const coordinatesSchema = new mongoose.Schema({
  type:        { type: String, default: 'Point', enum: ['Point'] },
  coordinates: { type: [Number], required: true },    // [longitude, latitude]
}, { _id: false });

const locationSchema = new mongoose.Schema({
  city:        { type: String, default: 'Nagpur', immutable: true },
  locality:    { type: String, required: true, enum: NAGPUR_LOCALITIES },
  subLocality: { type: String, maxlength: 100, default: null },
  landmark:    { type: String, maxlength: 100, default: null },
  pinCode:     {
    type: String,
    match: [/^44\d{4}$/, 'Enter a valid Nagpur pin code (440001-440037)'],
    default: null,
  },
  coordinates: { type: coordinatesSchema, required: true },
}, { _id: false });

/**
 * Details schema — every field is optional at the schema level.
 * Required fields are enforced in the Zod validation schema (property.schema.js)
 * based on the (listingCategory × propertyType) combination.
 */
const detailsSchema = new mongoose.Schema({
  // ── Residential ─────────────────────────────────────────────────────────────
  bhk:               { type: Number, min: 1, max: 8, default: null },
  bathrooms:         { type: Number, min: 1, max: 15, default: null },
  balconies:         { type: Number, min: 0, max: 10, default: null },
  floorNumber:       { type: Number, min: 0, max: 99, default: null },
  totalFloors:       { type: Number, min: 1, max: 99, default: null },
  carpetArea:        { type: Number, min: 1, default: null },          // sq.ft
  builtUpArea:       { type: Number, min: 1, default: null },
  superBuiltUpArea:  { type: Number, min: 1, default: null },
  furnishing:        { type: String, enum: [...FURNISHING_OPTIONS, null], default: null },
  furnishingDetails: { type: String, maxlength: 500, default: null },
  facing:            { type: String, enum: ['N','S','E','W','NE','NW','SE','SW', null], default: null },
  ageOfProperty:     { type: String, enum: ['New','1-3 yrs','3-5 yrs','5-10 yrs','10+ yrs', null], default: null },
  propertyAgeYears:  { type: Number, min: 0, default: null },
  floorType:         { type: String, enum: ['Marble','Vitrified','Wooden','Granite','Ceramic', null], default: null },
  waterSupply:       { type: String, enum: ['Municipal','Borewell','Both', null], default: null },
  electricityStatus: { type: String, enum: ['Metered','Non-metered','Pre-paid', null], default: null },
  overlooking:       [{ type: String, enum: ['Garden','Pool','Main Road','Park'] }],
  ownershipType:     {
    type: String,
    enum: ['Freehold','Leasehold','Co-operative Society','Power of Attorney','Individual','Joint','Family', null],
    default: null,
  },
  readyToMove:       { type: Boolean, default: null },
  societyName:       { type: String, maxlength: 100, default: null },
  petFriendly:       { type: Boolean, default: null },
  nonVegAllowed:     { type: Boolean, default: null },
  transactionType:   { type: String, enum: ['New Property','Resale', null], default: null },

  // ── Villa / Independent House specific ──────────────────────────────────────
  numberOfFloors:    { type: String, maxlength: 20, default: null },     // e.g. 'G+1'
  plotArea:          { type: Number, min: 1, default: null },            // sq.ft
  parkingSlots:      { type: Number, min: 0, max: 10, default: null },
  hasGarden:         { type: Boolean, default: null },
  cornerProperty:    { type: Boolean, default: null },
  gatedSociety:      { type: Boolean, default: null },
  independentEntry:  { type: Boolean, default: null },
  roadWidth:         { type: Number, min: 1, default: null },            // ft

  // ── Penthouse specific ───────────────────────────────────────────────────────
  terraceArea:       { type: Number, min: 1, default: null },
  privateLift:       { type: Boolean, default: null },
  isDuplex:          { type: Boolean, default: null },
  servantRoom:       { type: Boolean, default: null },
  privatePool:       { type: Boolean, default: null },

  // ── Builder Floor specific ───────────────────────────────────────────────────
  totalUnitsInBuilding: { type: Number, min: 1, default: null },
  floorOwnershipType:   { type: String, enum: ['Individual','Shared','Builder-owned', null], default: null },
  stiltParking:         { type: Boolean, default: null },

  // ── Office Space ─────────────────────────────────────────────────────────────
  officeArea:        { type: Number, min: 1, default: null },
  cabinCount:        { type: Number, min: 0, max: 50, default: null },
  openDesks:         { type: Number, min: 0, max: 200, default: null },
  washrooms:         { type: Number, min: 1, max: 10, default: null },
  hasPantry:         { type: Boolean, default: null },
  itReady:           { type: Boolean, default: null },
  conferenceRoom:    { type: Boolean, default: null },
  receptionArea:     { type: Boolean, default: null },
  centralAC:         { type: Boolean, default: null },
  officeFireSafety:  { type: Boolean, default: null },
  dgBackup:          { type: Boolean, default: null },

  // ── Shop ─────────────────────────────────────────────────────────────────────
  shopArea:          { type: Number, min: 1, default: null },
  shopFloor:         { type: String, enum: ['Lower Ground','Ground','1st','2nd','3rd+', null], default: null },
  frontage:          { type: Number, min: 1, default: null },
  depth:             { type: Number, min: 1, default: null },
  ceilingHeight:     { type: Number, min: 1, default: null },
  mainRoadFacing:    { type: Boolean, default: null },
  cornerShop:        { type: Boolean, default: null },
  mezzanineFloor:    { type: Boolean, default: null },
  hasWashroom:       { type: Boolean, default: null },
  footfallRating:    { type: String, enum: ['Low','Medium','High','Premium', null], default: null },
  suitableFor:       [{ type: String, enum: ['Retail','Food','Pharmacy','Showroom','Office','Clinic'] }],

  // ── Showroom ─────────────────────────────────────────────────────────────────
  showroomArea:          { type: Number, min: 1, default: null },
  numberOfShowroomFloors:{ type: Number, min: 1, max: 5, default: null },
  glassFront:            { type: Boolean, default: null },
  parkingAvailable:      { type: Boolean, default: null },
  acInstalled:           { type: Boolean, default: null },

  // ── Warehouse / Godown ───────────────────────────────────────────────────────
  warehouseArea:      { type: Number, min: 1, default: null },
  warehouseHeight:    { type: Number, min: 1, default: null },
  truckAccess:        { type: Boolean, default: null },
  numberOfDocks:      { type: Number, min: 0, max: 20, default: null },
  floorLoadCapacity:  { type: String, maxlength: 50, default: null },
  openYardArea:       { type: Number, min: 1, default: null },
  powerLoad:          { type: Number, min: 1, default: null },
  waterSupplyWarehouse:{ type: Boolean, default: null },
  officeSpaceInside:  { type: Boolean, default: null },
  midc:               { type: Boolean, default: null },

  // ── Residential Plot ─────────────────────────────────────────────────────────
  plotAreaSqFt:      { type: Number, min: 1, default: null },
  plotAreaSqM:       { type: Number, min: 1, default: null },           // auto-calc
  plotLength:        { type: Number, min: 1, default: null },
  plotWidth:         { type: Number, min: 1, default: null },
  boundaryWall:      { type: Boolean, default: null },
  gatedLayout:       { type: Boolean, default: null },
  cornerPlot:        { type: Boolean, default: null },
  approvedBy:        [{ type: String, enum: ['NIT','NMC','NMRDA','MHADA','Private Layout'] }],
  zoneType:          { type: String, enum: ['Residential','Mixed Use','Commercial','Industrial', null], default: null },
  fsiAvailable:      { type: Number, min: 0, default: null },

  // ── Agricultural Land ─────────────────────────────────────────────────────────
  areaAcres:         { type: Number, min: 0.01, default: null },
  areaHectares:      { type: Number, min: 0.01, default: null },        // auto-calc
  waterSource:       [{ type: String, enum: ['Well','Borewell','Canal','River','None'] }],
  roadAccess:        { type: Boolean, default: null },
  roadType:          { type: String, enum: ['Tar Road','Concrete','Mud','Kachcha', null], default: null },
  fencing:           { type: Boolean, default: null },
  treesPlantation:   { type: String, maxlength: 100, default: null },
  irrigationType:    { type: String, enum: ['Drip','Sprinkler','Canal','Flood','None', null], default: null },
  electricityLand:   { type: Boolean, default: null },
  distanceFromCity:  { type: Number, min: 0, default: null },
  sevenTwelveExtract:{ type: Boolean, default: null },
  soilType:          { type: String, enum: ['Black','Red','Alluvial','Mixed', null], default: null },

  // ── NA Plot ───────────────────────────────────────────────────────────────────
  naOrderStatus:     { type: String, enum: ['NA Order Received','Applied','Not Applied', null], default: null },
  naOrderNumber:     { type: String, maxlength: 50, default: null },

  // ── RERA (Resale/Rental optional; New mandatory) ──────────────────────────────
  reraRegistered:    { type: Boolean, default: null },
  reraNumber:        {
    type: String,
    match: [/^P52100\d{6}$/, 'Enter a valid MahaRERA number (P52100XXXXXX)'],
    default: null,
  },
  reraValidityDate:  { type: Date, default: null },

  // ── New Project specific ──────────────────────────────────────────────────────
  projectName:           { type: String, maxlength: 100, default: null },
  builderName:           { type: String, maxlength: 100, default: null },
  constructionStatus:    {
    type: String,
    enum: ['Pre-launch','Under Construction','Ready to Move','Ready','Partially Ready','Under Development', null],
    default: null,
  },
  possessionDate:        { type: Date, default: null },
  totalUnitsInProject:   { type: Number, min: 1, default: null },
  unitsAvailable:        { type: Number, min: 0, default: null },
  towerWing:             { type: String, maxlength: 50, default: null },
  approvedBanks:         { type: String, maxlength: 200, default: null },
  ccOcReceived:          {
    type: String,
    enum: ['CC Received','OC Received','Both','None','Applied', null],
    default: null,
  },
  // Villa project
  totalVillasInProject:  { type: Number, min: 1, default: null },
  // Plot layout
  layoutProjectName:     { type: String, maxlength: 100, default: null },
  totalPlotsInLayout:    { type: Number, min: 1, default: null },
  plotsAvailable:        { type: Number, min: 0, default: null },
  developmentStatus:     {
    type: String,
    enum: ['Under Development','Ready','Partially Ready', null],
    default: null,
  },
}, { _id: false });

const pricingSchema = new mongoose.Schema({
  // ── Resale / New ──────────────────────────────────────────────────────────────
  totalPrice:          { type: Number, min: 0, default: null },
  startingPrice:       { type: Number, min: 0, default: null },
  pricePerSqft:        { type: Number, min: 0, default: null },       // auto-calc or manual
  priceRange:          { type: String, maxlength: 50, default: null },
  bookingAmount:       { type: Number, min: 0, default: null },
  gstApplicable:       { type: Boolean, default: null },
  priceNegotiable:     { type: Boolean, default: null },
  possessionTimeline:  {
    type: String,
    enum: ['Immediate','Within 1 month','1-3 months','3-6 months', null],
    default: null,
  },
  brokerage:           { type: String, maxlength: 50, default: null },

  // ── Rental ────────────────────────────────────────────────────────────────────
  monthlyRent:         { type: Number, min: 0, default: null },
  annualLease:         { type: Number, min: 0, default: null },        // for Agri Land
  securityDeposit:     { type: Number, min: 0, default: null },
  maintenance:         { type: Number, min: 0, default: null },
  availableFrom:       { type: Date, default: null },
  preferredTenants:    [{
    type: String,
    enum: ['Family','Bachelor Male','Bachelor Female','Company','Any'],
  }],
  leaseDuration:       {
    type: String,
    enum: ['11 months','1 year','2 years','3 years','5 years','10+ years','Flexible', null],
    default: null,
  },
  lockInPeriod:        {
    type: String,
    enum: ['None','3 months','6 months','1 year', null],
    default: null,
  },
  rentNegotiable:      { type: Boolean, default: null },
}, { _id: false });

// ─── Main Property Schema ─────────────────────────────────────────────────────
const propertySchema = new mongoose.Schema(
  {
    // Basic Info
    title:           {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    listingCategory: {
      type: String,
      required: [true, 'Listing category is required'],
      enum: { values: LISTING_CATEGORIES, message: '{VALUE} is not a valid listing category' },
    },
    propertyType:    {
      type: String,
      required: [true, 'Property type is required'],
      enum: { values: PROPERTY_TYPES, message: '{VALUE} is not a valid property type' },
    },
    description:     {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    // Location
    location: { type: locationSchema, required: true },

    // Dynamic fields
    details: { type: detailsSchema, default: () => ({}) },
    pricing: { type: pricingSchema, default: () => ({}) },

    // Media
    photos: {
      type: [String],
      validate: [
        { validator: (v) => v.length >= 1, message: 'At least one photo is required' },
        { validator: (v) => v.length <= 15, message: 'Maximum 15 photos allowed' },
      ],
      default: [],
    },
    video: { type: String, default: null },

    // Amenities
    amenities: [{
      type: String,
      enum: AMENITIES_LIST,
    }],

    // Ownership — ref to User (broker)
    brokerId:   {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Broker (User) reference is required'],
      index: true,
    },

    // Admin management fields
    status:      {
      type: String,
      enum: { values: PROPERTY_STATUSES, message: '{VALUE} is not a valid status' },
      default: 'Pending',
      index: true,
    },
    featured:    { type: Boolean, default: false, index: true },
    views:       { type: Number, default: 0, min: 0 },
    inquiries:   { type: Number, default: 0, min: 0 },
    adminNotes:  { type: String, maxlength: 500, default: null },
    rejectedReason: { type: String, maxlength: 200, default: null },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ listingCategory: 1, propertyType: 1, status: 1 });
propertySchema.index({ 'location.locality': 1 });
propertySchema.index({ brokerId: 1, status: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.locality': 'text',
}, { weights: { title: 5, 'location.locality': 3, description: 1 } });

// ─── Pre-save: Auto-calculate derived fields ──────────────────────────────────
propertySchema.pre('save', function (next) {
  const d = this.details;
  const p = this.pricing;

  // Sq.ft → sq.m for plots
  if (d.plotAreaSqFt) {
    d.plotAreaSqM = parseFloat((d.plotAreaSqFt / 10.764).toFixed(2));
  }
  // Acres → hectares for agri land
  if (d.areaAcres) {
    d.areaHectares = parseFloat((d.areaAcres * 0.4047).toFixed(4));
  }
  // Price per sq.ft for Resale
  if (this.listingCategory === 'Resale' && p.totalPrice && d.carpetArea) {
    p.pricePerSqft = Math.round(p.totalPrice / d.carpetArea);
  }
  // Price per sq.ft for Resale agri land
  // (no sq.ft — skip)

  // RERA number required for NEW category
  if (
    this.listingCategory === 'New' &&
    !['Warehouse/Godown', 'Agricultural Land', 'NA Plot'].includes(this.propertyType) &&
    !d.reraNumber
  ) {
    return next(new Error('RERA number is mandatory for all new projects in Nagpur.'));
  }

  next();
});

const Property = mongoose.model('Property', propertySchema);
export default Property;