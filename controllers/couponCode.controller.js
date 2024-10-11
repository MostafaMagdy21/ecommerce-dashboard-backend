const CouponCode = require("../models/couponCode");

// Create a new coupon code
async function createCoupon(req, res) {
  const {
    couponCodeName,
    discount,
    discountStatus,
    originalPrice,
    finalPrice,
    startDate,
    endDate,
  } = req.body;

  if (
    !couponCodeName ||
    !discount ||
    !discountStatus ||
    !originalPrice ||
    !finalPrice ||
    !startDate ||
    !endDate
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const couponCode = new CouponCode({
      couponCodeName,
      discount,
      discountStatus,
      originalPrice,
      finalPrice,
      startDate,
      endDate,
    });
    await couponCode.save();
    res.status(201).json(couponCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a single coupon code by ID
async function getSingleCoupon(req, res) {
  const { id } = req.params;

  try {
    const couponCode = await CouponCode.findById(id);
    if (!couponCode)
      return res.status(404).json({ message: "Coupon code not found" });
    res.status(200).json(couponCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all coupon codes
async function getAllCoupon(req, res) {
  try {
    const couponCodes = await CouponCode.find();
    res.status(200).json(couponCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a coupon code
async function updateCoupon(req, res) {
  const { id } = req.params;
  const {
    couponCodeName,
    discount,
    discountStatus,
    originalPrice,
    finalPrice,
    startDate,
    endDate,
  } = req.body;

  try {
    const couponCode = await CouponCode.findById(id);
    if (!couponCode)
      return res.status(404).json({ message: "Coupon code not found" });

    couponCode.couponCodeName = couponCodeName || couponCode.couponCodeName;
    couponCode.discount = discount || couponCode.discount;
    couponCode.discountStatus = discountStatus || couponCode.discountStatus;
    couponCode.originalPrice = originalPrice || couponCode.originalPrice;
    couponCode.finalPrice = finalPrice || couponCode.finalPrice;
    couponCode.startDate = startDate || couponCode.startDate;
    couponCode.endDate = endDate || couponCode.endDate;

    await couponCode.save();
    res.status(200).json(couponCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a coupon code
async function deleteCoupon(req, res) {
  const { id } = req.params;

  try {
    const couponCode = await CouponCode.findByIdAndDelete(id);
    if (!couponCode)
      return res.status(404).json({ message: "Coupon code not found" });
    res.status(200).json({ message: "Coupon code deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createCoupon,
  getSingleCoupon,
  getAllCoupon,
  updateCoupon,
  deleteCoupon,
};
