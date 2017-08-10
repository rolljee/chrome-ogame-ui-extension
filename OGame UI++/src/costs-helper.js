var fn = function () {
  'use strict';
  window._addCostsHelperInterval = function _addCostsHelperInterval () {
    var worth = window.uipp_getResourcesWorth();
    var resources = window._getCurrentPlanetResources();

    if (!resources) {
      return;
    }

    var resNames = ['metal', 'crystal', 'deuterium'];
    var availableIn = {};

    setInterval(function () {
      var costs = {};
      resNames.forEach(function (res) {
        costs[res] = window._gfNumberToJsNumber($('.' + res + '.tooltip .cost').first().text().trim()),
        availableIn[res] = (costs[res] - resources[res].now) / resources[res].prod;
      });

      if (isNaN(availableIn.deuterium)) { // we may not produce any deuterium...
        availableIn.deuterium = costs.deuterium > resources.deuterium.now ? 8553600 : 0;
      }

      if (costs.metal || costs.crystal || costs.deuterium) {
        _addProductionEconomyTimeTextHelper(costs);
        _addProductionRentabilityTimeTextHelper(costs);
      }
    }, 100);

    function _addProductionEconomyTimeTextHelper (costs) {
      var $el = $('#content .production_info:not(.enhanced-economy-time)');
      $el.addClass('enhanced-economy-time');

      var totalPrice = costs.metal * worth.metal
        + costs.crystal * worth.crystal
        + costs.deuterium * worth.deuterium;
      var totalProd = resources.metal.prod * worth.metal
        + resources.crystal.prod * worth.crystal
        + resources.deuterium.prod * worth.deuterium;

      $el.append('<li class="enhancement">' + window._translate('ECONOMY_TIME', {
        time: window._time(totalPrice / totalProd)
      }) + '</li>');
    }

    function _addProductionRentabilityTimeTextHelper () {
      var tradeRateStr = window.config.tradeRate.map(String).join(' / ');

      // if we are viewing a metal mine, computes rentability time
      if ($('#resources_1_large:not(.enhanced)').length > 0) {
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('metal', resources.metal.prod, resources.metal.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_1_large').addClass('enhanced');
      }

      // if we are viewing a crystal mine, computes rentability time
      else if ($('#resources_2_large:not(.enhanced)').length > 0) {
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('crystal', resources.crystal.prod, resources.crystal.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_2_large').addClass('enhanced');
      }

      // if we are viewing a deuterium mine, computes rentability time
      else if ($('#resources_3_large:not(.enhanced)').length > 0) {
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('deuterium', resources.deuterium.prod, resources.deuterium.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_3_large').addClass('enhanced');
      }

      // if we are viewing a plasma technology, computes rentability time
      else if ($('#research_122_large:not(.enhanced)').length > 0) {
        var technologyLevel = Number($('#content span.level').text().trim().split(' ').pop()) || 0;
        var rentabilityTime = window._getRentabilityTime('plasma', null, technologyLevel);
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(rentabilityTime),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#research_122_large').addClass('enhanced');
      }
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
