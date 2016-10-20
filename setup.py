from setuptools import setup, find_packages

version = '0.0.7'

setup(
    name='ckanext-geoview',
    version=version,
    description='CKAN Geospatial ResourceView',
    long_description=''' ''',
    classifiers=[],
    keywords='',
    author='Yoichi Kayama',
    author_email='yoichi.kayama@gmail.com',
    url='http://www.infolocal.jp/ckan2/',
    license='AGPL',
    packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
    namespace_packages=['ckanext', 'ckanext.geoview'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        # -*- Extra requirements: -*-
    ],
    entry_points='''
    [ckan.plugins]
    geo_view=ckanext.geoview.plugin:OLGeoView
    geo_preview=ckanext.geoview.plugin:OLGeoView
    geojson_view=ckanext.geoview.plugin:GeoJSONView
    geojson_preview=ckanext.geoview.plugin:GeoJSONPreview
    wmts_view=ckanext.geoview.plugin:WMTSView
    wmts_preview=ckanext.geoview.plugin:WMTSPreview
    leaflet_view=ckanext.geoview.plugin:LeafletView
    ''',
)
