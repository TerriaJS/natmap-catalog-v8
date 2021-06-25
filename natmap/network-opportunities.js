const _ = require("lodash");
const findInMembers = require("../helpers/findInMembers");

const deferralTemplate = `<dl class='isf-info'>
  <dt>Asset name</dt><dd>{{asset_name}}</dd>
  <dt>Asset type</dt><dd>{{network_element_str}}</dd>
  <dt>Annual Deferral Value in {{year}} ($/kVAyr)</dt><dd>{{deferral_value}}</dd>

</dl>

<br/>
<br/>

<table class='isf-table'>
  <tr>
    <th>Asset name</th>
    <th>Asset type</th>
    <th>Deferrable<br/>investment (m$)</th>
    <th>Investment<br/>year</th>
  </tr>
{{#deferral_value_asset_chain}}
  <tr>
    <td>{{asset_name}}</td>
    <td>{{network_element}}</td>
    <td>{{deferrable_invest}} {{^deferrable_invest}} 0 {{/deferrable_invest}}</td>
    <td>{{invest_year}} {{^invest_year}} None {{/invest_year}}</td>
  </tr>
{{/deferral_value_asset_chain}}
</table>

<br/>

<center>Deferral Value</center>
<chart column-names='Year,ADV'
       x-column='Year'
       y-columns='ADV'
       column-units=',$/kVAyr'
>Year,ADV\n
{{#deferral_table}}
{{year}},{{deferral_value}}\n
{{/deferral_table}}
</chart>

<br/>

{{#deferral_value_asset_chain}}
<hr/>

<br/>

<dl class='isf-info'>
  <dt>Network                             </dt><dd>{{network}}</dd>
  <dt>Asset name                          </dt><dd>{{asset_name}}</dd>
  <dt>Asset type                          </dt><dd>{{network_element_str}}</dd>
  <dt>Total investment value (m$)         </dt><dd>{{total_invest}}</dd>
{{^total_invest}}
{{#email}}
  <dt>NSP Contact Email</dt><dd>{{email}}</dd>
{{/email}}
{{#phone}}
  <dt>NSP Contact Phone</dt><dd>{{phone}}</dd>
{{/phone}}
</dl>
{{#apr_link}}<a target='_blank' href='{{apr_link}}'>Annual Planning Report</a><br>{{/apr_link}}
{{#info_link}}<a target='_blank' href='{{info_link}}'>NSP demand management information or maps</a><br>{{/info_link}}
{{/total_invest}}

{{#total_invest}}
  <dt>Deferrable investment (m$)          </dt><dd>{{deferrable_invest}}</dd>
  <dt>Investment year                     </dt><dd>{{invest_year}}</dd>
  <dt>Constraint season(s)                </dt><dd>{{constraint_season}}</dd>
  <dt>Average demand growth rate (MVA/yr) </dt><dd>{{demand_growth}}</dd>
  <dt>Reactive support requirements       </dt><dd>{{reactive_support_details}}</dd>
  <dt>Notes                               </dt><dd class='isf-note'>{{investment_description}}</dd>
{{#email}}
  <dt>NSP Contact Email</dt><dd>{{email}}</dd>
{{/email}}
{{#phone}}
  <dt>NSP Contact Phone</dt><dd>{{phone}}</dd>
{{/phone}}

{{#data_currency}}
  <dt>Data Currency</dt><dd>{{data_currency}}</dd>
{{/data_currency}}

{{#next_update}}
  <dt>Next Update</dt><dd>{{next_update}}</dd>
{{/next_update}}

{{#use_5yr_forecast}}
  <dt>Years of forecast available               </dt><dd>Five</dd>
{{/use_5yr_forecast}}

{{^use_5yr_forecast}}
  <dt>Years of forecast available               </dt><dd>Ten</dd>
{{/use_5yr_forecast}}

</dl>
{{#apr_link}}<a target='_blank' href='{{apr_link}}'>Annual Planning Report</a><br>{{/apr_link}}
{{#info_link}}<a target='_blank' href='{{info_link}}'>NSP demand management information or maps</a><br>{{/info_link}}

<br/>
<br/>

<center>
<table class='isf-table'>
  <tr>
    <th>Year</th>
    <th>ADV ($/kVAyr)</th>
    <th>Support required (MVA)</th>
  </tr>
{{#deferral_table}}
  <tr>
    <td>{{year}}</td>
    <td>{{deferral_value}}</td>
    <td>{{support_required}}</td>
  </tr>
{{/deferral_table}}
</table>
</center>

<br/>
<center>Deferral Value vs Support Required</center>
<chart column-names='Year,ADV,Support Required'
  id='{{asset_name}}'
  x-column='Year'
  y-columns='ADV,Support Required'
  column-units=',$/kVAyr,MVA'
>Year,ADV,Support Required\n
{{#deferral_table}}
{{year}},{{deferral_value}},{{support_required}}\n
{{/deferral_table}}
</chart>
{{/total_invest}}

<br/>
{{#probabilistic_data_exists}}
<table class='isf-table'>
  <tr>
    <th>Year</th>
    <th>Load at risk (MW)</th>
    <th>Expected unserved<br/>energy (MWh)</th>
    <th>No. hrs of<br/>exceedance</th>
    <th>Value of expected<br/>unserved energy ($)</th>
  </tr>
{{#probabilistic_table}}


  <tr>
    <td>{{year}}</td>
    <td>{{load_at_risk_mw}} {{^load_at_risk_mw}}  {{/load_at_risk_mw}}</td>
    <td>{{EUSE_MWh}} {{^EUSE_MWh}} {{/EUSE_MWh}}</td>
    <td>{{hours_exceedance}} {{^hours_exceedance}} {{/hours_exceedance}}</td>
    <td>{{EUSE_value}} {{^EUSE_value}} {{/EUSE_value}}</td>
  </tr>

{{/probabilistic_table}}
</table>
{{/probabilistic_data_exists}}
<br/>
{{/deferral_value_asset_chain}}
<hr/>

<br/>

<hr/>

<div class='isf-note'>
  Depending on NSP network security standards the information shown may or may not take
  account of potential load transfers to delay constraints. Consult with distributors for
  further details
</div>`;

