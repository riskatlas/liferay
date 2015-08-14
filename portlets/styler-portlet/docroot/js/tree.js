Ext.namespace("WHO.tree");
WHO.tree.TristateCheckboxNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    constructor: function (config) {
        WHO.tree.TristateCheckboxNodeUI.superclass.constructor.apply(this, arguments);
    },
    toggleCheck: function (value, thirdState, options) {
        var cb = this.checkbox;
        if (thirdState == true) {
            if (cb) {
                Ext.get(cb).setOpacity(0.5);
            }
            this.node.attributes.thirdState = true;
        } else {
            if (cb) {
                Ext.get(cb).clearOpacity();
            }
            delete this.node.attributes.thirdState;
        }
        if (options && options.silent == true) {
            this.node.suspendEvents();
        }
        WHO.tree.TristateCheckboxNodeUI.superclass.toggleCheck.call(this, value);
        this.node.resumeEvents();
    }
});
Ext.namespace("WHO.tree");
WHO.tree.LayerContainer = Ext.extend(Ext.tree.TreeNode, {
    map: null,
    constructor: function (config) {
        this.map = config.map;
        WHO.tree.LayerContainer.superclass.constructor.apply(this, arguments);
    },
    render: function (bulkRender) {
        if (!this.rendered) {
            var map = this.map instanceof OpenLayers.Map ? this.map : (typeof this.map == "string" ? Ext.getCmp(this.map).map : Ext.ComponentMgr.all.find(function (o) {
                return o.map instanceof OpenLayers.Map;
            }).map);
            if (map.layers) {
                var layer, node;
                for (var i = 0, len = map.layers.length; i < len; ++i) {
                    layer = map.layers[i];
                    this.addLayerNode(layer);
                }
            }
            map.events.register("addlayer", this, function (e) {
                this.addLayerNode(e.layer);
            });
            map.events.register("removelayer", this, function (e) {
                this.removeLayerNode(e.layer);
            });
        }
        WHO.tree.LayerContainer.superclass.render.call(this, bulkRender);
    },
    addLayerNode: function (layer) {
        if (layer.displayInLayerSwitcher == true) {
            node = new WHO.tree.LayerNode({
                iconCls: layer.isBayeLayer ? 'baselayer-icon' : 'layer-icon',
                layer: layer
            });
            this.appendChild(node);
        }
    },
    removeLayerNode: function (layer) {
        if (layer.displayInLayerSwitcher == true) {
            var node = this.findChildBy(function (node) {
                return node.layer == layer;
            });
            if (node) {
                node.remove();
            }
        }
    }
});
Ext.tree.TreePanel.nodeTypes.olLayerContainer = WHO.tree.LayerContainer;
Ext.namespace("WHO.tree");
WHO.tree.OverlayLayerContainer = Ext.extend(WHO.tree.LayerContainer, {
    constructor: function (config) {
        config.text = config.text || "Overlays";
        WHO.tree.OverlayLayerContainer.superclass.constructor.apply(this, arguments);
    },
    addLayerNode: function (layer) {
        if (layer.isBaseLayer == false) {
            WHO.tree.OverlayLayerContainer.superclass.addLayerNode.call(this, layer);
        }
    },
    removeLayerNode: function (layer) {
        if (layer.isBaseLayer == false) {
            WHO.tree.OverlayLayerContainer.superclass.removeLayerNode.call(this, layer);
        }
    }
});
Ext.tree.TreePanel.nodeTypes.olOverlayLayerContainer = WHO.tree.OverlayLayerContainer;
Ext.namespace("WHO.tree");
WHO.tree.TristateCheckboxNode = Ext.extend(Ext.tree.AsyncTreeNode, {
    checkedChildNodes: null,
    checkedCount: null,
    constructor: function (config) {
        this.checkedChildNodes = {};
        this.checkedCount = 0;
        this.defaultUI = this.defaultUI || WHO.tree.TristateCheckboxNodeUI;
        this.addEvents.apply(this, WHO.tree.TristateCheckboxNode.EVENT_TYPES);
        WHO.tree.TristateCheckboxNode.superclass.constructor.apply(this, arguments);
        this.on("childcheckchange", this.updateCheckedChildNodes, this);
    },
    render: function (bulkRender) {
        var rendered = this.rendered;
        var checked = this.attributes.checked;
        this.attributes.checked = typeof this.attributes.checked == "undefined" ? false : this.attributes.checked;
        WHO.tree.TristateCheckboxNode.superclass.render.call(this, bulkRender);
        var ui = this.getUI();
        if (!rendered) {
            if (typeof checked == "undefined" && this.parentNode.ui.checkbox) {
                ui.toggleCheck(this.parentNode.ui.checkbox.checked);
            }
            this.parentNode.on("checkchange", function (node, checked) {
                ui.toggleCheck(checked);
            }, this);
        }
    },
    updateCheckedChildNodes: function (node, checked) {
        if (checked) {
            this.addChecked(node, node.attributes.thirdState);
        } else {
            this.removeChecked(node);
        }
        var childrenChecked, childrenThirdState;
        if (this.checkedCount.toFixed() == this.childNodes.length) {
            childrenChecked = true;
            childrenThirdState = false;
        } else if (this.checkedCount.toFixed(1) == 0) {
            childrenChecked = false;
            childrenThirdState = false;
        } else {
            childrenChecked = true;
            childrenThirdState = true;
        }
        this.getUI().toggleCheck(childrenChecked, childrenThirdState, {
            silent: true
        });
        if (this.parentNode) {
            this.parentNode.fireEvent("childcheckchange", this, childrenChecked);
        }
    },
    appendChild: function (node) {
        WHO.tree.TristateCheckboxNode.superclass.appendChild.call(this, node);
        if (this.attributes.checked || node.attributes.checked) {
            this.addChecked(node);
        }
        node.on("checkchange", function (node, checked) {
            if (this.childrenRendered) {
                this.fireEvent("childcheckchange", node, checked);
            }
        }, this);
    },
    addChecked: function (node, thirdState) {
        this.checkedCount -= (this.checkedChildNodes[node.id] || 0);
        var add = thirdState ? 0.1 : 1;
        this.checkedChildNodes[node.id] = add;
        this.checkedCount += add;
    },
    removeChecked: function (node) {
        var remove = this.checkedChildNodes[node.id];
        if (remove) {
            delete this.checkedChildNodes[node.id];
            this.checkedCount -= remove;
        }
    }
});
WHO.tree.TristateCheckboxNode.EVENT_TYPES = ["childcheckchange"];
Ext.tree.TreePanel.nodeTypes.tristateCheckbox = WHO.tree.TristateCheckboxNode;
Ext.namespace("WHO.tree");
WHO.tree.LayerNode = Ext.extend(WHO.tree.TristateCheckboxNode, {
    layer: null,
    map: null,
    haveLayer: null,
    updating: false,
    constructor: function (config) {
        this.layer = config.layer;
        this.map = config.map;
        this.haveLayer = false;
        config.leaf = config.leaf || !config.children;
        config.iconCls = typeof config.iconCls == "undefined" && !config.children ? "layer-icon" : config.iconCls;
        config.checked = false;
        this.defaultUI = this.defaultUI || WHO.tree.LayerNodeUI;
        this.addEvents.apply(this, WHO.tree.LayerNode.EVENT_TYPES);
        WHO.tree.LayerNode.superclass.constructor.apply(this, arguments);
    },
    render: function (bulkRender) {
        if (!this.rendered || !this.haveLayer) {
            var map = this.map instanceof OpenLayers.Map ? this.map : (typeof this.map == "string" ? Ext.getCmp(this.map).map : Ext.ComponentMgr.all.find(function (o) {
                return o.map instanceof OpenLayers.Map;
            }).map);
            var layer = this.attributes.layer || this.layer;
            this.haveLayer = layer && typeof layer == "object";
            if (typeof layer == "string") {
                var matchingLayers = map.getLayersByName(layer);
                if (matchingLayers.length > 0) {
                    layer = matchingLayers[0];
                    this.haveLayer = true;
                }
            }
            var ui = this.getUI();
            if (this.haveLayer) {
                this.attributes.layer = layer;
                layer.queryable = true;
                if (layer.queryable == true) {
                    this.attributes.radioGroup = layer.map.id;
                }
                if (!this.text) {
                    this.text = layer.name;
                }
                ui.show();
                ui.toggleCheck(layer.getVisibility());
                layer.events.register("visibilitychanged", this, function () {
                    this.updating = true;
                    if (this.attributes.checked != layer.getVisibility()) {
                        ui.toggleCheck(layer.getVisibility());
                    }
                    this.updating = false;
                });
                this.on("checkchange", function (node, checked) {
                    if (!this.updating) {
                        if (checked && layer.isBaseLayer) {
                            map.setBaseLayer(layer);
                        }
                        layer.setVisibility(checked);
                    }
                }, this);
                this.attributes.checked = layer.getVisibility();
            } else {
                ui.hide();
            }
            map.events.register("addlayer", this, function (e) {
                if (layer == e.layer) {
                    this.getUI().show();
                } else if (layer == e.layer.name) {
                    this.render(bulkRender);
                    return;
                }
            });
            map.events.register("removelayer", this, function (e) {
                if (layer == e.layer) {
                    this.getUI().hide();
                }
            });
        }
        WHO.tree.LayerNode.superclass.render.call(this, bulkRender);
    }
});
WHO.tree.LayerNode.EVENT_TYPES = ["querylayerchange"];
Ext.tree.TreePanel.nodeTypes.olLayer = WHO.tree.LayerNode;
Ext.namespace("WHO.tree");
WHO.tree.LayerNodeUI = Ext.extend(WHO.tree.TristateCheckboxNodeUI, {
    radio: null,
    constructor: function (config) {
        WHO.tree.LayerNodeUI.superclass.constructor.apply(this, arguments);
    },
    render: function (bulkRender) {
        WHO.tree.LayerNodeUI.superclass.render.call(this, bulkRender);
        var a = this.node.attributes;
        if (a.radioGroup && !this.radio) {
            this.radio = Ext.DomHelper.insertAfter(this.checkbox, ['<input type="radio" class="x-tree-node-cb" name="', a.radioGroup, '_querylayer"></input>'].join(""));
        }
    },
    onClick: function (e) {
        if (e.getTarget('input[type=radio]', 1)) {
            this.fireEvent("querylayerchange", this.node.attributes.layer);
        } else {
            WHO.tree.LayerNodeUI.superclass.onClick.call(this, e);
        }
    },
    destroy: function () {
        WHO.tree.LayerNodeUI.superclass.destroy.call(this);
        delete this.radio;
    }
});

