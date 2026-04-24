import mongoose from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────
import {
  LISTING_CATEGORIES,
  LISTING_TYPES_MESSAGE,
  PROPERTY_TYPES,
  PROPERTY_TYPES_MESSAGE,
  PROPERTY_STATUSES,
  PROPERTY_STATUSES_MESSAGE,
  FURNISHING_OPTIONS,
  FURNISHING_OPTIONS_MESSAGE,
  NAGPUR_LOCALITIES,
  NAGPUR_LOCALITIES_MESSAGE,
  AMENITIES_LIST,
  AMENITIES_LIST_MESSAGE,
  PINCODE_REGEX,
  PINCODE_REGEX_MESSAGE,
  SUB_LOCALITY_LENGTH_LIMIT,
  SUB_LOCALITY_LENGTH_LIMIT_MESSAGE,
  LANDMARK_LENGTH_LIMIT,
  LANDMARK_LENGTH_LIMIT_MESSAGE,
  BHK_MIN_LENGTH_LIMIT,
  BHK_MIN_LENGTH_LIMIT_MESSAGE,
  BHK_MAX_LENGTH_LIMIT,
  BHK_MAX_LENGTH_LIMIT_MESSAGE,
  BATHROOMS_MIN_LENGTH_LIMIT,
  BATHROOMS_MIN_LENGTH_LIMIT_MESSAGE,
  BATHROOMS_MAX_LENGTH_LIMIT,
  BATHROOMS_MAX_LENGTH_LIMIT_MESSAGE,
  BALCONIES_MIN_LENGTH_LIMIT,
  BALCONIES_MIN_LENGTH_LIMIT_MESSAGE,
  BALCONIES_MAX_LENGTH_LIMIT,
  BALCONIES_MAX_LENGTH_LIMIT_MESSAGE,
  FLOOR_NUMBER_MIN_LENGTH_LIMIT,
  FLOOR_NUMBER_MIN_LENGTH_LIMIT_MESSAGE,
  FLOOR_NUMBER_MAX_LENGTH_LIMIT,
  FLOOR_NUMBER_MAX_LENGTH_LIMIT_MESSAGE,
  TOTAL_FLOORS_MIN_LENGTH_LIMIT,
  TOTAL_FLOORS_MIN_LENGTH_LIMIT_MESSAGE,
  TOTAL_FLOORS_MAX_LENGTH_LIMIT,
  TOTAL_FLOORS_MAX_LENGTH_LIMIT_MESSAGE,
  CARPET_AREA_MIN_LENGTH_LIMIT,
  CARPET_AREA_MIN_LENGTH_LIMIT_MESSAGE,
  BUILT_UP_AREA_MIN_LENGTH_limit,
  BUILT_UP_AREA_MIN_LENGTH_limit_MESSAGE,
  SUPER_BUILT_UP_AREA_MIN_LENGTH_limit,
  SUPER_BUILT_UP_AREA_MIN_LENGTH_limit_MESSAGE,
  FURNISHING_DETAILS_MAX_CHARACTERS,
  FURNISHING_DETAILS_MAX_CHARACTERS_MESSAGE,
  FACING_OPTIONS,
  FACING_OPTIONS_MESSAGE,
  AGE_OF_PROPERTY,
  AGE_OF_PROPERTY_MESSAGE,
  PROPERTY_AGE_YEARS,
  PROPERTY_AGE_YEARS_MESSAGE,
  FLOOR_TYPE,
  FLOOR_TYPE_MESSAGE,
  WATER_SUPPLY,
  WATER_SUPPLY_MESSAGE,
  ELECTRICITY_STATUS,
  ELECTRICITY_STATUS_MESSAGE,
  OVERLOOKING_OPTIONS,
  OVERLOOKING_OPTIONS_MESSAGE,
  OWNERSHIP_TYPES,
  OWNERSHIP_TYPES_MESSAGE,
  TRANSACTION_TYPES,
  TRANSACTION_TYPES_MESSAGE,
  FLOOR_OWNERSHIP_TYPES,
  FLOOR_OWNERSHIP_TYPES_MESSAGE,
  SHOP_FLOOR_OPTIONS,
  SHOP_FLOOR_OPTIONS_MESSAGE,
  FOOTFALL_RATING_OPTIONS,
  FOOTFALL_RATING_OPTIONS_MESSAGE,
  SUITABLE_FOR_OPTIONS,
  SUITABLE_FOR_OPTIONS_MESSAGE,
  ROAD_TYPES,
  ROAD_TYPES_MESSAGE,
  IRRIGATION_TYPES,
  IRRIGATION_TYPES_MESSAGE,
  SOIL_TYPES,
  SOIL_TYPES_MESSAGE,
  NA_ORDER_STATUS_OPTIONS,
  NA_ORDER_STATUS_OPTIONS_MESSAGE,
  WATER_SOURCE_OPTIONS,
  WATER_SOURCE_OPTIONS_MESSAGE,
  APPROVED_BY_OPTIONS,
  APPROVED_BY_OPTIONS_MESSAGE,
  ZONE_TYPES,
  ZONE_TYPES_MESSAGE,
  CONSTRUCTION_STATUS_OPTIONS,
  CONSTRUCTION_STATUS_OPTIONS_MESSAGE,
  CC_OC_OPTIONS,
  CC_OC_OPTIONS_MESSAGE,
  DEVELOPMENT_STATUS_OPTIONS,
  DEVELOPMENT_STATUS_OPTIONS_MESSAGE,
  POSSESSION_TIMELINE_OPTIONS,
  POSSESSION_TIMELINE_OPTIONS_MESSAGE,
  PREFERRED_TENANTS_OPTIONS,
  PREFERRED_TENANTS_OPTIONS_MESSAGE,
  LEASE_DURATION_OPTIONS,
  LEASE_DURATION_OPTIONS_MESSAGE,
  LOCK_IN_PERIOD_OPTIONS,
  LOCK_IN_PERIOD_OPTIONS_MESSAGE,
  RERA_NUMBER_REGEX,
  RERA_NUMBER_REGEX_MESSAGE,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_MESSAGE,
  DESCRIPTION_MIN_LENGTH,
  DESCRIPTION_MIN_LENGTH_MESSAGE,
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH_MESSAGE,
  SOCIETY_NAME_MAX_LENGTH,
  SOCIETY_NAME_MAX_LENGTH_MESSAGE,
  NUMBER_OF_FLOORS_MAX_LENGTH,
  NUMBER_OF_FLOORS_MAX_LENGTH_MESSAGE,
  FLOOR_LOAD_CAPACITY_MAX_LENGTH,
  FLOOR_LOAD_CAPACITY_MAX_LENGTH_MESSAGE,
  TREES_PLANTATION_MAX_LENGTH,
  TREES_PLANTATION_MAX_LENGTH_MESSAGE,
  NA_ORDER_NUMBER_MAX_LENGTH,
  NA_ORDER_NUMBER_MAX_LENGTH_MESSAGE,
  PROJECT_NAME_MAX_LENGTH,
  PROJECT_NAME_MAX_LENGTH_MESSAGE,
  BUILDER_NAME_MAX_LENGTH,
  BUILDER_NAME_MAX_LENGTH_MESSAGE,
  TOWER_WING_MAX_LENGTH,
  TOWER_WING_MAX_LENGTH_MESSAGE,
  APPROVED_BANKS_MAX_LENGTH,
  APPROVED_BANKS_MAX_LENGTH_MESSAGE,
  LAYOUT_PROJECT_NAME_MAX_LENGTH,
  LAYOUT_PROJECT_NAME_MAX_LENGTH_MESSAGE,
  BROKERAGE_MAX_LENGTH,
  BROKERAGE_MAX_LENGTH_MESSAGE,
  PRICE_RANGE_MAX_LENGTH,
  PRICE_RANGE_MAX_LENGTH_MESSAGE,
  ADMIN_NOTES_MAX_LENGTH,
  ADMIN_NOTES_MAX_LENGTH_MESSAGE,
  REJECTED_REASON_MAX_LENGTH,
  REJECTED_REASON_MAX_LENGTH_MESSAGE,
  PHOTOS_MIN_COUNT,
  PHOTOS_MIN_COUNT_MESSAGE,
  PHOTOS_MAX_COUNT,
  PHOTOS_MAX_COUNT_MESSAGE,
  CABIN_COUNT_MIN,
  CABIN_COUNT_MAX,
  OPEN_DESKS_MIN,
  OPEN_DESKS_MAX,
  WASHROOMS_MIN,
  WASHROOMS_MAX,
  PARKING_SLOTS_MIN,
  PARKING_SLOTS_MAX,
  NUMBER_OF_SHOWROOM_FLOORS_MIN,
  NUMBER_OF_SHOWROOM_FLOORS_MAX,
  NUMBER_OF_DOCKS_MIN,
  NUMBER_OF_DOCKS_MAX,
} from '../constants/property.constants.js';

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const coordinatesSchema = new mongoose.Schema({
  type: { type: String, default: 'Point', enum: ['Point'] },
  coordinates: { type: [Number], required: [true, 'Coordinates are required'] },    // [longitude, latitude]
}, { _id: false });

