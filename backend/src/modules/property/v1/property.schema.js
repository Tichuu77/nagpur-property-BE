import { z } from 'zod';
import {
  LISTING_CATEGORIES,
  PROPERTY_TYPES,
  NAGPUR_LOCALITIES,
  AMENITIES_LIST,
  FURNISHING_OPTIONS,
} from '../../../models/property.model.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const positiveNumber    = () => z.number({ coerce: true }).positive();
const optionalPosNum    = () => z.number({ coerce: true }).positive().nullable().optional();
const optionalBool      = () => z.boolean().nullable().optional();
const optionalString    = (max = 200) => z.string().max(max).nullable().optional();
const optionalEnum      = (values) => z.enum(values).nullable().optional();

// ─── Location schema ──────────────────────────────────────────────────────────
const locationSchema = z.object({
  locality:    z.enum(NAGPUR_LOCALITIES, { errorMap: () => ({ message: 'Select a valid Nagpur locality' }) }),
  subLocality: optionalString(100),
  landmark:    optionalString(100),
  pinCode:     z.string().regex(/^44\d{4}$/, 'Enter a valid Nagpur pin code').nullable().optional(),
  coordinates: z.object({
    type:        z.literal('Point').default('Point'),
    coordinates: z.array(z.number()).length(2, 'Coordinates must be [longitude, latitude]'),
  }),
});

// ─── Details schemas per type ─────────────────────────────────────────────────

/** Shared residential fields (Flat, Builder Floor, Penthouse) */
const residentialBase = z.object({
  bhk:               z.number({ coerce: true }).int().min(1).max(8),
  bathrooms:         z.number({ coerce: true }).int().min(1).max(15),
  balconies:         z.number({ coerce: true }).int().min(0).max(10).nullable().optional(),
  floorNumber:       z.number({ coerce: true }).int().min(0).max(99),
  totalFloors:       z.number({ coerce: true }).int().min(1).max(99),
  carpetArea:        positiveNumber(),
  builtUpArea:       optionalPosNum(),
  superBuiltUpArea:  optionalPosNum(),
  furnishing:        z.enum(FURNISHING_OPTIONS),
  furnishingDetails: optionalString(500),
  facing:            optionalEnum(['N','S','E','W','NE','NW','SE','SW']),
  ageOfProperty:     optionalEnum(['New','1-3 yrs','3-5 yrs','5-10 yrs','10+ yrs']),
  propertyAgeYears:  optionalPosNum(),
  floorType:         optionalEnum(['Marble','Vitrified','Wooden','Granite','Ceramic']),
  waterSupply:       optionalEnum(['Municipal','Borewell','Both']),
  electricityStatus: optionalEnum(['Metered','Non-metered','Pre-paid']),
  overlooking:       z.array(z.enum(['Garden','Pool','Main Road','Park'])).optional(),
  societyName:       optionalString(100),
  reraRegistered:    optionalBool(),
  reraNumber:        optionalString(20),
});

const villaBase = z.object({
  bhk:               z.number({ coerce: true }).int().min(1).max(8),
  bathrooms:         z.number({ coerce: true }).int().min(1).max(15),
  numberOfFloors:    z.string().max(20),
  plotArea:          positiveNumber(),
  builtUpArea:       positiveNumber(),
  carpetArea:        optionalPosNum(),
  furnishing:        z.enum(FURNISHING_OPTIONS),
  furnishingDetails: optionalString(500),
  facing:            optionalEnum(['N','S','E','W','NE','NW','SE','SW']),
  parkingSlots:      z.number({ coerce: true }).int().min(0).max(10),
  hasGarden:         optionalBool(),
  cornerProperty:    optionalBool(),
  gatedSociety:      optionalBool(),
  independentEntry:  optionalBool(),
  roadWidth:         optionalPosNum(),
  waterSupply:       optionalEnum(['Municipal','Borewell','Both']),
  floorType:         optionalEnum(['Marble','Vitrified','Wooden','Granite']),
  propertyAgeYears:  optionalPosNum(),
  reraRegistered:    optionalBool(),
  reraNumber:        optionalString(20),
  societyName:       optionalString(100),
  petFriendly:       optionalBool(),
  nonVegAllowed:     optionalBool(),
});

const penthouseExtra = z.object({
  terraceArea:  optionalPosNum(),
  privateLift:  optionalBool(),
  isDuplex:     optionalBool(),
  servantRoom:  optionalBool(),
  privatePool:  optionalBool(),
});

const builderFloorExtra = z.object({
  totalUnitsInBuilding: optionalPosNum(),
  floorOwnershipType:   optionalEnum(['Individual','Shared','Builder-owned']),
  stiltParking:         optionalBool(),
});

