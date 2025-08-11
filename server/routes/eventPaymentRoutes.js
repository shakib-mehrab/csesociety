const express = require("express");
const SSLCommerzPayment = require("sslcommerz-lts");
const { protect } = require("../middleware/authMiddleware");
const Payment = require("../models/Payment");
const Event = require("../models/Event");
const TempTransaction = require("../models/TempTransaction");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const store_id = process.env.SSLC_STORE_ID;
const store_passwd = process.env.SSLC_STORE_PASSWORD;
const is_live = false; // true for production

// 1️⃣ INITIATE EVENT PAYMENT
router.get("/event/init", protect, async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) return res.status(400).json({ message: "Missing eventId" });

  const event = await Event.findById(eventId).populate('organizer', 'name email');
  if (!event) return res.status(404).json({ message: "Event not found" });

  const tran_id = `EVENTPAY_${eventId}_${req.user._id}_${Date.now()}`;

  const data = {
    total_amount: event.fee || 0,
    currency: "BDT",
    tran_id,
    success_url: `${process.env.SERVER_URL}/api/payments/event/success?eventId=${eventId}`,
    fail_url: `${process.env.SERVER_URL}/api/payments/event/fail?eventId=${eventId}`,
    cancel_url: `${process.env.SERVER_URL}/api/payments/event/cancel`,
    ipn_url: `${process.env.SERVER_URL}/api/payments/event/ipn`,
    shipping_method: "None",
    product_name: event.title,
    product_category: "Event",
    product_profile: "general",
    cus_name: req.user.name,
    cus_email: req.user.email,
    cus_add1: "N/A",
    cus_city: "N/A",
    cus_country: "Bangladesh",
    cus_phone: req.user.phone || "N/A",
    ship_name: req.user.name,
    ship_add1: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: 3506,
    ship_country: "Bangladesh",
  };

  try {
    await TempTransaction.create({
      tran_id,
      user: req.user._id,
      event: eventId,
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
    res.status(500).json({ message: "Payment init failed", error: err.message });
  }
});

// 2️⃣ SUCCESS HANDLER
router.post("/event/success", async (req, res) => {
  const { eventId } = req.query;
  const { tran_id, val_id } = req.body;

  try {
    const temp = await TempTransaction.findOne({ tran_id });
    if (!temp)
      return res.redirect(`${process.env.CLIENT_URL}/event/payment/fail?eventId=${eventId}`);

    // Validate payment with SSLCommerz
    const fetch = (await import("node-fetch")).default;
    const verifyResponse = await fetch(
      `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
    );
    const verifyResult = await verifyResponse.json();

    if (verifyResult.status !== "VALID" && verifyResult.status !== "VALIDATED") {
      return res.redirect(`${process.env.CLIENT_URL}/event/payment/fail?eventId=${eventId}`);
    }

    // Save payment record
    await Payment.create({
      userId: temp.user,
      eventId: temp.event,
      amount: verifyResult.amount,
      status: "paid",
      paymentDate: new Date(),
      transactionId: tran_id,
      recordedBy: temp.user,
    });

    // Add user to event's registeredUsers if not already present
    const event = await Event.findById(temp.event);
    if (event && !event.registeredUsers.includes(temp.user)) {
      event.registeredUsers.push(temp.user);
      await event.save();
    }

    await TempTransaction.deleteOne({ tran_id });
    res.redirect(`${process.env.CLIENT_URL}/event/payment/success?eventId=${eventId}`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.CLIENT_URL}/event/payment/fail?eventId=${eventId}`);
  }
});

// 3️⃣ FAIL HANDLER
router.post("/event/fail", (req, res) => {
  const { eventId } = req.query;
  res.redirect(`${process.env.CLIENT_URL}/event/payment/fail?eventId=${eventId}`);
});

// 4️⃣ CANCEL HANDLER
router.post("/event/cancel", (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/events`);
});

module.exports = router;