const locationSchema = new mongoose.Schema({
  city: { type: String, default: 'Nagpur', immutable: true },
  locality: { type: String, required: [true, 'Locality is required'], enum: { values: NAGPUR_LOCALITIES, message: NAGPUR_LOCALITIES_MESSAGE } },
  subLocality: { type: String, maxlength: [SUB_LOCALITY_LENGTH_LIMIT, SUB_LOCALITY_LENGTH_LIMIT_MESSAGE], default: null },
  landmark: { type: String, maxlength: [LANDMARK_LENGTH_LIMIT, LANDMARK_LENGTH_LIMIT_MESSAGE], default: null },
  pinCode: {
    type: String,
    match: [PINCODE_REGEX, PINCODE_REGEX_MESSAGE],
    default: null,
  },
  coordinates: { type: coordinatesSchema, required: [true, 'Coordinates are required'] },
}, { _id: false });

/**
 * Details schema — every field is optional at the schema level.
 * Required fields are enforced in the Zod validation schema (property.schema.js)
 * based on the (listingCategory × propertyType) combination.
 */
const detailsSchema = new mongoose.Schema({
  // ── Residential ─────────────────────────────────────────────────────────────
  bhk: { type: Number, min: BHK_MIN_LENGTH_LIMIT, max: BHK_MAX_LENGTH_LIMIT, default: null },
  bathrooms: { type: Number, min: BATHROOMS_MIN_LENGTH_LIMIT, max: BATHROOMS_MAX_LENGTH_LIMIT, default: null },
  balconies: { type: Number, min: BALCONIES_MIN_LENGTH_LIMIT, max: BALCONIES_MAX_LENGTH_LIMIT, default: null },
  floorNumber: { type: Number, min: FLOOR_NUMBER_MIN_LENGTH_LIMIT, max: FLOOR_NUMBER_MAX_LENGTH_LIMIT, default: null },
  totalFloors: { type: Number, min: TOTAL_FLOORS_MIN_LENGTH_LIMIT, max: TOTAL_FLOORS_MAX_LENGTH_LIMIT, default: null },
  carpetArea: { type: Number, min: CARPET_AREA_MIN_LENGTH_LIMIT, default: null },
  builtUpArea: { type: Number, min: BUILT_UP_AREA_MIN_LENGTH_limit, default: null },
  superBuiltUpArea: { type: Number, min: SUPER_BUILT_UP_AREA_MIN_LENGTH_limit, default: null },
  furnishing: { type: String, enum: { values: FURNISHING_OPTIONS, message: FURNISHING_OPTIONS_MESSAGE }, default: null },
  furnishingDetails: { type: String, maxlength: [FURNISHING_DETAILS_MAX_CHARACTERS, FURNISHING_DETAILS_MAX_CHARACTERS_MESSAGE], default: null },
  facing: { type: String, enum: { values: [...FACING_OPTIONS, null], message: FACING_OPTIONS_MESSAGE }, default: null },
  ageOfProperty: { type: String, enum: { values: [...AGE_OF_PROPERTY, null], message: AGE_OF_PROPERTY_MESSAGE }, default: null },
  propertyAgeYears: { type: Number, min: PROPERTY_AGE_YEARS, default: null },
  floorType: { type: String, enum: { values: [...FLOOR_TYPE, null], message: FLOOR_TYPE_MESSAGE }, default: null },
  waterSupply: { type: String, enum: { values: [...WATER_SUPPLY, null], message: WATER_SUPPLY_MESSAGE }, default: null },
  electricityStatus: { type: String, enum: { values: [...ELECTRICITY_STATUS, null], message: ELECTRICITY_STATUS_MESSAGE }, default: null },
  overlooking: [{ type: String, enum: { values: OVERLOOKING_OPTIONS, message: OVERLOOKING_OPTIONS_MESSAGE } }],
  ownershipType: { type: String, enum: { values: [...OWNERSHIP_TYPES, null], message: OWNERSHIP_TYPES_MESSAGE }, default: null },
  readyToMove: { type: Boolean, default: null },
  societyName: { type: String, maxlength: [SOCIETY_NAME_MAX_LENGTH, SOCIETY_NAME_MAX_LENGTH_MESSAGE], default: null },
  petFriendly: { type: Boolean, default: null },
  nonVegAllowed: { type: Boolean, default: null },
  transactionType: { type: String, enum: { values: [...TRANSACTION_TYPES, null], message: TRANSACTION_TYPES_MESSAGE }, default: null },

  // ── Villa / Independent House specific ──────────────────────────────────────
  numberOfFloors: { type: String, maxlength: [NUMBER_OF_FLOORS_MAX_LENGTH, NUMBER_OF_FLOORS_MAX_LENGTH_MESSAGE], default: null },
  plotArea: { type: Number, min: 1, default: null },
  parkingSlots: { type: Number, min: PARKING_SLOTS_MIN, max: PARKING_SLOTS_MAX, default: null },
  hasGarden: { type: Boolean, default: null },
  cornerProperty: { type: Boolean, default: null },
  gatedSociety: { type: Boolean, default: null },
  independentEntry: { type: Boolean, default: null },
  roadWidth: { type: Number, min: 1, default: null },

  // ── Penthouse specific ───────────────────────────────────────────────────────
  terraceArea: { type: Number, min: 1, default: null },
  privateLift: { type: Boolean, default: null },
  isDuplex: { type: Boolean, default: null },
  servantRoom: { type: Boolean, default: null },
  privatePool: { type: Boolean, default: null },

  // ── Builder Floor specific ───────────────────────────────────────────────────
  totalUnitsInBuilding: { type: Number, min: 1, default: null },
  floorOwnershipType: { type: String, enum: { values: [...FLOOR_OWNERSHIP_TYPES, null], message: FLOOR_OWNERSHIP_TYPES_MESSAGE }, default: null },
  stiltParking: { type: Boolean, default: null },

  // ── Office Space ─────────────────────────────────────────────────────────────
  officeArea: { type: Number, min: 1, default: null },
  cabinCount: { type: Number, min: CABIN_COUNT_MIN, max: CABIN_COUNT_MAX, default: null },
  openDesks: { type: Number, min: OPEN_DESKS_MIN, max: OPEN_DESKS_MAX, default: null },
  washrooms: { type: Number, min: WASHROOMS_MIN, max: WASHROOMS_MAX, default: null },
  hasPantry: { type: Boolean, default: null },
  itReady: { type: Boolean, default: null },
  conferenceRoom: { type: Boolean, default: null },
  receptionArea: { type: Boolean, default: null },
  centralAC: { type: Boolean, default: null },
  officeFireSafety: { type: Boolean, default: null },
  dgBackup: { type: Boolean, default: null },

  // ── Shop ─────────────────────────────────────────────────────────────────────
  shopArea: { type: Number, min: 1, default: null },
  shopFloor: { type: String, enum: { values: [...SHOP_FLOOR_OPTIONS, null], message: SHOP_FLOOR_OPTIONS_MESSAGE }, default: null },
  frontage: { type: Number, min: 1, default: null },
  depth: { type: Number, min: 1, default: null },
  ceilingHeight: { type: Number, min: 1, default: null },
  mainRoadFacing: { type: Boolean, default: null },
  cornerShop: { type: Boolean, default: null },
  mezzanineFloor: { type: Boolean, default: null },
  hasWashroom: { type: Boolean, default: null },
  footfallRating: { type: String, enum: { values: [...FOOTFALL_RATING_OPTIONS, null], message: FOOTFALL_RATING_OPTIONS_MESSAGE }, default: null },
  suitableFor: [{ type: String, enum: { values: SUITABLE_FOR_OPTIONS, message: SUITABLE_FOR_OPTIONS_MESSAGE } }],

  // ── Showroom ─────────────────────────────────────────────────────────────────
  showroomArea: { type: Number, min: 1, default: null },
  numberOfShowroomFloors: { type: Number, min: NUMBER_OF_SHOWROOM_FLOORS_MIN, max: NUMBER_OF_SHOWROOM_FLOORS_MAX, default: null },
  glassFront: { type: Boolean, default: null },
  parkingAvailable: { type: Boolean, default: null },
  acInstalled: { type: Boolean, default: null },

  // ── Warehouse / Godown ───────────────────────────────────────────────────────
  warehouseArea: { type: Number, min: 1, default: null },
  warehouseHeight: { type: Number, min: 1, default: null },
  truckAccess: { type: Boolean, default: null },
  numberOfDocks: { type: Number, min: NUMBER_OF_DOCKS_MIN, max: NUMBER_OF_DOCKS_MAX, default: null },
  floorLoadCapacity: { type: String, maxlength: [FLOOR_LOAD_CAPACITY_MAX_LENGTH, FLOOR_LOAD_CAPACITY_MAX_LENGTH_MESSAGE], default: null },
  openYardArea: { type: Number, min: 1, default: null },
  powerLoad: { type: Number, min: 1, default: null },
  waterSupplyWarehouse: { type: Boolean, default: null },
  officeSpaceInside: { type: Boolean, default: null },
  midc: { type: Boolean, default: null },

  // ── Residential Plot ─────────────────────────────────────────────────────────
  plotAreaSqFt: { type: Number, min: 1, default: null },
  plotAreaSqM: { type: Number, min: 1, default: null },
  plotLength: { type: Number, min: 1, default: null },
  plotWidth: { type: Number, min: 1, default: null },
  boundaryWall: { type: Boolean, default: null },
  gatedLayout: { type: Boolean, default: null },
  cornerPlot: { type: Boolean, default: null },
  approvedBy: [{ type: String, enum: { values: APPROVED_BY_OPTIONS, message: APPROVED_BY_OPTIONS_MESSAGE } }],
  zoneType: { type: String, enum: { values: [...ZONE_TYPES, null], message: ZONE_TYPES_MESSAGE }, default: null },
  fsiAvailable: { type: Number, min: 0, default: null },

  // ── Agricultural Land ─────────────────────────────────────────────────────────
  areaAcres: { type: Number, min: 0.01, default: null },
  areaHectares: { type: Number, min: 0.01, default: null },
  waterSource: [{ type: String, enum: { values: WATER_SOURCE_OPTIONS, message: WATER_SOURCE_OPTIONS_MESSAGE } }],
  roadAccess: { type: Boolean, default: null },
  roadType: { type: String, enum: { values: [...ROAD_TYPES, null], message: ROAD_TYPES_MESSAGE }, default: null },
  fencing: { type: Boolean, default: null },
  treesPlantation: { type: String, maxlength: [TREES_PLANTATION_MAX_LENGTH, TREES_PLANTATION_MAX_LENGTH_MESSAGE], default: null },
  irrigationType: { type: String, enum: { values: [...IRRIGATION_TYPES, null], message: IRRIGATION_TYPES_MESSAGE }, default: null },
  electricityLand: { type: Boolean, default: null },
  distanceFromCity: { type: Number, min: 0, default: null },
  sevenTwelveExtract: { type: Boolean, default: null },
  soilType: { type: String, enum: { values: [...SOIL_TYPES, null], message: SOIL_TYPES_MESSAGE }, default: null },

  // ── NA Plot ───────────────────────────────────────────────────────────────────
  naOrderStatus: { type: String, enum: { values: [...NA_ORDER_STATUS_OPTIONS, null], message: NA_ORDER_STATUS_OPTIONS_MESSAGE }, default: null },
  naOrderNumber: { type: String, maxlength: [NA_ORDER_NUMBER_MAX_LENGTH, NA_ORDER_NUMBER_MAX_LENGTH_MESSAGE], default: null },

  // ── RERA ──────────────────────────────────────────────────────────────────────
  reraRegistered: { type: Boolean, default: null },
  reraNumber: {
    type: String,
    match: [RERA_NUMBER_REGEX, RERA_NUMBER_REGEX_MESSAGE],
    default: null,
  },
  reraValidityDate: { type: Date, default: null },

  // ── New Project specific ──────────────────────────────────────────────────────
  projectName: { type: String, maxlength: [PROJECT_NAME_MAX_LENGTH, PROJECT_NAME_MAX_LENGTH_MESSAGE], default: null },
  builderName: { type: String, maxlength: [BUILDER_NAME_MAX_LENGTH, BUILDER_NAME_MAX_LENGTH_MESSAGE], default: null },
  constructionStatus: { type: String, enum: { values: [...CONSTRUCTION_STATUS_OPTIONS, null], message: CONSTRUCTION_STATUS_OPTIONS_MESSAGE }, default: null },
  possessionDate: { type: Date, default: null },
  totalUnitsInProject: { type: Number, min: 1, default: null },
  unitsAvailable: { type: Number, min: 0, default: null },
  towerWing: { type: String, maxlength: [TOWER_WING_MAX_LENGTH, TOWER_WING_MAX_LENGTH_MESSAGE], default: null },
  approvedBanks: { type: String, maxlength: [APPROVED_BANKS_MAX_LENGTH, APPROVED_BANKS_MAX_LENGTH_MESSAGE], default: null },
  ccOcReceived: { type: String, enum: { values: [...CC_OC_OPTIONS, null], message: CC_OC_OPTIONS_MESSAGE }, default: null },
  totalVillasInProject: { type: Number, min: 1, default: null },
  layoutProjectName: { type: String, maxlength: [LAYOUT_PROJECT_NAME_MAX_LENGTH, LAYOUT_PROJECT_NAME_MAX_LENGTH_MESSAGE], default: null },
  totalPlotsInLayout: { type: Number, min: 1, default: null },
  plotsAvailable: { type: Number, min: 0, default: null },
  developmentStatus: { type: String, enum: { values: [...DEVELOPMENT_STATUS_OPTIONS, null], message: DEVELOPMENT_STATUS_OPTIONS_MESSAGE }, default: null },
}, { _id: false });