const commercialOfficeBase = z.object({
  carpetArea:       positiveNumber(),
  builtUpArea:      optionalPosNum(),
  superBuiltUpArea: optionalPosNum(),
  floorNumber:      z.number({ coerce: true }).int().min(0).max(99),
  totalFloors:      optionalPosNum(),
  furnishing:       z.enum(['Bare Shell','Warm Shell','Semi-Furnished','Fully Furnished']),
  washrooms:        z.number({ coerce: true }).int().min(1).max(10),
  cabinCount:       optionalPosNum(),
  openDesks:        optionalPosNum(),
  hasPantry:        optionalBool(),
  itReady:          optionalBool(),
  conferenceRoom:   optionalBool(),
  receptionArea:    optionalBool(),
  centralAC:        optionalBool(),
  officeFireSafety: optionalBool(),
  dgBackup:         optionalBool(),
  propertyAgeYears: optionalPosNum(),
  ownershipType:    optionalEnum(['Freehold','Leasehold']),
});

const shopBase = z.object({
  carpetArea:     positiveNumber(),
  builtUpArea:    optionalPosNum(),
  shopFloor:      z.enum(['Lower Ground','Ground','1st','2nd','3rd+']),
  frontage:       optionalPosNum(),
  depth:          optionalPosNum(),
  ceilingHeight:  optionalPosNum(),
  mainRoadFacing: optionalBool(),
  cornerShop:     optionalBool(),
  mezzanineFloor: optionalBool(),
  hasWashroom:    optionalBool(),
  footfallRating: optionalEnum(['Low','Medium','High','Premium']),
  suitableFor:    z.array(z.enum(['Retail','Food','Pharmacy','Showroom','Office','Clinic'])).optional(),
  propertyAgeYears: optionalPosNum(),
  ownershipType:  optionalEnum(['Freehold','Leasehold']),
});

const showroomBase = z.object({
  showroomArea:           positiveNumber(),
  numberOfShowroomFloors: optionalPosNum(),
  frontage:               optionalPosNum(),
  ceilingHeight:          optionalPosNum(),
  glassFront:             optionalBool(),
  parkingAvailable:       z.boolean(),
  acInstalled:            optionalBool(),
  mainRoadFacing:         optionalBool(),
  propertyAgeYears:       optionalPosNum(),
  ownershipType:          optionalEnum(['Freehold','Leasehold']),
});

const warehouseBase = z.object({
  warehouseArea:       positiveNumber(),
  warehouseHeight:     positiveNumber(),
  truckAccess:         z.boolean(),
  numberOfDocks:       optionalPosNum(),
  floorLoadCapacity:   optionalString(50),
  openYardArea:        optionalPosNum(),
  powerLoad:           optionalPosNum(),
  waterSupplyWarehouse: optionalBool(),
  officeSpaceInside:   optionalBool(),
  midc:                optionalBool(),
  propertyAgeYears:    optionalPosNum(),
  ownershipType:       optionalEnum(['Freehold','Leasehold']),
});

const residentialPlotBase = z.object({
  plotAreaSqFt:  positiveNumber(),
  plotLength:    optionalPosNum(),
  plotWidth:     optionalPosNum(),
  facing:        optionalEnum(['N','S','E','W','NE','NW','SE','SW']),
  roadWidth:     optionalPosNum(),
  boundaryWall:  optionalBool(),
  gatedLayout:   optionalBool(),
  cornerPlot:    optionalBool(),
  approvedBy:    z.array(z.enum(['NIT','NMC','NMRDA','MHADA','Private Layout'])).optional(),
  zoneType:      optionalEnum(['Residential','Mixed Use']),
  fsiAvailable:  optionalPosNum(),
  ownershipType: optionalEnum(['Freehold','Leasehold']),
});

const agriLandBase = z.object({
  areaAcres:         positiveNumber(),
  waterSource:       z.array(z.enum(['Well','Borewell','Canal','River','None'])).optional(),
  roadAccess:        z.boolean(),
  roadType:          optionalEnum(['Tar Road','Concrete','Mud','Kachcha']),
  fencing:           optionalBool(),
  treesPlantation:   optionalString(100),
  irrigationType:    optionalEnum(['Drip','Sprinkler','Canal','Flood','None']),
  electricityLand:   optionalBool(),
  distanceFromCity:  optionalPosNum(),
  sevenTwelveExtract: optionalBool(),
  soilType:          optionalEnum(['Black','Red','Alluvial','Mixed']),
  ownershipType:     z.enum(['Individual','Joint','Family']),
});

