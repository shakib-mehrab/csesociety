const asyncHandler = require("express-async-handler");
const Club = require("../models/Club");
const ClubJoinRequest = require("../models/ClubJoinRequest");
const User = require("../models/User");
// @desc    Delete a club join request
// @route   DELETE /api/clubs/requests/:requestId
// @access  Private/Admin/Super_Admin/Coordinator
const deleteJoinRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.requestId;
  const request = await ClubJoinRequest.findById(requestId);
  if (!request) {
    res.status(404);
    throw new Error("Join request not found");
  }
  // Only allow deletion if not already approved (optional: you can allow deletion of any request)
  if (request.status === "approved") {
    // Remove user from club members and user's clubsJoined if request is approved and being deleted
    const club = await Club.findById(request.clubId);
    if (club) {
      club.members = club.members.filter(
        (memberId) => memberId.toString() !== request.userId.toString()
      );
      await club.save();
    }
    const user = await User.findById(request.userId);
    if (user) {
      user.clubsJoined = user.clubsJoined.filter(
        (clubId) => clubId.toString() !== request.clubId.toString()
      );
      await user.save();
    }
  }
  // await request.deleteOne(); // previous logic to delete 
   await ClubJoinRequest.findByIdAndDelete(requestId); //updated logic from gpt
  res.json({ message: "Join request deleted" });
});

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private/Super_Admin
const createClub = asyncHandler(async (req, res) => {
  const { name, description, coordinator, contactEmail, logo } = req.body;

  // Create club
  const club = new Club({
    name,
    description,
    coordinator,
    contactEmail,
    logo,
  });
  const createdClub = await club.save();

  // Update coordinator's role and clubsJoined
  const user = await User.findById(coordinator);
  if (user) {
    user.role = "coordinator";
    if (!user.clubsJoined.some((id) => id.equals(club._id))) {
      user.clubsJoined.push(club._id);
    }
    await user.save();
  }

  res.status(201).json(createdClub);
});
// @desc    Get all club join requests (for super admin)
// @route   GET /api/clubs/requests
// @access  Private/Super_Admin
const getAllJoinRequests = asyncHandler(async (req, res) => {
  const requests = await ClubJoinRequest.find({ status: "pending" })
    .populate("userId", "name email studentId")
    .populate("clubId", "name");
  res.json(requests);
});

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getAllClubs = asyncHandler(async (req, res) => {
  const clubs = await Club.find({})
    .populate("coordinator", "name email studentId profilePicture")
    .populate("subCoordinators", "name email studentId profilePicture")
    .populate("members", "name email studentId");
  res.json(clubs);
});

// @desc    Get club by ID
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id)
    .populate("coordinator", "name email studentId profilePicture")
    .populate("subCoordinators", "name email studentId profilePicture")
    .populate("members", "name email studentId");
  if (club) {
    res.json(club);
  } else {
    res.status(404);
    throw new Error("Club not found");
  }
});

// @desc    Update a club
// @route   PUT /api/clubs/:id
// @access  Private/Super_Admin_Admin
const updateClub = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    coordinator,
    subCoordinators,
    contactEmail,
    logo,
  } = req.body;

  const club = await Club.findById(req.params.id);

  if (club) {
    // Club admin can only update certain fields
    if (
      (req.user.role === "admin" || req.user.role === "coordinator") &&
      club.coordinator.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Not authorized to update this club");
    }

    club.name = name || club.name;
    club.description = description || club.description;
    club.logo = logo || club.logo;
    club.contactEmail = contactEmail || club.contactEmail;

    if (req.user.role === "super_admin") {
      club.coordinator = coordinator || club.coordinator;
    }

    if (["admin", "coordinator", "super_admin"].includes(req.user.role)) {
      club.subCoordinators = subCoordinators || club.subCoordinators;
    }

    const updatedClub = await club.save();
    res.json(updatedClub);
  } else {
    res.status(404);
    throw new Error("Club not found");
  }
});

// @desc    Delete a club
// @route   DELETE /api/clubs/:id
// @access  Private/Super_Admin
const deleteClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);

  if (club) {
    await club.deleteOne();
    res.json({ message: "Club removed" });
  } else {
    res.status(404);
    throw new Error("Club not found");
  }
});

// @desc    Send a request to join a club (requires payment)
// @route   POST /api/clubs/:id/join
// @access  Private/Member
const sendJoinRequest = asyncHandler(async (req, res) => {
  const clubId = req.params.id;
  const userId = req.user._id;

  const club = await Club.findById(clubId);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  const existingRequest = await ClubJoinRequest.findOne({ userId, clubId });
  if (existingRequest) {
    res.status(400);
    throw new Error("Join request already sent");
  }

  const isMember = club.members.includes(userId);
  if (isMember) {
    res.status(400);
    throw new Error("Already a member of this club");
  }

  // TODO: Integrate SSLCommerz payment verification here
  // Example: if (!await verifyPayment(userId, clubId)) { ... }

  const joinRequest = new ClubJoinRequest({
    userId,
    clubId,
  });

  await joinRequest.save();
  res.status(201).json({ message: "Join request sent successfully" });
});

// @desc    Process a club join request
// @route   PUT /api/clubs/requests/:requestId
// @access  Private/Admin
const processJoinRequest = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  const requestId = req.params.requestId;

  const request = await ClubJoinRequest.findById(requestId);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  const club = await Club.findById(request.clubId);
  if (
    club.coordinator.toString() !== req.user._id.toString() &&
    req.user.role !== "super_admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to process requests for this club");
  }

  request.status = status;
  request.processedAt = Date.now();
  request.processedBy = req.user._id;

  if (status === "approved") {
    club.members.push(request.userId);
    await club.save();
    const user = await User.findById(request.userId);
    user.clubsJoined.push(request.clubId);
    await user.save();
  }

  await request.save();
  res.json({ message: `Request ${status}` });
});

// @desc    Get club members
// @route   GET /api/clubs/:id/members
// @access  Private/Admin_Super_Admin
const getClubMembers = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id).populate(
    "members",
    "name email studentId"
  );
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }
  res.json(club.members);
});

module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
  sendJoinRequest,
  processJoinRequest,
  getClubMembers,
  getAllJoinRequests,
  deleteJoinRequest,
};