const availableCapacityTemplate = `<dl class='isf-info'>
  <dt>Asset name</dt><dd>{{asset_name}}</dd>
  <dt>Asset type</dt><dd>{{network_element_str}}</dd>
  <dt>Network   </dt><dd>{{network}}</dd>
  <dt>Notes     </dt><dd>{{investment_description}}</dd>

{{#constraint_season}}
  <dt>Constraint season(s)       </dt><dd>{{constraint_season}}</dd>
{{/constraint_season}}

  <dt>Demand growth rate (MVA/yr)</dt><dd>{{demand_growth}}</dd>

{{#commitment_year}}
  <dt>Commitment Year            </dt><dd>{{commitment_year}}</dd>
{{/commitment_year}}

{{#invest_year}}
  <dt>Proposed investment year   </dt><dd>{{invest_year}}</dd>
{{/invest_year}}

{{#data_currency}}
  <dt>Data Currency              </dt><dd>{{data_currency}}</dd>
{{/data_currency}}

{{#next_update}}
  <dt>Next Update                </dt><dd>{{next_update}}</dd>
{{/next_update}}

{{#use_5yr_forecast}}
  <dt>Years of forecast available               </dt><dd>Five</dd>
{{/use_5yr_forecast}}

{{^use_5yr_forecast}}
  <dt>Years of forecast available               </dt><dd>Ten</dd>
{{/use_5yr_forecast}}

</dl>

<br/>

<table class='isf-table'>
  <tr>
    <th>Year</th>
    <th>Load (MVA)</th>
    <th>Capacity (MVA)</th>
    <th>Available Capacity (MVA)</th>
  </tr>
{{#avail_cap_table}}
  <tr>
    <td>{{year}}</td>
    <td>{{load}}</td>
    <td>{{capacity}}</td>
    <td>{{available_capacity}}</td>
  </tr>
{{/avail_cap_table}}
</table>

<br/>
<br/>

<center>Forecast load vs Asset Capacity (MVA)</center>
<chart x-column='Year'
y-columns='Load,Capacity'
column-units=',MVA,MVA'
column-names=',,'
>Year,Load,Capacity\n
{{#avail_cap_table}}
{{year}},{{load}},{{capacity}}\n
{{/avail_cap_table}}
</chart>
<br/>
<br/>

<dl class='isf-info'>
  <dt>Note</dt> <dd class='isf-note'>Depending on NSP network security standards the Available Capacity and Annual Deferral Value may or may not take account of potential load transfers to delay constraints. Consult with distributors for further details</dd>

{{#email}}
  <dt>NSP Contact Email</dt><dd>{{email}}</dd>
{{/email}}

{{#phone}}
  <dt>NSP Contact Phone</dt><dd>{{phone}}</dd>
{{/phone}}
</dl>

<br>
{{#apr_link}}<a target='_blank' href='{{apr_link}}'>Annual Planning Report</a><br/>{{/apr_link}}
{{#dses_info_url}}<a target='_blank' href='{{dses_info_url}}'>DSES web link</a><br/>{{/dses_info_url}}
{{#info_link}}<a target='_blank' href='{{info_link}}'>NSP demand management information or maps</a><br/>{{/info_link}}
{{#file_link}}<a target='_blank' href='{{file_link}}'>Download data in spreadsheet format</a>{{/file_link}}`;