const pricingSchema = new mongoose.Schema({
  // ── Resale / New ──────────────────────────────────────────────────────────────
  totalPrice: { type: Number, min: 0, default: null },
  startingPrice: { type: Number, min: 0, default: null },
  pricePerSqft: { type: Number, min: 0, default: null },
  priceRange: { type: String, maxlength: [PRICE_RANGE_MAX_LENGTH, PRICE_RANGE_MAX_LENGTH_MESSAGE], default: null },
  bookingAmount: { type: Number, min: 0, default: null },
  gstApplicable: { type: Boolean, default: null },
  priceNegotiable: { type: Boolean, default: null },
  possessionTimeline: { type: String, enum: { values: [...POSSESSION_TIMELINE_OPTIONS, null], message: POSSESSION_TIMELINE_OPTIONS_MESSAGE }, default: null },
  brokerage: { type: String, maxlength: [BROKERAGE_MAX_LENGTH, BROKERAGE_MAX_LENGTH_MESSAGE], default: null },

  // ── Rental ────────────────────────────────────────────────────────────────────
  monthlyRent: { type: Number, min: 0, default: null },
  annualLease: { type: Number, min: 0, default: null },
  securityDeposit: { type: Number, min: 0, default: null },
  maintenance: { type: Number, min: 0, default: null },
  availableFrom: { type: Date, default: null },
  preferredTenants: [{ type: String, enum: { values: PREFERRED_TENANTS_OPTIONS, message: PREFERRED_TENANTS_OPTIONS_MESSAGE } }],
  leaseDuration: { type: String, enum: { values: [...LEASE_DURATION_OPTIONS, null], message: LEASE_DURATION_OPTIONS_MESSAGE }, default: null },
  lockInPeriod: { type: String, enum: { values: [...LOCK_IN_PERIOD_OPTIONS, null], message: LOCK_IN_PERIOD_OPTIONS_MESSAGE }, default: null },
  rentNegotiable: { type: Boolean, default: null },
}, { _id: false });

