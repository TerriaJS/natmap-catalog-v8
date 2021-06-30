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

<br />
<center>{{terria.timeSeries.title}}</center>
<chart x-column='{{terria.timeSeries.xName}}'
  y-column='{{terria.timeSeries.yName}}'
  id='{{terria.timeSeries.id}}'
  column-units='{{terria.timeSeries.units}}'> {{terria.timeSeries.data}}
</chart>
<br />

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

const peakDayInfo = [
  {
    name: "Description of Data",
    content:
      "<img style='float:right; width: 40%; max-width: 407px; clear: right;' src='http://static.aremi.data61.io/datasets/dance/2017/logos/ENA.svg'/><img style='float:right; width: 40%; max-width: 407px; clear: right;' src='http://static.aremi.data61.io/datasets/dance/UTS_ISF_Logo_Horizontal.png'/><p>Augmentation investments in the network are undertaken to avoid peak demand reaching the capacity of network infrastructure. However, the peak demand of a network asset generally occurs only a few hours a year and hence it is useful to show the timing and magnitude of the constrained hours on a representative the peak day.</p><p>This map layer shows the load as percentage of asset capacity for each hour of a representative peak day in the lowest level of the network each area with potentially deferrable investment. For example, if the zone substation has deferrable value then the zone exceedance situation is mapped, while if the only deferrable value is at the transmission level, the transmission exceedance situation is mapped.</p><p>A value &lt; 100% represents spare capacity, while a value &gt; 100% represents an exceedance.</p><p>Note that the critical season (summer or winter) and year of investment is different for each constraint area. As such, the peak day data mapped for each area is for the planned investment year* and the relevant peak season. This means that winter peaking zones may be more likely to show exceedance early and late in the day, and summer peaking zones to show value during the middle of the day and afternoon.</p><p>In the additional information (when a polygon is clicked), the values are graphed to show the peak day load trace.</p><p>* If the first year that support is required is after the investment year, then the exceedance for this year is mapped.</p><p>When the user clicks on the distribution feeder region, a range of additional information is shown in a pop up information box. An explanation of the additional information is given below:</p><ul><li><p><strong>Asset type:</strong> Type of network asset according with the following definitions:</p><ul><li><p><strong>Transmission Line:</strong> High voltage power lines (including switching stations) built and operated by the transmission network service provider.</p></li><li><p><strong>Transmission Terminal Station:</strong> High voltage transformation substation built and operated by transmission network service provider.</p></li><li><p><strong>Sub transmission line:</strong> Sub transmission power line connecting transmission station and zone substation assets generally built and operated by distribution network service providers.</p></li><li><p><strong>Sub transmission Substation:</strong> Transformation substation at the sub transmission voltage levels built and operated by transmission network service providers.</p></li><li><p><strong>Distribution Zone Substation:</strong> Transformation substation typically (but not exclusively) converting voltage to 11kV on the low voltage side, built and operated by distribution network service providers.</p></li></ul></li><li><p><strong>Distribution Feeder (DF):</strong> Medium or high voltage feeder (e.g. 22 kV or 11 kV) emerging from the ZS to distribute power to downstream smaller, local distributions substations.</p></li><li><p><strong>Network:</strong> Name of the Network Service Provider that manages the asset.</p></li><li><p><strong>Notes:</strong> Additional information on the proposed investment.</p></li><li><p><strong>Constraint Season(s):</strong> Primary season of constraint driving network investment (Summer, Winter, Spring and/or Autumn).</p></li><li><p><strong>Peak day load shape used:</strong> Specific date from which peak day load shape was extracted. This is when single half-hourly maximum demand occurred within the available load data sample. Note that this is automated from raw half-hourly data and can sometimes represent data anomalies. For more detail on how this load shape is adjusted see calculation examples on ENA Webpage.</p></li><li><p><strong>Demand growth rate (MVA/yr):</strong> Average demand growth rate for the asset over the first 5-year horizon.</p></li><li><p><strong>Proposed investment year:</strong> Financial year when the investment takes place. Where investment takes place over multiple years, this field shows the first year in which the investment takes place.</p></li><li><p><strong>Asset capacity (MVA):</strong> Maximum capacity at which the NSP is comfortable operating the network asset over the coming 10-year period. This may be the secure capacity, the nameplate capacity, or some other customisable level that could change year on year.</p></li><li><p><strong>Mapped year:</strong> Year shown in the map which coincides with the planned year of investment.</p></li><li><p><strong>Maximum capacity exceedance in mapped year (MVA):</strong> Maximum capacity exceedance in the constrained asset expected for the mapped year.</p></li><li><p><strong>MWh exceedance in</strong> <strong>shown year (MWh):</strong> Total forecast energy exceedance in MWh for the mapped year.</p></li></ul><p>NOTE:</p><ul><li><p>The above data is repeated for other constrained assets at higher levels of the network (where data is available)</p></li><li><p>Peak day hourly data supplied is generally raw, unchecked and uncorrected for load transfers that occurred during the period. Anomalies may exist.</p></li><li><p>The peak day date in the graphs for all polygons is shown as “1/1/1900” to ensure it is not confused for data from a specific actual date.</p></li></ul>",
  },
  {
    name: "Plain English Disclaimer",
    content:
      "<p>These maps are intended to make data on electricity network planning and investment more accessible and consistent. These maps should not be used to make investment decisions, and should only be used to assist in discussions with the local Network Service Provider (see list below). You are free to use the data but do so at your own risk. By accessing or using the maps and data the user agrees to irrevocably release the creators, authors, publishers and contributors to the maps, who include Network Service Providers, UTS and Energy Networks Australia (Providers), from all claims, actions, damages, judgments, losses, remedies or matters whether in tort, contract or under statute or otherwise, relating to the data. By proceeding, the user releases the Providers from all liability, and accepts the terms of this Disclaimer and the Full Legal Disclaimer shown below.</p>",
  },
  {
    name: "Full Legal Disclaimer",
    content:
      "<p>The Providers of these maps do not make any representations, guarantees or warranties as to the accuracy, reliability, completeness or currency of the data and content of the maps or that reasonable care has or will be taken by the Providers in compiling preparing or updating the maps.  Except to the extent not permitted by statute or any law, the Providers accept no liability (whether in negligence or tort, by contract or under statute or otherwise) for any error or omission, and specifically disclaim any liability for any costs, losses, claims, demands or liabilities of any kind suffered or incurred by any person by reason of or in connection with the maps or by any purported reliance on information contained in the maps.</p><p>While due care and attention has been taken in the presentation and transformation of available data and to verify the accuracy of the material published, the maps are not intended to be used as the basis for any investment decision.</p><p>Users should make their own detailed investigations as to the reliability and suitability of the content of the maps for any use to which the user intends to put it, and initiate dialogue with the relevant Network Service Provider before considering any investment relating to the subject matter of the maps. </p><p>In particular, users should note that Annual Deferral Values are indicative estimates which are subject to change as circumstances change, options are developed and more detailed investigation is done. Annual Deferral Values are not what the Network Service Provider is willing to pay for demand management support.  Refer to the Network Service Provider’s Demand Side Engagement Document for details on how they assess non-network solutions and determine payment levels.</p><p>Data supplied by Network Service Providers and other parties used in the formulation of the maps has been provided, compiled and assessed with due care, but may be incomplete and is subject to errors and to change over time as the network situation changes, load projections are amended and operational and technical matters affect network performance and investment. Such changes are likely but not guaranteed to have occurred both prior to and after publication of the maps. </p><p>A “Network Service Provider” referred to above is a person who engages in the activity of owning, controlling or operating a transmission or distribution system in the National Electricity Market and who is registered by AEMO as a Network Service Provider under Chapter 2 of the National Electricity Rules, and includes Electranet, SA Power Networks, TasNetworks, AEMO, United Energy Distribution, Ausnet Services, Jemena, Citipower-Powercor, Evoenergy, Transgrid, Ausgrid, Essential Energy, Endeavour Energy, Powerlink, Ergon Energy, Energex, Western Power, Horizon Power and Power and Water Corporation.</p>",
  },
  {
    name: "Data Currency and Updates",
    content:
      "This layer is updated annually. Currency and next update timing is specified when clicking on a data point in each layer.",
  },
  {
    name: "Data Supplier and Custodian",
    content:
      "The data was supplied by Network Service Providers. The data is stored and processed into mapping outputs by Energy Networks Australia and the Institute of Sustainable Futures (ISF) at the University of Technology Sydney (UTS).",
  },
];