const peakDayTemplate = `<dl class='isf-info'>
  <dt>Asset name</dt><dd>{{asset_name}}</dd>
  <dt>Asset type</dt><dd>{{network_element_str}}</dd>
  <dt>Network   </dt><dd>{{network}}</dd>
  <dt>Notes     </dt><dd>{{investment_description}}</dd>

{{#constraint_season}}
  <dt>Constraint season(s)       </dt><dd>{{constraint_season}}</dd>
{{/constraint_season}}
  <dt>Peak day load shape used</dt><dd>{{peak_day_date}}</dd>
 <dt>Capacity ({{avail_cap_table.0.year}})</dt><dd>{{avail_cap_table.0.capacity}} MVA</dd>

  <dt>Demand growth rate (MVA/yr)</dt><dd>{{demand_growth}}</dd>

{{#commitment_year}}
  <dt>Commitment Year            </dt><dd>{{commitment_year}}</dd>
{{/commitment_year}}

{{#invest_year}}
  <dt>Proposed investment year   </dt><dd>{{invest_year}}</dd>
{{/invest_year}}

{{#data_currency}}
  <dt>Data Currency              </dt><dd>{{data_currency}}</dd>
{{/data_currency}}

{{#next_update}}
  <dt>Next Update                </dt><dd>{{next_update}}</dd>
{{/next_update}}
</dl>

<div class='isf-note'>
  Depending on NSP network security standards the information shown may or may not take
  account of potential load transfers to delay constraints. Consult with distributors for
  further details
</div>

<dl>
{{#email}}
  <dt>NSP Contact Email</dt><dd>{{email}}</dd>
{{/email}}
{{#phone}}
  <dt>NSP Contact Phone</dt><dd>{{phone}}</dd>
{{/phone}}
</dl>

{{#apr_link}}<a target='_blank' href='{{apr_link}}'>Annual Planning Report</a><br>{{/apr_link}}
{{#info_link}}<a target='_blank' href='{{info_link}}'>NSP demand management information or maps</a><br>{{/info_link}}`;

const investmentTemplate = `<dl class='isf-info'>
  <dt>Asset name</dt><dd>{{asset_name}}</dd>
  <dt>Asset type</dt><dd>{{network_element_str}}</dd>
  <dt>Network   </dt><dd>{{network}}</dd>
  <dt>Notes     </dt><dd>{{investment_description}}</dd>

{{#augmentation_invest}}
  <dt>Augmentation investment (m$)</dt><dd>{{augmentation_invest}}</dd>
{{/augmentation_invest}}

{{#replacement_invest}}
  <dt>Replacement investment (m$) </dt><dd>{{replacement_invest}}</dd>
{{/replacement_invest}}

{{#connections_invest}}
  <dt>Connections investment (m$) </dt><dd>{{connections_invest}}</dd>
{{/connections_invest}}

{{#other_invest}}
  <dt>Other investment (m$)       </dt><dd>{{other_invest}}</dd>
{{/other_invest}}

  <dt>Total investment value (m$) </dt><dd>{{total_invest}}</dd>
  <dt>Deferrable investment (m$)  </dt><dd>{{deferrable_invest}}{{^deferrable_invest}} 0 {{/deferrable_invest}}</dd>
  <dt>Investment year             </dt><dd>{{invest_year_str}}</dd>
  <dt>Commitment year             </dt><dd>{{commitment_year}} {{^commitment_year}} Not specified {{/commitment_year}}</dd>

{{#data_currency}}
  <dt>Data Currency               </dt><dd>{{data_currency}}</dd>
{{/data_currency}}

{{#next_update}}
  <dt>Next Update                 </dt><dd>{{next_update}}</dd>
{{/next_update}}
</dl>

<br>

<div class='isf-note'>
  Depending on NSP network security standards the information shown may or may not take
  account of potential load transfers to delay constraints. Consult with distributors for
  further details
</div>
<dl class='isf-info'>
{{#email}}
    <dt>NSP Contact Email</dt><dd>{{email}}</dd>
{{/email}}

{{#phone}}
    <dt>NSP Contact Phone</dt><dd>{{phone}}</dd>
{{/phone}}
</dl>

{{#apr_link}}    <a target='_blank' href='{{apr_link}}'>Annual Planning Report</a><br>{{/apr_link}}
{{#info_link}} <a target='_blank' href='{{info_link}}'>NSP demand management information or maps</a><br> {{/info_link}}`;

