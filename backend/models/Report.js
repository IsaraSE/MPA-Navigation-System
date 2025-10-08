import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['hotspot', 'pollution'],
            required: true,
        },

        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
                required: true
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
                validate: {
                    validator: function(coords) {
                        return coords.length === 2 && 
                               coords[0] >= -180 && coords[0] <= 180 &&
                               coords[1] >= -90 && coords[1] <= 90;
                    },
                    message: 'Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90.'
                }
            }
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        // For wildlife hotspot reports
        species: {
            type: String,
            trim: true,
            maxlength: 100,
            required: function() {
                return this.type === 'hotspot';
            }
        },

        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium',
            required: true
        },

        // Optional image URL
        imageUrl: {
            type: String,
            trim: true
        },

        // User who submitted the report
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        // Additional metadata
        vesselInfo: {
            vesselName: String,
            vesselType: String
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { 
        timestamps: true 
    }
);

// Create geospatial index for location-based queries
reportSchema.index({ location: '2dsphere' });

// Index for filtering by type and severity
reportSchema.index({ type: 1, severity: 1 });

// Index for user's reports
reportSchema.index({ submittedBy: 1, createdAt: -1 });

// Virtual for formatted location
reportSchema.virtual('latitude').get(function() {
    return this.location.coordinates[1];
});

reportSchema.virtual('longitude').get(function() {
    return this.location.coordinates[0];
});

// Clean JSON response
reportSchema.methods.toJSON = function() {
    const report = this.toObject({ virtuals: true });
    delete report.__v;
    return report;
};

export default mongoose.model('Report', reportSchema);