const availableDistInfo = [
  {
    name: "Description of Data",
    content:
      "<img style='float:right; width: 40%; max-width: 407px; clear: right;' src='http://static.aremi.data61.io/datasets/dance/2017/logos/ENA.svg' /><img src='http://static.aremi.data61.io/datasets/dance/UTS_ISF_Logo_Horizontal.png' style='float: right; width: 40%; max-width: 407px; clear: right;'><p>This is a map of ‘firm substation capacity’ (determined by the local reliability criteria), minus the forecast peak demand at the Zone Substation level. Data mapped is for the relevant critical peak season (summer or winter) at each Zone Substation. Where a constraint occurs in both seasons, the season with the largest capacity shortfall over the time horizon is mapped.</p><p>This map allows the user to see the progression of load growth relative to distribution zone substation capacity over time, and understand areas of emerging capacity-related constraint. Note that capacity constraints may exist upstream or downstream of the zone substation and as such this map provides an indicative ‘slice’ of the capacity situation through one level of the network. Also note that these images show available capacity before network or non-network options are taken to alleviate constraints, and before load transfer capability between adjacent zones have been taken into account.</p><p>This map does NOT show:</p><ul> <li><p>Areas facing power outage</li></p> <li><p>The capacity of the network to accept the connection of embedded or distributed generators</li></p></ul><p>The green and yellow colours indicate a period when zones that have sufficient spare capacity (available capacity is around or above zero), while the orange and red colours (where available capacity is below zero) indicate periods where zones facing capacity-related constraints where investment will be needed to ensure reliability is maintained.</p><p>Polygons shown are approximate Zone Substation service regions. Clicking on a specific region will reveal the details of that location and time period, including the season of constraint and the exact available capacity value for each year.</p><p>When the user clicks on the distribution zone substation region, a range of additional information is shown in a pop up information box. An explanation of the additional information is given below:</p><ul> <li><p><strong>Asset Type:</strong> Type of the network asset. Data presented in this layer is generally only for the Distribution Zone Substation level, although some businesses have smaller distribution feeder regions represented at times. These assets carry the following definitions:</p> <ul> <li><p><strong>Distribution Zone Substation (ZS):</strong> Transformation substation typically (but not exclusively) converting voltage to 11kV on the low voltage side, built and operated by distribution network service providers.</li></p> <li><p><strong>Distribution Feeder (DF):</strong> Medium or high voltage feeder (e.g. 22 kV or 11 kV) emerging from the ZS to distribute power to downstream smaller, local distribution substations.</li></p> </ul> </li></p> <li><p><strong>Network:</strong> Name of the Network Service Provider manages the asset.</li></p> <li><p><strong>Notes:</strong> Additional information on the asset or investment.</li></p> <li><p><strong>Constraint Season(s):</strong> Primary season of constraint driving network investment (Summer, Winter, Spring and/or Autumn).</li></p> <li><p><strong>Demand growth rate (MVA/yr):</strong> Average demand growth rate for the asset over the first 5-year horizon.</li></p> <li><p><strong>Data Currency:</strong> The most recent update of the shown data.</li></p> <li><p><strong>Next update:</strong> The expected date and source of the next update to the data.</li></p></ul><p>The table and chart shows the available capacity at the selected zone over the next ten years in MVA. Where 2025 data is shown for a <em>winter critical</em> asset, this is for the winter occurring in the middle of 2025. Where 2025 data (for example) is shown for a <em>summer critical asset</em>, this is for the summer season bridging 2024/25.</p>",
  },
  {
    name: "Plain English Disclaimer",
    content:
      "<p>These maps are intended to make data on electricity network planning and investment more accessible and consistent. These maps should not be used to make investment decisions, and should only be used to assist in discussions with the local Network Service Provider. You are free to use the data but do so at your own risk. By accessing or using the data the user agrees to irrevocably release Network Service Providers and UTS from all claims, actions, damages, judgments, losses, remedies or matters whether in tort, contract or under statute or otherwise, relating to the data. By proceeding, the user agrees and accepts the terms of the Full Legal Disclaimer shown below.</p>",
  },
  {
    name: "Full Legal Disclaimer",
    content:
      "<p>UTS, the authors and the Network Service Providers do not make any representations, guarantees or warranties as to the accuracy, reliability, completeness or currency of the data and content of the maps or that reasonable care has or will be taken by UTS, the authors and the Network Service Providers in compiling preparing or updating the maps. Except to the extent not permitted by statute or any law, no liability (whether in negligence or tort, by contract or under statute or otherwise) for any error or omission is accepted by UTS, the authors and the Network Service Providers, and UTS, the authors and Network Service Providers specifically disclaim any liability for any costs, losses, claims, demands or liabilities of any kind suffered or incurred by any person by reason of or in connection with the maps or by any purported reliance on information contained in the maps.</p><p>While due care and attention has been taken in the presentation and transformation of available data and to verify the accuracy of the material published, the maps are not intended to be used as the basis for any investment decision.</p><p>Users should make their own detailed investigations as to the reliability and suitability of the content of the maps for any use to which the user intends to put it, and initiate dialogue with the relevant Network Service Provider before considering any investment relating to the subject matter of the maps.</p><p>In particular, users should note that Annual Deferral Values are indicative estimates which are subject to change as circumstances change, options are developed and more detailed investigation is done. Annual Deferral Values are not what the Network Service Provider is willing to pay for demand management support. Refer to the Network Service Provider’s Demand Side Engagement Document for details on how they assess non-network solutions and determine payment levels.</p><p>Data supplied by Network Service Providers and other parties used in the formulation of the maps has been provided, compiled and assessed in good faith, but may be incomplete and is subject to errors and to change over time as the network situation changes, load projections are amended and operational and technical matters affect network performance and investment. Such changes are likely but not guaranteed to have occurred both prior to and after publication of the maps. By accessing or using the data the user agrees to irrevocably release Network Service Providers and UTS from all claims, actions, damages, judgments, losses, remedies or matters whether in tort, contract or under statute or otherwise relating to the data. </p><p>A “Network Service Provider” referred to above is a person who engages in the activity of owning, controlling or operating a transmission or distribution system in the National Electricity Market and who is registered by AEMO as a Network Service Provider under Chapter 2 of the National Electricity Rules, and includes Electranet, SA Power Networks, TasNetworks, AEMO, United Energy Distribution, Ausnet Services, Jemena, Citipower-Powercor, Evoenergy, Transgrid, Ausgrid, Essential Energy, EndeavoLur Energy, Powerlink, Ergon Energy and Energex.</p>",
  },
  {
    name: "Data Currency and Updates",
    content:
      "This layer is updated annually. Currency and next update timing is specified when clicking on a data point in each layer.",
  },
  {
    name: "Data Supplier and Custodian",
    content:
      "The data was supplied by Network Service Providers. The data is stored and processed into mapping outputs by Energy Networks Australia and the Institute of Sustainable Futures (ISF) at the University of Technology Sydney (UTS).",
  },
];

