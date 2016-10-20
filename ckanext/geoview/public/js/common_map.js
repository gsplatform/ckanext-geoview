(function (ckan, jQuery) {

  /* Returns a Leaflet map to use on the different spatial widgets
   *
   * All Leaflet based maps should use this constructor to provide consistent
   * look and feel and avoid duplication.
   *
   * container               - HTML element or id of the map container
   * mapConfig               - (Optional) CKAN config related to the base map.
   *                           These are defined in the config ini file (eg
   *                           map type, API keys if necessary, etc).
   * leafletMapOptions       - (Optional) Options to pass to the Leaflet Map constructor
   * leafletBaseLayerOptions - (Optional) Options to pass to the Leaflet TileLayer constructor
   *
   * Examples
   *
   *   // Will return a map with attribution control
   *   var map = ckan.commonLeafletMap('map', mapConfig);
   *
   *   // For smaller maps where the attribution is shown outside the map, pass
   *   // the following option:
   *   var map = ckan.commonLeafletMap('map', mapConfig, {attributionControl: false});
   *
   * Returns a Leaflet map object.
   */
   
   ckan.commonLeafletMap = function (container,
                                    mapConfig,
                                    ftype,  
                                    leafletMapOptions,
                                    leafletBaseLayerOptions) {

      var isHttps = window.location.href.substring(0, 5).toLowerCase() === 'https';
      var mapConfig = mapConfig || {type: 'mapquest'};
      var leafletMapOptions = leafletMapOptions || {};
      var leafletBaseLayerOptions = jQuery.extend(leafletBaseLayerOptions, {
             minZoom: 2,                
             maxZoom: 18,
             zoom: 11,
             center: [35.6707, 139.7852]
                });

      map = new L.Map(container, leafletMapOptions);

      if (mapConfig.type == 'mapbox') {
          // MapBox base map
          if (!mapConfig['mapbox.map_id'] || !mapConfig['mapbox.access_token']) {
            throw '[CKAN Map Widgets] You need to provide a map ID ([account].[handle]) and an access token when using a MapBox layer. ' +
                  'See http://www.mapbox.com/developers/api-overview/ for details';
          }

          baseLayerUrl = '//{s}.tiles.mapbox.com/v4/' + mapConfig['mapbox.map_id'] + '/{z}/{x}/{y}.png?access_token=' + mapConfig['mapbox.access_token'];
          leafletBaseLayerOptions.handle = mapConfig['mapbox.map_id'];
          leafletBaseLayerOptions.subdomains = mapConfig.subdomains || 'abcd';
          leafletBaseLayerOptions.attribution = mapConfig.attribution || 'Data: <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a>, Design: <a href="http://mapbox.com/about/maps" target="_blank">MapBox</a>';
      } else if (mapConfig.type == 'custom') {
          // Custom XYZ layer
          baseLayerUrl = mapConfig['custom.url'];
          if (mapConfig.subdomains) leafletBaseLayerOptions.subdomains = mapConfig.subdomains;
          leafletBaseLayerOptions.attribution = mapConfig.attribution;
      } else {
          // MapQuest OpenStreetMap base map
          if (isHttps) {
            baseLayerUrl = '//otile{s}-s.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
          } else {
            baseLayerUrl = '//otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
          }
          leafletBaseLayerOptions.subdomains = mapConfig.subdomains || '1234';
          leafletBaseLayerOptions.attribution = mapConfig.attribution || 'Map data &copy; OpenStreetMap contributors, Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="//developer.mapquest.com/content/osm/mq_logo.png">';
      }


      var baseLayer = new L.TileLayer.Grayscale(baseLayerUrl, leafletBaseLayerOptions);
      map.addLayer(baseLayer);

      var std = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',{id: 'std', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>",minZoom: 2,maxZoom: 18}),
      pale = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',{id: 'pale', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>",minZoom: 2,maxZoom: 18}),
      ort = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',{id: 'ort', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>",minZoom: 2,maxZoom: 18}),
      relief = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png',{id: 'relief', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>",minZoom: 5,maxZoom: 15}),
      osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ id: 'osmmap', attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });
      var toner = new L.StamenTileLayer("toner", {'name': 'maps.stamen.com toner', id: 'toner'});

      baseMaps = {
        "地理院地図（グレー）" : baseLayer,
        "地理院地図（カラー）": std,
        "地理院地図（淡色）": pale,
        "国土地理院 航空写真": ort,
        "国土地理院 色別標高図": relief,
        "OpenStreetMap": osm,
        "Toner": toner
      };
      if(ftype!='Leaflet')
      {L.control.layers(baseMaps).addTo(map);}
      else
      {map.baseMaps=baseMaps}; 

      return map;

  }

})(this.ckan, this.jQuery);
