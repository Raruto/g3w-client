export default {
  translation: {
    cookie_law: {
      message: "This website uses cookies to ensure you get the best experience on our website.",
      buttonText: "Got It!"
    },
    default:"default",
    sign_in: "Sign in",
    layer_selection_filter: {
      tools: {
        filter: "Add/Remove Filter",
        nofilter: "Remove Filter",
        invert: "Invert Selection",
        clear: "Clear Selection",
        show_features_on_map: "Show features visible on map"
      }
    },
    warning: {
      not_supported_format: "Not supported format"
    },
    layer_position: {
      top: 'TOP',
      bottom: 'BOTTOM',
      message: "Position relative to layers on TOC"
    },
    sdk: {
      search: {
        all: 'ALL',
        no_results: "No results",
        searching: "Searching ...",
        error_loading: "Error Loading Data",
        layer_not_searchable: "Layer is not searchable",
        layer_not_querable: "Layer is not querable",
        autocomplete: {
          inputshort: {
            pre: "Please enter",
            post: "or more characters"
          }
        }
      },
      print: {
        no_layers: 'No Layer to print',
        template: "Template",
        labels: "Labels",
        scale: "Scale",
        format: "Format",
        rotation: "Rotation",
        download_image: "Download Image",
        fids_instruction: "Values accepted: from 1 to value of [max]. Is possible to insert a range ex. 4-6",
        fids_example: "Ex. 1,4-6 will be printed id 1,4,5,6",
        help: "The layers shown in the print could be those defined on the project and not those displayed on the map"
      },
      querybuilder: {
        search: {
          run: "Run",
          info: "Information",
          delete: "Delete",
          edit: "Edit"
        },
        messages: {
          changed: 'Saved',
          number_of_features: "Number of features"
        },
        panel: {
          button: {
            all: 'ALL',
            save: 'SAVE',
            test: 'TEST',
            clear: 'CLEAR',
            run: 'RUN',
            manual: 'MANUAL'
          },
          layers: 'LAYERS',
          fields: 'FIELDS',
          values: 'VALUES',
          operators: 'OPERATORS',
          expression: 'EXPRESSION'
        },
        error_run: 'An error occurs. Please check the query',
        error_test: "An error occur during query execution",
        delete: 'Do you want delete it?',
        additem: 'Insert the name of the new search'
      },
      errors: {
        layers: {
          load: "Some layers are not available"
        },
        unsupported_format: 'Not supported format',
        add_external_layer: 'Load layer error'
      },
      metadata: {
        title: 'Metadata',
        groups: {
          general: {
            title: 'GENERAL',
            fields: {
              title: 'TITLE',
              name: 'NAME',
              description: "DESCRIPTION",
              abstract: "ABSTRACT",
              keywords: 'KEYWORDS',
              fees: "FEES",
              accessconstraints: "ACCESS CONSTRAINT",
              contactinformation: "CONTACTS",
              subfields: {
                contactinformation: {
                  contactelectronicmailaddress: "Email",
                  personprimary: 'Refereces',
                  contactvoicetelephone: 'Phone',
                  contactorganization: 'Organization',
                  ContactOrganization: 'Organization',
                  contactposition: 'Position',
                  ContactPosition: 'Position',
                  contactperson: 'Person',
                  ContactPerson: 'Person'
                }
              },
              wms_url: "WMS"
            }
          },
          spatial:{
            title: 'SPATIAL',
            fields : {
              crs: 'EPSG',
              extent: 'BBOX'
            }
          },
          layers: {
            title: 'LAYERS',
            fields: {
              layers: 'LAYERS',
              subfields: {
                crs: 'EPSG',
                bbox: 'BBOX',
                title: "TITLE",
                name: 'NAME',
                geometrytype: 'GEOMETRY',
                source: 'SOURCE',
                attributes: 'ATTRIBUTES',
                abstract: 'ABSTRACT',
                attribution: 'ATTRIBUTION',
                keywords: "PAROLE CHIAVE",
                metadataurl:'METADATA URL',
                dataurl: "DATA URL"
              }
            },
            groups : {
              general: 'GENERAL',
              spatial: 'SPATIAL'
            }
          }
        }
      },
      tooltips: {
        relations: {
          form_to_row: "Row View",
          row_to_form: "Form View"
        },
        copy_map_extent_url: 'Copy map view link',
        download_shapefile: "Download Shapefile",
        download_gpx: "Download GPX",
        download_gpkg: "Download GPKG",
        download_csv: "Download CSV",
        download_xls: "Download XLS",
        show_chart: "Show Chart",
        atlas: "Print Atlas"
      },
      mapcontrols: {
        query: {
          tooltip: 'Query layer',
          actions: {
            add_selection: {
              hint: "Add/Remove Selection"
            },
            zoom_to_features_extent:{
              hint: "Zoom to features extent"
            },
            add_features_to_results: {
              hint: "Add/Remove features to results"
            },
            remove_feature_from_results: {
              hint: "Remove feature from results"
            },
            zoom_to_feature: {
              hint: "Zoom to feature"
            },
            relations: {
              hint: "Show Relations"
            },
            relations_charts: {
              hint: "Show relations chart"
            },
            download_features_shapefile:{
              hint: 'Download features Shapefile'
            },
            download_shapefile: {
              hint: 'Download feature Shapefile'
            },
            download_features_gpx: {
              hint: "Download feature GPX"
            },
            download_features_gpkg: {
              hint: "Download features GPKG"
            },
            download_gpx: {
              hint: "Download feature GPX"
            },
            download_gpkg: {
              hint: "Download feature GPKG"
            },
            download_features_csv: {
              hint: "Download features CSV"
            },
            download_csv: {
              hint: "Download feature CSV"
            },
            download_features_xls: {
              hint: "Download features XLS"
            },
            download_xls: {
              hint: "Download feature XLS"
            },
            atlas: {
              hint: "Print Atlas"
            },
            copy_zoom_to_fid_url: {
              hint: "Copy map URL with this geometry feature extension",
              hint_change: "Copied"
            }
          }
        },
        querybypolygon: {
          download: {
            title: "Attributes download",
            choiches:{
              feature: {
                label:"Features only",
              },
              feature_polygon: {
                label:"Features+Query Polygon",
              }
            }
          },
          tooltip: 'Query By Polygon',
          no_geometry: 'No geometry on response',
          help: {
            title:'Guide - Query By Polygon',
            message: `
                <ul>
                  <li>Select a polygon layer on TOC.</li>
                  <li>Be sure that layer is visible.</li>
                  <li>Click on a feature of selected layer.</li>
                </ul>`
          }
        },
        querybybbox: {
          tooltip: 'Query BBox layer',
          nolayers_visible: 'No querable layers are visible. Please set at least one visible wfs layer to run query',
          help: {
            title: 'Guide - Query BBox layer',
            message:`
                  <ul>
                  <li>Draw a square on map to query underlined layers on TOC</li>
                  </ul>`
          }
        },
        addlayer: {
          messages: {
            csv: {
              warning: "The result in the map is partial due to the presence of the below incorrect records list:"
            }
          },
          tooltip: 'Add Layer'
        },
        geolocation: {
          tooltip: 'Geolocation'
        },
        measures: {
          length: {
            tooltip: "Length",
            help: "Click on map to draw the line. Press <br>CANC if you want delete last vertex",
          },
          area: {
            tooltip: "Area",
            help: "Click to draw poligon.Press <br>CANC if you want delete last vertex"
          }
        },
        scale: {
          no_valid_scale: "Invalid Scale"
        },
        scaleline: {
          units: {
            metric: 'Meters',
            nautical: 'Nautical Mile'
          }
        }
      },
      relations: {
        relation_data: 'Relation data',
        no_relations_found: 'No relations found',
        back_to_relations: 'Back to relations',
        list_of_relations_feature: 'List of relations of feature',
        error_missing_father_field: "Field is missing"
      },
      workflow: {
        steps: {
          title: 'Steps',
        },
        next: 'Next'
      },
      form: {
        loading: 'Loading ...',
        inputs: {
          messages: {
            errors: {
              picklayer: "No feature selected. Check if layer is on editing or visible at current scale"
            }
          },
          tooltips:{
            picklayer: "Get value from ma layer",
            lonlat: "Click on map to get coordinates"
          },
          input_validation_mutually_exclusive: "Field mutually exclusive with ",
          input_validation_error: "Mandatory Field or wrong data type",
          input_validation_min_field: "Value has to be more/equal to field value  ",
          input_validation_max_field: "Value has to be less/equal to field value ",
          input_validation_exclude_values: "Value has to be unique",
          integer: "integer",
          bigint: "integer",
          text: "text",
          varchar: "text",
          textarea: "text",
          string: "string",
          date: "date",
          float: "float",
          table: "table"
        },
        footer: {
          "required_fields": "Required fields"
        },
        messages: {
          qgis_input_widget_relation: "Use relation specific form to work with relation"
        }
      },
      catalog: {
        current_map_theme_prefix: "THEME",
        choose_map_theme: "CHOOSE THEME",
        menu: {
          layerposition: 'Layer Position',
          setwmsopacity: "Set Opacity",
          wms: {
            title:"",
            copy: "Click here to copy url",
            copied: "Copied"
          },
          download: {
            shp: 'Download Shapefile',
            gpx: 'Download GPX',
            gpkg: 'Download GPKG',
            csv: 'Download CSV',
            xls: 'Download XLS',
            geotiff: "Download GEOTIFF",
            geotiff_map_extent: "Download GEOTIFF(current view extent)"
          }
        }
      },
      wps: {
        list_process: "List of process",
        tooltip: 'Click on map'
      }
    },
    credits: {
      g3wSuiteFramework: "Application based on OS framework",
      g3wSuiteDescription: "Publish and manage your QGIS projects on the web",
      productOf: "Framework developed by",
    },
    toggle_color_scheme: "Toggle color scheme",
    logout: "Logout",
    no_other_projects: "No more project for this group",
    yes: "Yes",
    no: "No",
    back: "Back",
    backto: "Back to ",
    changemap: "Change Map",
    component: "Generic Component",
    search: "Search",
    no_results: "No results found",
    print: "Print",
    create_print: "Create Print",
    dosearch: "Search",
    catalog: "Map",
    data: "Data",
    externalwms: "WMS",
    baselayers: "Base",
    tools: "Tools",
    tree: "Layers",
    legend: "Legend",
    nobaselayer: "No basemap",
    street_search: "Find Address",
    show: "Show",
    hide: "Hide",
    copy_form_data: "Copy data",
    paste_form_data: "Paste",
    copy_form_data_from_feature: "Copy data from map",
    error_map_loading: "Error occurs loading map",
    check_internet_connection_or_server_admin: "Check internet connection or contact admin",
    could_not_load_vector_layers: "Connection error: Layers can be loaded",
    server_saver_error: "Error in server saving",
    server_error: "Server connection error",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    enlange_reduce:"Enlarge/Reduce",
    reset_default:"Default size",
    add: "Add",
    exitnosave: "Exit without save",
    annul: "Cancel",
    layer_is_added: "Layer with same name already added",
    sidebar: {
      wms: {
        panel: {
          title:'Add WMS Layer',
          label: {
            position: "Map Position",
            name: "Name",
            projections: 'Projection',
            layers: 'Layers'
          }
        },
        add_wms_layer: "Add WMS layer",
        delete_wms_url: "Delete WMS url",
        layer_id_already_added: "WMS Layer already added",
        url_already_added: "WMS URL already added",
        layer_add_error: "WMS Layer not added. Please check all wms parameter or url"
      }
    },
    info: {
      title: "Results",
      list_of_relations: "List of Relations",
      open_link: "Open attached document",
      server_error: "An error occurred from server",
      no_results: "No results found for this query/search",
      link_button: "Open"
    },
    mapcontrols: {
      geolocations: {
        error: "Can't get your position"
      },
      nominatim: {
        placeholder: "Address ...",
        noresults: "No results",
        notresponseserver: "No response from server"
      },
      add_layer_control: {
        header: "Add Layer",
        select_projection: "Select layer projection",
        select_field_to_show: "Select Field to show on map",
        select_csv_separator: "Select delimiter",
        select_csv_x_field: "Select X field",
        select_csv_y_field: "Select Y field",
        select_color: "Select Layer Color",
        drag_layer: "Drag and drop layer here"
      },
      query: {
        input_relation: "Click to show relations"
      },
      length: {
        tooltip: "Length"
      },
      area: {
        tooltip: "Area"
      },
      screenshot: {
        error: "Screenshot error creation"
      }
    },
    catalog_items: {
      helptext: "Right-click on individual layer to access additional features",
      contextmenu: {
        zoomtolayer: "Zoom to Layer",
        open_attribute_table: "Open Attribute Table",
        show_metadata: "Metadata",
        styles: 'Styles',
        vector_color_menu:"Set/Change Color"
      }
    },
    dataTable: {
      previous: "Previous",
      next: "Next",
      lengthMenu: "Show _MENU_",
      info: "Showing _START_ to _END_ of _TOTAL_ entries",
      no_data: "No data",
      nodatafilterd: "No matching records found",
      infoFiltered: "(filtered from _MAX_ total records)"
    }
  },
};