module.exports = function modifyNetworkOpportunities(NetworkOpportunities) {
  const AvailableDistributionCapacity = findInMembers(
    NetworkOpportunities.members,
    ["Available Distribution Capacity"]
  );
  AvailableDistributionCapacity.url =
    "https://network-opportunity-maps.s3-ap-southeast-2.amazonaws.com/constraints/surge/available_capacity_timeseries.csv";
  AvailableDistributionCapacity.featureInfoTemplate.template = availableCapacityTemplate;

  AvailableDistributionCapacity.styles = [
    {
      id: "available_capacity",
      color: {
        binMaximums: [-15, -10, -3, 3, 10, 15],
      },
    },
    {
      id: "capacity",
      color: {
        binMethod: "ckmeans"
      }
    },
    {
      id: "load",
      color: {

      binMethod: "ckmeans"
      }
    },
  ];
  const ProposedInvestment = findInMembers(NetworkOpportunities.members, [
    "Proposed Investment",
  ]);
  ProposedInvestment.url =
    "https://network-opportunity-maps.s3-ap-southeast-2.amazonaws.com/constraints/surge/proposed_investment.csv";
  ProposedInvestment.featureInfoTemplate.template = investmentTemplate;

  const investMoneyStyles = ProposedInvestment.styles.filter(s => /_invest$/.test(s.id));
  investMoneyStyles.map(s => {
    s.pointSize = {pointSizeColumn: s.id}
    s.color.colorColumn = "invest_year_str"  }); 

  const AnnualDeferralValue = findInMembers(NetworkOpportunities.members, [
    "Annual Deferral Value",
  ]);
  AnnualDeferralValue.url =
    "https://network-opportunity-maps.s3-ap-southeast-2.amazonaws.com/constraints/surge/deferral_values_timeseries.csv";
  AnnualDeferralValue.featureInfoTemplate.template = deferralTemplate;
  const deferralStyle = AnnualDeferralValue.styles[0];
  deferralStyle.color.binMaximums = [10, 50, 100, 200, 500, 1000];
  // const deferraldefaultStyle = AnnualDeferralValue.defaultStyle;
  // deferraldefaultStyle.color.binColors[0] = "rgba(255,255,255,0.0)";

  const AdvColumn = AnnualDeferralValue.columns.find(c => c.name === "deferral_value");
  AdvColumn.format = {style: "currency", currency: "AUD"};


  const PeakDayCapacity = findInMembers(NetworkOpportunities.members, [
    "Peak Day Available Capacity",
  ]);
  PeakDayCapacity.url =
    "https://network-opportunity-maps.s3-ap-southeast-2.amazonaws.com/constraints/surge/peak_day.csv";
  PeakDayCapacity.featureInfoTemplate.template = peakDayTemplate;

  PeakDayCapacity.styles = [
    {
      id: "percent_available",
      color: {
        binMaximums: [25, 50, 75, 90, 100],
      },
    },
  ];

  // Can't get items to be ordered as I'd like them to be:

    NetworkOpportunities.members = _.uniq([
      AvailableDistributionCapacity,
      ProposedInvestment,
      AnnualDeferralValue,
      PeakDayCapacity,
      ...NetworkOpportunities.members,
    ]);
};
