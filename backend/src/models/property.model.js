import mongoose from 'mongoose';
const propertySchema = new mongoose.Schema({
  // --------------------------------------------------------
  // 1. BASIC INFORMATION (Common to ALL)
  // --------------------------------------------------------
  basicInfo: {
    propertyTitle: { type: String, required: true, maxlength: 100 }, // e.g. '2BHK Flat in Manish Nagar'
    listingCategory: { 
      type: String, 
      required: true, 
      enum: ['Resale', 'Rental', 'New'] 
    },
    propertyType: { 
      type: String, 
      required: true, 
      enum: [
        'Flat/Apartment', 'Villa/Independent House', 'Builder Floor', 
        'Penthouse', 'Office Space', 'Shop', 'Showroom', 
        'Warehouse/Godown', 'Residential Plot', 'Agricultural Land', 'NA Plot'
      ] 
    },
    description: { type: String, required: true, minlength: 10, maxlength: 2000 }
  },

  // --------------------------------------------------------
  // 2. LOCATION DETAILS (Nagpur-Focused)
  // --------------------------------------------------------
  location: {
    city: { type: String, default: 'Nagpur', immutable: true }, // Platform is Nagpur-only
    locality: { type: String, required: true }, // Will map to the 25 pre-loaded localities
    subLocality: { type: String, maxlength: 100 },
    landmark: { type: String, maxlength: 100 },
    pinCode: { 
      type: Number, 
      min: 440001, 
      max: 440037 // Nagpur pin codes
    },
    coordinates: {
      type: { type: String, default: 'Point' }, // GeoJSON format for map pins
      coordinates: { type: [Number], required: true } // [longitude, latitude]
    }
  },

  // --------------------------------------------------------
  // 3. PROPERTY DETAILS (Dynamic based on Type)
  // --------------------------------------------------------
  details: {
    // Residential Specs
    bhk: { type: Number, min: 1, max: 8 }, 
    bathrooms: { type: Number, min: 1, max: 15 },
    balconies: { type: Number, min: 0, max: 10 },
    furnishing: { type: String, enum: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished', 'Bare Shell', 'Warm Shell'] },
    furnishingDetails: { type: String, maxlength: 500 }, // List of items
    
    // Floor Details
    floorNumber: { type: Number, min: 0, max: 99 }, // 0 = Ground
    totalFloors: { type: Number, min: 1, max: 99 },
    numberOfFloors: { type: String }, // For Villas (e.g., G+1)
    
    // Area Measurements
    carpetAreaSqFt: { type: Number, min: 1 },
    builtUpAreaSqFt: { type: Number, min: 1 },
    superBuiltUpAreaSqFt: { type: Number, min: 1 },
    plotAreaSqFt: { type: Number, min: 1 },
    agriculturalAreaAcres: { type: Number, min: 0.1 },

    // Physical Attributes
    facing: { type: String, enum: ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'] },
    propertyAgeYears: { type: Number, min: 0 },
    ownershipType: { type: String, enum: ['Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney', 'Individual', 'Joint', 'Family'] },
    readyToMove: { type: Boolean },
    
    // RERA & Project (Crucial for Nagpur Compliance)
    reraRegistered: { type: Boolean },
    reraNumber: { 
      type: String, 
      match: /^P52100\d{6}$/ // Valid MahaRERA format
    },
    projectName: { type: String, maxlength: 100 },
    developerName: { type: String, maxlength: 100 },
    constructionStatus: { type: String, enum: ['Pre-launch', 'Under Construction', 'Ready to Move', 'Ready', 'Partially Ready', 'Under Development'] },
    
    // Commercial / Land Specifics
    frontageFt: { type: Number, min: 1 },
    ceilingHeightFt: { type: Number, min: 1 },
    truckAccess: { type: Boolean },
    naOrderStatus: { type: String, enum: ['Received', 'Applied', 'Not Applied'] },
    roadAccess: { type: Boolean }
  },

  // --------------------------------------------------------
  // 4. PRICING & AVAILABILITY (Dynamic based on Category)
  // --------------------------------------------------------
  pricing: {
    // Resale & New Pricing
    totalPrice: { type: Number, min: 1 }, // Used for Resale
    startingPrice: { type: Number, min: 1 }, // Used for New Projects
    bookingAmount: { type: Number, min: 1 },
    gstApplicable: { type: Boolean },
    priceNegotiable: { type: Boolean },
    
    // Rental Pricing
    monthlyRent: { type: Number, min: 1 },
    securityDeposit: { type: Number, min: 1 },
    maintenanceMonthly: { type: Number, min: 0 },
    rentNegotiable: { type: Boolean },
    
    // Availability Details
    possessionTimeline: { type: String, enum: ['Immediate', 'Within 1 month', '1-3 months', '3-6 months'] },
    possessionDate: { type: Date }, // For New Projects (Future Date)
    availableFrom: { type: Date }, // For Rentals
    leaseDuration: { type: String },
    lockInPeriod: { type: String },
    preferredTenants: [{ type: String, enum: ['Family', 'Bachelor Male', 'Bachelor Female', 'Company', 'Any'] }],
    brokerage: { type: String, maxlength: 50 } // Shown to customers
  },

  // --------------------------------------------------------
  // 5. MEDIA & AMENITIES
  // --------------------------------------------------------
  media: {
    photos: { 
      type: [String], 
      required: true, 
      validate: [arrayLimit, 'Upload 1 to 15 property photos'] // Max 15 photos rule
    },
    video: { type: String } // Max 50MB URL
  },
  
  amenities: [{
    type: String, 
    enum: [
      'Parking (2-wheeler)', 'Parking (4-wheeler)', 'Lift/Elevator', '24x7 Security', 
      'CCTV Surveillance', 'Gym/Fitness Centre', 'Swimming Pool', 'Garden/Park', 
      "Children's Play Area", 'Clubhouse', 'Power Backup', 'Rainwater Harvesting', 
      'Fire Safety', 'Intercom', 'Visitor Parking', 'Water Storage', 'Piped Gas', 
      'Sewage Treatment'
    ]
  }],
  
  // --------------------------------------------------------
  // 6. METADATA
  // --------------------------------------------------------
  brokerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Draft', 'Active', 'Sold', 'Rented', 'Inactive'], default: 'Draft' }

}, { timestamps: true }); // Auto-adds createdAt and updatedAt

// GeoJSON Indexing for location-based searching
propertySchema.index({ "location.coordinates": "2dsphere" });

// Helper to limit photo array
function arrayLimit(val) {
  return val.length > 0 && val.length <= 15;
}

// --------------------------------------------------------
// CONDITIONAL VALIDATION (Pre-save Hooks)
// --------------------------------------------------------
propertySchema.pre('save', function(next) {
  // RERA Enforcement: Mandatory for "New" category projects
  if (this.basicInfo.listingCategory === 'New' && !this.details.reraNumber) {
    next(new Error('RERA number is mandatory for all new projects.'));
  }
  
  // Validation for Resale & Rental RERA Toggle
  if (this.details.reraRegistered === true && !this.details.reraNumber) {
    next(new Error('RERA number is required if property is marked as RERA Registered.'));
  }
  
  // Pricing validaton logic
  if (this.basicInfo.listingCategory === 'Rental' && !this.pricing.monthlyRent) {
    next(new Error('Monthly rent is required for Rental properties.'));
  }
  
  if (this.basicInfo.listingCategory === 'Resale' && !this.pricing.totalPrice) {
    next(new Error('Total price is required for Resale properties.'));
  }

  next();
});

const Property = mongoose.model('Property', propertySchema);
export default Property;