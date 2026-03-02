import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    maintenanceMessage: {
        type: String,
        default: 'SkillProof is currently undergoing scheduled maintenance. We will be back soon!'
    },
    announcement: {
        enabled: { type: Boolean, default: false },
        message: { type: String, default: 'Important: Scheduled maintenance is coming up soon. Please save your work.' },
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// We only want one settings document in the collection
settingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

export default mongoose.model('Settings', settingsSchema);
