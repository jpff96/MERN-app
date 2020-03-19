const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validateProfileInput = require("../../validation/profile");

// Load Profile Model
const Profile = require("../../models/Profile");
//Load User model
const User = require("../../models/User");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public

router.get("/test", (req, res) => {
  res.json({
    msg: "Profile works"
  });
});

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"]) //This load the user name and avatar into the profile.
      .then(profile => {
        if (!profile) {
          errors.nonProfile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile/addEditProfile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    req.body.handle ? (profileFields.handle = req.body.handle) : "";
    req.body.company ? (profileFields.company = req.body.company) : "";
    req.body.webSite ? (profileFields.webSite = req.body.webSite) : "";
    req.body.location ? (profileFields.location = req.body.location) : "";
    req.body.eductaion ? (profileFields.eductaion = req.body.eductaion) : "";
    req.body.bio ? (profileFields.bio = req.body.bio) : "";
    req.body.status ? (profileFields.status = req.body.status) : "";
    req.body.githubUserName
      ? (profileFields.githubUserName = req.body.githubUserName)
      : "";
    typeof (req.body.skills !== "undefined")
      ? (profileFields.skills = req.body.skills.split(","))
      : "";

    //SOCIAL
    profileFields.social = {};
    req.body.youtube ? (profileFields.social = req.body.youtube) : "";
    req.body.facebook ? (profileFields.social = req.body.facebook) : "";
    req.body.twitter ? (profileFields.social = req.body.twitter) : "";
    req.body.instagram ? (profileFields.social = req.body.instagram) : "";
    req.body.linkedin ? (profileFields.social = req.body.linkedin) : "";

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

module.exports = router;