const proposedInvInfo = [
  {
    name: "Description of Data",
    content:
      "<img style='float:right; width: 40%; max-width: 407px; clear: right;' src='http://static.aremi.data61.io/datasets/dance/2017/logos/ENA.svg'/><img src='http://static.aremi.data61.io/datasets/dance/UTS_ISF_Logo_Horizontal.png' style='float: right; width: 40%; max-width: 407px; clear: right;'><p>This layer shows the location of network investment currently planned to occur over the period 2016 to 2025. Depending on the Network Service Provider, this generally includes augmentation investment, but may also include the following investment categories: replacement/refurbishment, connections, other capital investment, and major opex. Where a project investment is committed, figures shown in the table do not reflect the reduction in risk due to committed project.</p><p>The colour of the circle at a given location reflects the timing of the investment. Grey shapes indicate investments that may already be committed. Red markers are located where investment is close to being committed, while green markers represent investments planned to occur closer to the end of the time horizon.</p><p>Selecting a circle reveals information on the value and cause of the network investment, and how much of the investment is potentially deferrable. An explanation of the additional information is given below:</p><ul><li><p><strong>Asset type:</strong> Type of network asset according with the following definitions:</p><ul><li><p><strong>Transmission Line:</strong> High voltage power lines (including switching stations) built and operated by the transmission network service provider.</p></li><li><p><strong>Transmission Terminal Station:</strong> High voltage transformation substation built and operated by transmission network service provider.</p></li><li><p><strong>Sub transmission line:</strong> Sub transmission power line connecting transmission station and zone substation assets generally built and operated by distribution network service providers.</p></li><li><p><strong>Sub transmission Substation:</strong> Transformation substation at the sub transmission voltage levels built and operated by transmission network service providers.</p></li><li><p><strong>Distribution Zone Substation:</strong> Transformation substation typically (but not exclusively) converting voltage to 11kV on the low voltage side, built and operated by distribution network service providers.</p></li><li><p><strong>Distribution Feeder (DF):</strong> Medium or high voltage feeder (e.g. 22 kV or 11 kV) emerging from the ZS to distribute power to downstream smaller, local distribution substations.</p></li></ul></li><li><p><strong>Network:</strong> Name of the Network Service Provider that manages the asset.</p></li><li><p><strong>Augmentation invest ($):</strong> Value of proposed network investment for each network asset, with &quot;Augmentation&quot; as the investment driver (demand growth related).</p></li><li><p><strong>Replacement/refurbishment invest ($):</strong> Value of proposed network investment for each network asset, with &quot;Replacement/Refurbishment&quot; as the investment driver (age/condition related).</p></li><li><p><strong>Connections invest ($):</strong> Value of proposed network investment for each network asset, with &quot;Connections&quot; as the investment driver.</p></li><li><p><strong>OPEX invest ($):</strong> Value of major, potentially deferrable, proposed operating expenditure (OPEX) for network assets. The value supplied is the estimated value of the preferred OPEX solution, and is aggregated into a single value for the investment year.</p></li><li><p><strong>Other invest ($):</strong> Value of proposed network investment for each network asset, for investment that falls into any category apart from the above 4 categories.</p></li><li><p><strong>Total investment value ($):</strong> Total value of proposed network investment for the network asset.</p></li><li><p><strong>Deferrable amount ($):</strong> Amount of the total investment value that is potentially deferrable through the deployment of non-network options.</p></li><li><p><strong>Investment year:</strong> Year when the proposed network investment will take place (financial year ending). Where investment will take place over multiple years, this corresponds only to the first year in which investment will take place.</p></li><li><p><strong>Commitment Year:</strong> Year when the network business intends to commit on the investment and demand management will no longer be considered.</p></li><li><p><strong>Constraint Season(s):</strong> Primary season of constraint driving network investment (Summer, Winter, Spring and/or Autumn).</p></li><li><p><strong>Notes:</strong> Additional information on the proposed investment.</p></li><li><p><strong>Potential value of 10 year deferral of investment:</strong> Potential net present value (NPV) if the investment is deferred for 10 years from the year of proposed investment.</p></li><li><p><strong>Demand growth rate (MVA/yr):</strong> Average demand growth rate for the asset over the first 5-year horizon.</p></li><li><p><strong>Reactive Support Requirement:</strong> Any support required for the asset in the form of reactive power indicated by the network business.</p></li></ul><p>The table and chart show the support required in MVA that would be needed to defer the proposed investment in one year.</p>",
  },
  {
    name: "Plain English Disclaimer",
    content:
      "<p>These maps are intended to make data on electricity network planning and investment more accessible and consistent. These maps should not be used to make investment decisions, and should only be used to assist in discussions with the local Network Service Provider (see list below). You are free to use the data but do so at your own risk. By accessing or using the maps and data the user agrees to irrevocably release the creators, authors, publishers and contributors to the maps, who include Network Service Providers, UTS and Energy Networks Australia (Providers), from all claims, actions, damages, judgments, losses, remedies or matters whether in tort, contract or under statute or otherwise, relating to the data. By proceeding, the user releases the Providers from all liability, and accepts the terms of this Disclaimer and the Full Legal Disclaimer shown below.</p>",
  },
  {
    name: "Full Legal Disclaimer",
    content:
      "<p>The Providers of these maps do not make any representations, guarantees or warranties as to the accuracy, reliability, completeness or currency of the data and content of the maps or that reasonable care has or will be taken by the Providers in compiling preparing or updating the maps.  Except to the extent not permitted by statute or any law, the Providers accept no liability (whether in negligence or tort, by contract or under statute or otherwise) for any error or omission, and specifically disclaim any liability for any costs, losses, claims, demands or liabilities of any kind suffered or incurred by any person by reason of or in connection with the maps or by any purported reliance on information contained in the maps.</p><p>While due care and attention has been taken in the presentation and transformation of available data and to verify the accuracy of the material published, the maps are not intended to be used as the basis for any investment decision.</p><p>Users should make their own detailed investigations as to the reliability and suitability of the content of the maps for any use to which the user intends to put it, and initiate dialogue with the relevant Network Service Provider before considering any investment relating to the subject matter of the maps. </p><p>In particular, users should note that Annual Deferral Values are indicative estimates which are subject to change as circumstances change, options are developed and more detailed investigation is done. Annual Deferral Values are not what the Network Service Provider is willing to pay for demand management support.  Refer to the Network Service Provider’s Demand Side Engagement Document for details on how they assess non-network solutions and determine payment levels.</p><p>Data supplied by Network Service Providers and other parties used in the formulation of the maps has been provided, compiled and assessed with due care, but may be incomplete and is subject to errors and to change over time as the network situation changes, load projections are amended and operational and technical matters affect network performance and investment. Such changes are likely but not guaranteed to have occurred both prior to and after publication of the maps. </p><p>A “Network Service Provider” referred to above is a person who engages in the activity of owning, controlling or operating a transmission or distribution system in the National Electricity Market and who is registered by AEMO as a Network Service Provider under Chapter 2 of the National Electricity Rules, and includes Electranet, SA Power Networks, TasNetworks, AEMO, United Energy Distribution, Ausnet Services, Jemena, Citipower-Powercor, Evoenergy, Transgrid, Ausgrid, Essential Energy, Endeavour Energy, Powerlink, Ergon Energy, Energex, Western Power, Horizon Power and Power and Water Corporation.</p>",
  },
  {
    name: "Data Currency and Updates",
    content:
      "This layer is updated annually. Currency and next update timing is specified when clicking on a data point in each layer.",
  },
  {
    name: "Data Supplier and Custodian",
    content:
      "The data was supplied by Network Service Providers. The data is stored and processed into mapping outputs by Energy Networks Australia and the Institute of Sustainable Futures (ISF) at the University of Technology Sydney (UTS).",
  },
];