// ─── Main Property Schema ─────────────────────────────────────────────────────
const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [TITLE_MAX_LENGTH, TITLE_MAX_LENGTH_MESSAGE],
    },
    listingCategory: {
      type: String,
      required: [true, 'Listing category is required'],
      enum: { values: LISTING_CATEGORIES, message: LISTING_TYPES_MESSAGE },
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: { values: PROPERTY_TYPES, message: PROPERTY_TYPES_MESSAGE },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [DESCRIPTION_MIN_LENGTH, DESCRIPTION_MIN_LENGTH_MESSAGE],
      maxlength: [DESCRIPTION_MAX_LENGTH, DESCRIPTION_MAX_LENGTH_MESSAGE],
    },

    location: { type: locationSchema, required: true },
    details: { type: detailsSchema, default: () => ({}) },
    pricing: { type: pricingSchema, default: () => ({}) },

    photos: {
      type: [String],
      validate: [
        { validator: (v) => v.length >= PHOTOS_MIN_COUNT, message: PHOTOS_MIN_COUNT_MESSAGE },
        { validator: (v) => v.length <= PHOTOS_MAX_COUNT, message: PHOTOS_MAX_COUNT_MESSAGE },
      ],
      default: [],
    },
    video: { type: String, default: null },

    amenities: [{ type: String, enum: { values: AMENITIES_LIST, message: AMENITIES_LIST_MESSAGE } }],

    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Broker (User) reference is required'],
      index: true,
    },

    status: {
      type: String,
      enum: { values: PROPERTY_STATUSES, message: PROPERTY_STATUSES_MESSAGE },
      default: 'Pending',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    adminNotes: { type: String, maxlength: [ADMIN_NOTES_MAX_LENGTH, ADMIN_NOTES_MAX_LENGTH_MESSAGE], default: null },
    rejectedReason: { type: String, maxlength: [REJECTED_REASON_MAX_LENGTH, REJECTED_REASON_MAX_LENGTH_MESSAGE], default: null },
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

  if (d.plotAreaSqFt) {
    d.plotAreaSqM = parseFloat((d.plotAreaSqFt / 10.764).toFixed(2));
  }
  if (d.areaAcres) {
    d.areaHectares = parseFloat((d.areaAcres * 0.4047).toFixed(4));
  }
  if (this.listingCategory === 'Resale' && p.totalPrice && d.carpetArea) {
    p.pricePerSqft = Math.round(p.totalPrice / d.carpetArea);
  }

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