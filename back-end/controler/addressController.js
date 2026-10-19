
import Address from "../model/addressModel.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user._id,
    }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { name, phone, street, city, state, pincode } = req.body;

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !street?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required address fields.",
      });
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit mobile number.",
      });
    }

    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 6-digit pincode.",
      });
    }

    const address = await Address.create({
      user: req.user._id,
      name: name.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Address saved successfully.",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save address.",
    });
  }
};