const annualDeferralInfo = [
  {
    name: "Description of Data",
    content:
      "<img style='float:right; width: 40%; max-width: 407px; clear: right;' src='http://static.aremi.data61.io/datasets/dance/2017/logos/ENA.svg'/><img src='http://static.aremi.data61.io/datasets/dance/UTS_ISF_Logo_Horizontal.png' style='float: right; width: 40%; max-width: 407px; clear: right;'><p>Annual Deferral Value (expressed in $/kVA/year) is the planned investments that are potentially deferrable, noting that many replacement investments are not nominated as deferrable, In addition, the amount of network support (in MVA) from demand management or renewable energy required in a given year to achieve a successful deferral is calculated.</p><p>Annual Deferral Value shows the effective cost of addressing upcoming network constraints through the preferred network solution. This annual value can be thought of as an upper bound to the amount that the network could invest in equivalent non-network options (such as demand management or distributed generation) to alleviate a constraint for that year. If less than this upper bound is spent addressing the constraint using non-network options, then overall the cost to network service providers and consumers is lower.</p><p>Annual Deferral Values are indicative estimates which are subject to change as circumstances change, options are developed and more detailed investigation is done. <strong>Annual Deferral Values are not what the Network Service Provider is willing to pay for demand management support.</strong> Refer to the Network Service Provider’s Demand Side Engagement Document for details on how they assess non-network solutions and determine payment levels.</p><p>Areas in white are those with no deferral value. Areas in light yellow and brown are those with limited deferral value where very low cost demand management options may be viable. Annual deferral value increases strongly in the red to purple areas (&gt;$400/kVA/yr).</p><p>Annual deferral value is calculated by determining the annualised value of deferring the network solution (avoided depreciation and interest paid on capital), and dividing this by the amount of network support (in kVA) that would be required in that year to achieve the deferral. Note that while the $/kVA/yr figure shown is a marginal value (i.e. for each kVA of capacity supplied), a whole year’s the demand growth is generally required in network support to enable a successful deferral to be achieved. That is, a sufficiently large quantum of network support is required.</p><p>Note that where 2025 data (for example) is shown for a <em>winter critical</em> asset, this is for the winter occurring in the middle of 2025. Where 2025 data is shown for a <em>summer critical</em> asset, this is for the summer season bridging 2024/25.</p><p>From the investment year onwards the ADV shrinks if load growth is forecast to continue, as the amount of support required continues to increase, but the annualised value of depreciation and cost of capital remain unchanged. As such, the most lucrative time to invest in demand management tends to be the year of proposed investment.</p><p>When the user clicks on the distribution feeder region, a range of additional information is shown in a pop up information box. An explanation of the additional information is given below:</p><ul><li><p><strong>Network:</strong> Name of the Network Service Provider that manages the asset.</p></li><li><p><strong>Asset type:</strong> Type of network asset according with the following definitions:</p><ul><li><p><strong>Transmission Line:</strong> High voltage power lines (including switching stations) built and operated by the transmission network service provider.</p></li><li><p><strong>Transmission Terminal Station:</strong> High voltage transformation substation built and operated by transmission network service provider.</p></li><li><p><strong>Transmission Connection Point:</strong> Point at which the transmission and distribution network meet.</p></li><li><p><strong>Sub transmission line:</strong> Sub transmission power line connecting transmission station and zone substation assets generally built and operated by distribution network service providers.</p></li><li><p><strong>Sub transmission Substation:</strong> Transformation substation at the sub transmission voltage levels built and operated by transmission network service providers.</p></li><li><p><strong>Distribution Zone Substation:</strong> Transformation substation typically (but not exclusively) converting voltage to 11kV on the low voltage side, built and operated by distribution network service providers.</p></li><li><p><strong>Distribution Feeder (DF):</strong> Medium or high voltage feeder (e.g. 22 kV or 11 kV) emerging from the ZS to distribute power to downstream smaller, local distribution substations.</p></li></ul></li><li><p><strong>Total investment value ($):</strong> Total value of proposed network investment for the network asset.</p></li><li><p><strong>Deferrable investment</strong> <strong>($):</strong> Amount of the total investment value that is potentially deferrable through the deployment of non-network options.</p></li><li><p><strong>Investment year:</strong> Financial year when the investment takes place. Where investment takes place over multiple years, this field shows the first year in which the investment takes place.</p></li><li><p><strong>Constraint Season(s):</strong> Primary season of constraint driving network investment (Summer, Winter, Spring and/or Autumn).</p></li><li><p><strong>Demand growth rate (MVA/yr):</strong> Average demand growth rate for the asset over the first 5-year horizon.</p></li><li><p><strong>Reactive support requirements:</strong> Any support required for the asset in the form of reactive power indicated by the network business.</p></li><li><p><strong>Notes:</strong> Additional information on the proposed investment.</p></li></ul><p>The table and chart show the support required in MVA that would be needed to defer the proposed investment in each year.</p><ul><li><p><strong>Annual Deferral Value in 20XX (ADV ($/kVA/yr)):</strong> Maximum value to the network of deferring the construction of the network asset for a year.</p></li><li><p><strong>Network support required in 20XX:</strong> Support required in MVA that would be needed to defer the proposed investment for that year.</p></li></ul><strong>NOTE:</strong><ul><li>The above data is repeated for other constrained assets at higher levels of the network (where data is available).</li></ul>",
  },
  {
    name: "Plain English Disclaimer",
    content:
      "<p>These maps are intended to make data on electricity network planning and investment more accessible and consistent. These maps should not be used to make investment decisions, and should only be used to assist in discussions with the local Network Service Provider (see list below). You are free to use the data but do so at your own risk. By accessing or using the maps and data the user agrees to irrevocably release the creators, authors, publishers and contributors to the maps, who include Network Service Providers, UTS and Energy Networks Australia (Providers), from all claims, actions, damages, judgments, losses, remedies or matters whether in tort, contract or under statute or otherwise, relating to the data. By proceeding, the user releases the Providers from all liability, and accepts the terms of this Disclaimer and the Full Legal Disclaimer shown below.</p>",
  },
  {
    name: "Full Legal Disclaimer",
    content:
      "<p>The Providers of these maps do not make any representations, guarantees or warranties as to the accuracy, reliability, completeness or currency of the data and content of the maps or that reasonable care has or will be taken by the Providers in compiling preparing or updating the maps.  Except to the extent not permitted by statute or any law, the Providers accept no liability (whether in negligence or tort, by contract or under statute or otherwise) for any error or omission, and specifically disclaim any liability for any costs, losses, claims, demands or liabilities of any kind suffered or incurred by any person by reason of or in connection with the maps or by any purported reliance on information contained in the maps.</p><p>While due care and attention has been taken in the presentation and transformation of available data and to verify the accuracy of the material published, the maps are not intended to be used as the basis for any investment decision.</p><p>Users should make their own detailed investigations as to the reliability and suitability of the content of the maps for any use to which the user intends to put it, and initiate dialogue with the relevant Network Service Provider before considering any investment relating to the subject matter of the maps. </p><p>In particular, users should note that Annual Deferral Values are indicative estimates which are subject to change as circumstances change, options are developed and more detailed investigation is done. Annual Deferral Values are not what the Network Service Provider is willing to pay for demand management support.  Refer to the Network Service Provider’s Demand Side Engagement Document for details on how they assess non-network solutions and determine payment levels.</p><p>Data supplied by Network Service Providers and other parties used in the formulation of the maps has been provided, compiled and assessed with due care, but may be incomplete and is subject to errors and to change over time as the network situation changes, load projections are amended and operational and technical matters affect network performance and investment. Such changes are likely but not guaranteed to have occurred both prior to and after publication of the maps. </p><p>A “Network Service Provider” referred to above is a person who engages in the activity of owning, controlling or operating a transmission or distribution system in the National Electricity Market and who is registered by AEMO as a Network Service Provider under Chapter 2 of the National Electricity Rules, and includes Electranet, SA Power Networks, TasNetworks, AEMO, United Energy Distribution, Ausnet Services, Jemena, Citipower-Powercor, Evoenergy, Transgrid, Ausgrid, Essential Energy, Endeavour Energy, Powerlink, Ergon Energy, Energex, Western Power, Horizon Power and Power and Water Corporation.</p>",
  },
  {
    name: "Data Currency and Updates",
    content:
      "This layer is updated annually. Currency and next update timing is specified when clicking on a data point in each layer.",
  },
  {
    name: "Data Supplier and Custodian",
    content:
      "The data was supplied by Network Service Providers. The data is stored and processed into mapping outputs by Energy Networks Australia and the Institute of Sustainable Futures (ISF) at the University of Technology Sydney (UTS).",
  },
];

