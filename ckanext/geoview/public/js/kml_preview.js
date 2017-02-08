// geojson preview module
ckan.module('kmlpreview', function (jQuery, _) {
  return {
    options: {
      table: '<div class="table-container"><table class="table table-striped table-bordered table-condensed"><tbody>{body}</tbody></table></div>',
      row:'<tr><th>{key}</th><td>{value}</td></tr>',
      style: {
        opacity: 0.7,
        fillOpacity: 0.1,
        weight: 2
      },
      i18n: {
        'error': _('An error occurred: %(text)s %(error)s')
      }
    },
    initialize: function () {
      var self = this;
      var latlng = L.latLng(35.7, 139.8);

      self.el.empty();
      self.el.append($("<div></div>").attr("id","map"));
      self.map = ckan.commonLeafletMap('map', this.options.map_config);

      // hack to make leaflet use a particular location to look for images
      L.Icon.Default.imagePath = this.options.site_url + 'js/vendor/leaflet/images';

      var kmlLayer = omnivore.kml(preload_resource['url']).on('ready', function() {self.map.fitBounds(kmlLayer.getBounds());}).addTo(self.map);
        
    }
  };
});
