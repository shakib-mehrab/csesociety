
const express = require("express");
const SSLCommerzPayment = require("sslcommerz-lts");
const { protect } = require("../middleware/authMiddleware");
const Payment = require("../models/Payment");
const JoinRequest = require("../models/ClubJoinRequest"); // Assuming you have a model for join requests
const TempTransaction = require("../models/TempTransaction"); // temp store for linking user
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const store_id = process.env.SSLC_STORE_ID;
const store_passwd = process.env.SSLC_STORE_PASSWORD;
const is_live = false; // true for production

// 1️⃣ INITIATE PAYMENT
router.get("/init", protect, async (req, res) => {
  const { clubId } = req.query;
  if (!clubId) return res.status(400).json({ message: "Missing clubId" });

  const tran_id = `CLUBJOIN_${clubId}_${req.user._id}_${Date.now()}`;

  const data = {
    total_amount: 100, // or club-specific fee
    currency: "BDT",
    tran_id,
    success_url: `${process.env.SERVER_URL}/api/payments/success?clubId=${clubId}`,
    fail_url: `${process.env.SERVER_URL}/api/payments/fail?clubId=${clubId}`,
    cancel_url: `${process.env.SERVER_URL}/api/payments/cancel`,
    ipn_url: `${process.env.SERVER_URL}/api/payments/ipn`,
    shipping_method: "None",
    product_name: "Club Membership",
    product_category: "Membership",
    product_profile: "general",
    cus_name: req.user.name,
    cus_email: req.user.email,
    cus_add1: "N/A",
    cus_city: "N/A",
    cus_country: "Bangladesh",
    cus_phone: req.user.phone || "N/A",
    ship_name: req.user.name,
    ship_add1: "Cumilla",
    ship_add2: "Cumilla",
    ship_city: "Cumilla",
    ship_state: "Cumilla",
    ship_postcode: 3506,
    ship_country: "Bangladesh",
  };
  // console.log('Payment data:', data);

  try {
    // Save temp transaction to match later
    await TempTransaction.create({
      tran_id,
      user: req.user._id,
      club: clubId,
    });

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);
   

    if (apiResponse?.GatewayPageURL) {
      res.json({ GatewayPageURL: apiResponse.GatewayPageURL });
    } else {
      res.status(500).json({ message: "Failed to get payment gateway URL" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Payment init failed", error: err.message });
    console.log(err);
  }
});

// 2️⃣ SUCCESS HANDLER
router.post("/success", async (req, res) => {
  const { clubId } = req.query;
  const { tran_id, val_id } = req.body;

  try {
    // Find transaction info (user + club)
    const temp = await TempTransaction.findOne({ tran_id });
    if (!temp)
      return res.redirect(
        `${process.env.CLIENT_URL}/payment/fail?clubId=${clubId}`
      );

    // Validate payment with SSLCommerz
    const fetch = (await import("node-fetch")).default;
    const verifyResponse = await fetch(
      `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
    );
    const verifyResult = await verifyResponse.json();

    if (
      verifyResult.status !== "VALID" &&
      verifyResult.status !== "VALIDATED"
    ) {
      return res.redirect(
        `${process.env.CLIENT_URL}/payment/fail?clubId=${clubId}`
      );
    }


    // Save payment record
    await Payment.create({
      userId: temp.user,
      amount: verifyResult.amount,
      status: "paid",
      paymentDate: new Date(),
      transactionId: tran_id,
      recordedBy: temp.user,
    });

    // Only create join request if payment is valid and saved
    // await JoinRequest.create({
    //   clubId: temp.club,
    //   userId: temp.user,
    //   status: "pending",
    // });

    // Remove temp transaction
    await TempTransaction.deleteOne({ tran_id });

    // Redirect to frontend
    res.redirect(`${process.env.CLIENT_URL}/payment/success?clubId=${clubId}`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.CLIENT_URL}/payment/fail?clubId=${clubId}`);
  }
});

// 3️⃣ FAIL HANDLER
router.post("/fail", (req, res) => {
  const { clubId } = req.query;
  res.redirect(`${process.env.CLIENT_URL}/payment/fail?clubId=${clubId}`);
});

// 4️⃣ CANCEL HANDLER
router.post("/cancel", (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/clubs`);
});

// Get all payments (for financial management)
router.get("/", protect, async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate('userId', 'name email')
      .populate('eventId', 'title')
      .populate('recordedBy', 'name');
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

module.exports = router;
