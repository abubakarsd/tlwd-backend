const Settings = require('../models/Settings');
const { successResponse, errorResponse } = require('../utils/response');

exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.find();
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        successResponse(res, settingsObj);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const updates = req.body; // Expecting { key: value, ... }

        const updatePromises = Object.keys(updates).map(key => {
            return Settings.findOneAndUpdate(
                { key },
                { key, value: updates[key] },
                { upsert: true, new: true }
            );
        });

        await Promise.all(updatePromises);

        successResponse(res, null, 'Settings updated successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