const naPlotBase = z.object({
  naOrderStatus: z.enum(['NA Order Received','Applied','Not Applied']),
  naOrderNumber: z.string().max(50).nullable().optional(),
  plotAreaSqFt:  positiveNumber(),
  plotLength:    optionalPosNum(),
  plotWidth:     optionalPosNum(),
  facing:        optionalEnum(['N','S','E','W','NE','NW','SE','SW']),
  approvedBy:    z.array(z.enum(['NIT','NMC','NMRDA','Collector'])).optional(),
  zoneType:      optionalEnum(['Residential','Commercial','Mixed Use','Industrial']),
  roadWidth:     optionalPosNum(),
  roadAccess:    z.boolean(),
  boundaryWall:  optionalBool(),
  fsiAvailable:  optionalPosNum(),
  sevenTwelveExtract: optionalBool(),
  ownershipType: optionalEnum(['Freehold','Leasehold']),
}).refine(
  (d) => d.naOrderStatus !== 'NA Order Received' || !!d.naOrderNumber,
  { message: 'NA Order Number is required when status is "NA Order Received"', path: ['naOrderNumber'] }
);

// ─── Pricing schemas per category ─────────────────────────────────────────────
const resalePricing = z.object({
  totalPrice:         positiveNumber(),
  pricePerSqft:       optionalPosNum(),
  priceNegotiable:    optionalBool(),
  possessionTimeline: z.enum(['Immediate','Within 1 month','1-3 months','3-6 months']),
  brokerage:          optionalString(50),
});

const rentalPricing = z.object({
  monthlyRent:       positiveNumber(),
  annualLease:       optionalPosNum(),
  securityDeposit:   positiveNumber(),
  maintenance:       z.number({ coerce: true }).min(0).nullable().optional(),
  availableFrom:     z.coerce.date(),
  preferredTenants:  z.array(z.enum(['Family','Bachelor Male','Bachelor Female','Company','Any'])).optional(),
  leaseDuration:     optionalEnum(['11 months','1 year','2 years','3 years','5 years','10+ years','Flexible']),
  lockInPeriod:      optionalEnum(['None','3 months','6 months','1 year']),
  rentNegotiable:    optionalBool(),
  brokerage:         optionalString(50),
});

const newPricing = z.object({
  startingPrice:      positiveNumber(),
  pricePerSqft:       optionalPosNum(),
  priceRange:         optionalString(50),
  bookingAmount:      optionalPosNum(),
  gstApplicable:      optionalBool(),
  possessionDate:     z.coerce.date(),
  brokerage:          optionalString(50),
});

// ─── New Project details (extra fields for New category) ──────────────────────
const newProjectDetails = z.object({
  projectName:         z.string().max(100),
  builderName:         z.string().max(100),
  reraNumber:          z.string().regex(/^P52100\d{6}$/, 'Enter a valid MahaRERA number (P52100XXXXXX)'),
  reraValidityDate:    z.coerce.date().nullable().optional(),
  constructionStatus:  z.enum(['Pre-launch','Under Construction','Ready to Move','Ready','Partially Ready','Under Development']),
  possessionDate:      z.coerce.date(),
  totalUnitsInProject: optionalPosNum(),
  unitsAvailable:      z.number({ coerce: true }).min(0).nullable().optional(),
  towerWing:           optionalString(50),
  approvedBanks:       optionalString(200),
  ccOcReceived:        optionalEnum(['CC Received','OC Received','Both','None','Applied']),
});

// ─── Base property schema ─────────────────────────────────────────────────────
export const basePropertySchema = z.object({
  title:           z.string().min(1).max(100),
  listingCategory: z.enum(LISTING_CATEGORIES),
  propertyType:    z.enum(PROPERTY_TYPES),
  description:     z.string().min(10).max(2000),
  brokerId:        z.string().min(1, 'Broker (User) ID is required'),
  location:        locationSchema,
  amenities:       z.array(z.enum(AMENITIES_LIST)).optional().default([]),
  adminNotes:      z.string().max(500).nullable().optional(),
});

/**
 * Full create/update schema — validates details + pricing based on
 * (listingCategory × propertyType). Called in the controller after
 * parsing req.body.
 *
 * Returns { error } if invalid, { data } if valid.
 */
