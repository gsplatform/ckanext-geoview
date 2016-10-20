// leaflet preview module
ckan.module('leafletpreview', function (jQuery, _) {
  return {
    options: {
      table: '<div class="table-container"><table class="table table-striped table-bordered table-condensed"><tbody>{body}</tbody></table></div>',
      row:'<tr><th>{key}</th><td>{value}</td></tr>',
      style: {
        opacity: 0.7,
        fillOpacity: 0.1,
        weight: 2
      },
      zoom: 11,
      center: [35.6707, 139.7852],
      i18n: {
        'error': _('An error occurred: %(text)s %(error)s')
      }
    },
    initialize: function () {
      var self = this;
      var latlng = L.latLng(35.7, 139.8);
      var basemaps = {};

      self.el.empty();
      self.el.append($("<div></div>").attr("id","map"));
      self.map = ckan.commonLeafletMap('map', this.options.map_config,'Leaflet');

      switch(preload_resource['format']) 
      {  
         case "GeoJSON":

           jQuery.getJSON(preload_resource['url']).done(
             function(data){
              self.showPreview(data);
             })
           .fail(
           function(jqXHR, textStatus, errorThrown) {
              self.showError(jqXHR, textStatus, errorThrown);
             }
           );
           break;

         case "KML": 

           L.Icon.Default.imagePath = this.options.site_url + 'js/vendor/leaflet/images';         
           var kmlLayer = omnivore.kml(preload_resource['url']).on('ready', function() {self.map.fitBounds(kmlLayer.getBounds());}).addTo(self.map);
           L.control.layers(map.baseMaps,{"KML": kmlLayer}).addTo(map);
           break;

         case "WMS":

           $.ajax({
             type: 'POST',
             url: '/top/php/getlayers.php', 
             data: {'url': preload_resource['original_url'] },
             success: function(res) {
               if (res.error) {
                   $("#warning-contents").html(res.error);
               }
               if (res.result) {
                  var layers = res.result.layers;
                  map.fitBounds([
                    [res.result.ymin, res.result.xmin],
                    [res.result.ymax, res.result.xmax]
                  ]);

                  tmp = preload_resource['original_url'].split("?");
                  url = tmp[0] + '?';
                  var source = L.WMS.source(url, {
                    transparent: true,
                    opacity:0.6 
                  });
                  var overmaps = {};
                  var tlayers = {};
                  var lname;

                  for(tlayer in layers.layergroup[0].layers)
                  {
                    lname = layers.layergroup[0].layers[parseInt(tlayer)].id;
                    var ttlayer = source.getLayer(lname);
                    overmaps[lname] = ttlayer;
                  }
                  L.control.layers(map.baseMaps,overmaps).addTo(map);
               }
           },
           error: function(res) {
              $("#warning-contents").html("サーバとの通信に失敗しました");
           }
         });

         self.map.setView(latlng,11);
         break;
      }
    
    },
    showError: function (jqXHR, textStatus, errorThrown) {
      if (textStatus == 'error' && jqXHR.responseText.length) {
        this.el.html(jqXHR.responseText);
      } else {
        this.el.html(this.i18n('error', {text: textStatus, error: errorThrown}));
      }
    },

    showPreview: function (geojsonFeature) {
      var self = this;
      var gjLayer = L.geoJson(geojsonFeature, {
        style: self.options.style,
        onEachFeature: function(feature, layer) {
          var body = '';
          if (feature.properties) {
            jQuery.each(feature.properties, function(key, value){
              if (value != null && typeof value === 'object') {
                value = JSON.stringify(value);
              }
              body += L.Util.template(self.options.row, {key: key, value: value});
            });
            var popupContent = L.Util.template(self.options.table, {body: body});
            layer.bindPopup(popupContent);
          }
        }
      }).addTo(self.map);
      L.control.layers(map.baseMaps,{"GeoJSON": gjLayer}).addTo(map);
      self.map.fitBounds(gjLayer.getBounds());
    }

  };
});