module.exports = function modifyNetworkOpportunities(NetworkOpportunities) {
  const AvailableDistributionCapacity = findInMembers(
    NetworkOpportunities.members,
    ["Available Distribution Capacity"]
  );
  AvailableDistributionCapacity.url =
    "https://network-opportunity-maps.s3-ap-southeast-2.amazonaws.com/constraints/surge/available_capacity_timeseries.csv";
  AvailableDistributionCapacity.featureInfoTemplate.template = availableCapacityTemplate;
  AvailableDistributionCapacity.description =
    "**Note: downloadable spreadsheet and GIS versions of this data can be accessed from the bottom of the [ENA Webpage](https://www.energynetworks.com.au/projects/network-opportunity-maps/).**";
  AvailableDistributionCapacity.info = availableDistInfo;

  AvailableDistributionCapacity.styles = [
    {
      id: "available_capacity",
      color: {
        binMaximums: [-15, -10, -3, 3, 10, 15],
      },
    },
  ];

  const ProposedInvestment = findInMembers(NetworkOpportunities.members, [
    "Proposed Investment",
  ]);
  ProposedInvestment.url =
    "https://network-opportunity-maps.s3-ap-southeast-2.amazonaws.com/constraints/surge/proposed_investment.csv";
  ProposedInvestment.featureInfoTemplate.template = investmentTemplate;
  ProposedInvestment.activeStyle = "deferrable_invest";

  ProposedInvestment.description =
    "**Note: downloadable spreadsheet and GIS versions of this data can be accessed from the bottom of the [ENA Webpage](https://www.energynetworks.com.au/projects/network-opportunity-maps/).**";

  ProposedInvestment.info = proposedInvInfo;

  const investMoneyStyles = ProposedInvestment.styles.filter((s) =>
    /_invest$/.test(s.id)
  );
  investMoneyStyles.map((s) => {
    s.pointSize = { pointSizeColumn: s.id };
    s.color.colorColumn = "invest_year_str";
    s.color.legend = {
      url:
        "https://raw.githubusercontent.com/TerriaJS/saas-catalogs-public/main/nationalmap/images/proposed-investment-legend.png",
    };
  });

  ProposedInvestment.columns.push({
    name: "annual_deferral_pool",
    type: "hidden",
  });

  const enumColors = [
    { value: "Distribution Feeder" },
    { value: "Zone Substation" },
    { value: "Zone Substation (Proposed)" },
    { value: "Subtransmission Line" },
    { value: "Subtransmission Station" },
    { value: "Transmission Connection Point" },
    { value: "Transmission Line" },
    { value: "Transmission Station" },
  ];

  const brewer9ClassSet1 = [
    "#e41a1c",
    "#377eb8",
    "#4daf4a",
    "#984ea3",
    "#ff7f00",
    "#ffff33",
    "#a65628",
    "#f781bf",
    "#999999",
  ];

  enumColors.forEach((c, i) => {
    c.color = brewer9ClassSet1[i];
  });

  ProposedInvestment.styles.push({
    id: "network_element_str",
    color: {
      enumColors,
    },
  });

  const AnnualDeferralValue = findInMembers(NetworkOpportunities.members, [
    "Annual Deferral Value",
  ]);
  AnnualDeferralValue.url =
    "https://network-opportunity-maps.s3-ap-southeast-2.amazonaws.com/constraints/surge/deferral_values_timeseries.csv";
  AnnualDeferralValue.featureInfoTemplate.template = deferralTemplate;

  AnnualDeferralValue.currentTime = "2026";

  AnnualDeferralValue.description =
    "**Note: downloadable spreadsheet and GIS versions of this data can be accessed from the bottom of the [ENA Webpage](https://www.energynetworks.com.au/projects/network-opportunity-maps/).**";

  AnnualDeferralValue.info = annualDeferralInfo;

  const deferralStyle = AnnualDeferralValue.styles[0];
  deferralStyle.color.binMaximums = [10, 50, 100, 200, 500, 1000];
  // const deferraldefaultStyle = AnnualDeferralValue.defaultStyle;
  // deferraldefaultStyle.color.binColors[0] = "rgba(255,255,255,0.0)";

  const AdvColumn = AnnualDeferralValue.columns.find(
    (c) => c.name === "deferral_value"
  );
  AdvColumn.format = { style: "currency", currency: "AUD" };

  const PeakDayCapacity = findInMembers(NetworkOpportunities.members, [
    "Peak Day Available Capacity",
  ]);
  PeakDayCapacity.url =
    "https://network-opportunity-maps.s3-ap-southeast-2.amazonaws.com/constraints/surge/peak_day.csv";
  PeakDayCapacity.featureInfoTemplate.template = peakDayTemplate;

  delete PeakDayCapacity.defaultStyle;

  PeakDayCapacity.styles = [
    {
      id: "percent_available",
      color: {
        binColors: [
          "rgb(215,48,39)",
          "rgb(252,141,89)",
          "rgb(254,224,139)",
          "rgb(217,239,139)",
          "rgb(145,207,96)",
          "rgb(26,152,80)",
        ].reverse(),
        binMaximums: [25, 50, 75, 90, 100],
      },
    },
  ];

  PeakDayCapacity.description =
    "**Note: downloadable spreadsheet and GIS versions of this data can be accessed from the bottom of the [ENA Webpage](https://www.energynetworks.com.au/projects/network-opportunity-maps/).**";

  PeakDayCapacity.info = peakDayInfo;

  // Can't get items to be ordered as I'd like them to be:

  // NetworkOpportunities.members = _.uniq([
  //   AvailableDistributionCapacity,
  //   ProposedInvestment,
  //   AnnualDeferralValue,
  //   PeakDayCapacity,
  //   ...NetworkOpportunities.members,
  // ]);
};