export function validatePropertyPayload(payload) {
  const base = basePropertySchema.safeParse(payload);
  if (!base.success) {
    return {
      error: base.error.issues.map((i) => i.message).join('; '),
    };
  }

  const { listingCategory, propertyType } = base.data;
  const details  = payload.details  || {};
  const pricing  = payload.pricing  || {};

  // ── Validate Details ──────────────────────────────────────────────────────
  let detailsResult;
  switch (propertyType) {
    case 'Flat/Apartment':
    case 'Builder Floor':
    case 'Penthouse': {
      let schema = residentialBase;
      if (propertyType === 'Penthouse')     schema = schema.merge(penthouseExtra);
      if (propertyType === 'Builder Floor') schema = schema.merge(builderFloorExtra);
      // Rental/New adds extra fields
      if (listingCategory !== 'Resale') {
        schema = schema.merge(z.object({ petFriendly: optionalBool(), nonVegAllowed: optionalBool() }));
      }
      if (listingCategory === 'Resale') {
        schema = schema.merge(z.object({
          ownershipType: z.enum(['Freehold','Leasehold','Co-operative Society','Power of Attorney']),
          readyToMove: z.boolean(),
        }));
      }
      if (listingCategory === 'New') {
        schema = schema.merge(newProjectDetails);
      }
      detailsResult = schema.safeParse(details);
      break;
    }
    case 'Villa/Independent House': {
      let schema = villaBase;
      if (listingCategory === 'Resale') {
        schema = schema.merge(z.object({
          ownershipType: z.enum(['Freehold','Leasehold','Power of Attorney']),
          readyToMove: z.boolean(),
        }));
      }
      if (listingCategory === 'New') {
        schema = schema.merge(newProjectDetails.omit({ approvedBanks: true, ccOcReceived: true }))
          .merge(z.object({ totalVillasInProject: optionalPosNum() }));
      }
      detailsResult = schema.safeParse(details);
      break;
    }
    case 'Office Space':
      detailsResult = (listingCategory === 'New'
        ? commercialOfficeBase.merge(newProjectDetails)
        : commercialOfficeBase
      ).safeParse(details);
      break;
    case 'Shop':
      detailsResult = (listingCategory === 'New'
        ? shopBase.merge(newProjectDetails)
        : shopBase
      ).safeParse(details);
      break;
    case 'Showroom':
      detailsResult = (listingCategory === 'New'
        ? showroomBase.merge(newProjectDetails)
        : showroomBase
      ).safeParse(details);
      break;
    case 'Warehouse/Godown': {
      let schema = warehouseBase;
      if (listingCategory === 'New') {
        // Warehouse/New — RERA not mandatory
        schema = schema.merge(z.object({
          projectName:        optionalString(100),
          builderName:        optionalString(100),
          constructionStatus: z.enum(['Under Construction','Ready']),
          possessionDate:     z.coerce.date(),
        }));
      }
      detailsResult = schema.safeParse(details);
      break;
    }
    case 'Residential Plot': {
      let schema = residentialPlotBase;
      if (listingCategory === 'New') {
        schema = schema.merge(z.object({
          layoutProjectName:   z.string().max(100),
          builderName:         z.string().max(100),
          reraNumber:          z.string().regex(/^P52100\d{6}$/, 'RERA number is mandatory for new plotted layouts'),
          totalPlotsInLayout:  optionalPosNum(),
          plotsAvailable:      z.number({ coerce: true }).min(0).nullable().optional(),
          developmentStatus:   z.enum(['Under Development','Ready','Partially Ready']),
        }));
      }
      detailsResult = schema.safeParse(details);
      break;
    }
    case 'Agricultural Land':
      detailsResult = agriLandBase.safeParse(details);
      break;
    case 'NA Plot':
      detailsResult = naPlotBase.safeParse(details);
      break;
    default:
      return { error: `Unsupported property type: ${propertyType}` };
  }

  if (!detailsResult.success) {
    return {
      error: 'Details: ' + detailsResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    };
  }

  // ── Validate Pricing ──────────────────────────────────────────────────────
  let pricingResult;
  if (listingCategory === 'Resale') {
    pricingResult = resalePricing.safeParse(pricing);
  } else if (listingCategory === 'Rental') {
    // Agri land uses annual lease
    if (propertyType === 'Agricultural Land') {
      pricingResult = rentalPricing
        .omit({ monthlyRent: true })
        .merge(z.object({ annualLease: positiveNumber() }))
        .safeParse(pricing);
    } else {
      pricingResult = rentalPricing.safeParse(pricing);
    }
  } else {
    pricingResult = newPricing.safeParse(pricing);
  }

  if (!pricingResult.success) {
    return {
      error: 'Pricing: ' + pricingResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    };
  }

  return {
    data: {
      ...base.data,
      details: detailsResult.data,
      pricing: pricingResult.data,
    },
  };
}

// ─── Status update schema ─────────────────────────────────────────────────────
export const updateStatusSchema = z.object({
  status: z.enum(['Draft','Pending','Active','Rejected','Sold','Rented','Inactive']),
  adminNotes:      z.string().max(500).nullable().optional(),
  rejectedReason:  z.string().max(200).nullable().optional(),
});