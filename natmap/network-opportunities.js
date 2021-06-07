const findInMembers = require("../helpers/findInMembers");

module.exports = function modifyNetworkOpportunities(NetworkOpportunities) {
  const AnnualDeferralValue = findInMembers(NetworkOpportunities.members, [
    "Annual Deferral Value",
  ]);
  AnnualDeferralValue.url =
    "https://network-opportunity-maps.s3-ap-southeast-2.amazonaws.com/constraints/surge/deferral_values_timeseries.csv";
  const deferralStyle = AnnualDeferralValue.styles[0];
  deferralStyle.color.binMaximums = [100, 200, 300, 400, 500];
  const deferraldefaultStyle = AnnualDeferralValue.defaultStyle;
  deferraldefaultStyle.color.binColors[0] = "rgba(255,255,255,0.0)";

  const AvailableDistributionCapacity = findInMembers(
    NetworkOpportunities.members,
    ["Available Distribution Capacity"]
  );
  AvailableDistributionCapacity.styles = [
    {
      id: "available_capacity",
      color: {
        binMaximums: [-15, -9, -3, 3, 9, 15],
      },
    },
  ];

  const PeakDayCapacity = findInMembers(NetworkOpportunities.members, [
    "Peak Day Available Capacity",
  ]);
  PeakDayCapacity.styles = [
    {
      id: "percent_available",
      color: {
        binMaximums: [15, 30, 45, 60, 75, 90, 105, 120],
      },
    },
  ];
};
