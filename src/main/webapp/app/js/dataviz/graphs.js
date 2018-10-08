function GraphsFactory() {
  //var layout, graph, graphics, nodeSize, renderer;
  function createGraph(container, data, nodeConstructor) {
    var self = this;

    if (this.renderer) {
      this.renderer.dispose();
    }

    this.graph = Viva.Graph.graph();
    this.layout = Viva.Graph.Layout.forceDirected(this.graph, {
      springLength : 55,
      springCoeff : 0.0008,
      dragCoeff : 0.05,
      gravity : -1.2,
      theta : 0.8,
      timeStep: 20
    });

    this.graphics = Viva.Graph.View.svgGraphics();

    if (nodeConstructor && typeof nodeConstructor === "function") {
      this.graphics.node(nodeConstructor).placeNode(this.placeNodeHandler);
    } else {
      this.graphics.node(function(node) {
        var nodeSize = 8;
        if (node.data.name==="Pueblo Mágico") {
          nodeSize = 15;
        }

        var ui = Viva.Graph.svg('g');
        var svgText = Viva.Graph.svg('text')
          .attr('x', ((nodeSize*2)+'px'))
          .attr('y', (nodeSize+'px'))
          .text(node.data.name);
        var img = Viva.Graph.svg('circle')
               .attr('r', nodeSize)
               .attr('cx', nodeSize)
               .attr('cy', nodeSize)
               .attr('class', node.data.styleid);
        ui.append(svgText);
        ui.append(img);

        $(ui).click(function() {
          angular.element(document.getElementById('ontView')).scope().setSelectedNode(node.data);
        });
        return ui;
      }).placeNode(this.placeNodeHandler);
    }

    this.renderer = Viva.Graph.View.renderer(this.graph, {
      graphics : self.graphics,
      renderLinks : true,
      container: document.getElementById(container),
      //layout: self.layout,
      prerender: true
    });

    if (data) {
      var newSet = {};
      newSet.nodes = data.nodes;
      var nodesHash = newSet.nodes.map(function(item) {
        return item.id;
      });

      newSet.edges = data.edges.filter(function(item) {
        return nodesHash.indexOf(item.source) > -1 && nodesHash.indexOf(item.target) > -1;
      });

      newSet.nodes.forEach(function(node) {
        self.graph.addNode(node.id, node);
      });

      newSet.edges.forEach(function(edge) {
        self.graph.addLink(edge.source, edge.target);
      });

      /*for (var i = 0; i < 2000; ++i) {
        this.layout.step();
      }*/

      self.renderer.run();
    }
  }

  function destroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  function placeNodeHandler(nodeUI, pos) {
    var nodeSize = 8;
    nodeUI.attr('transform',
      'translate(' +
        (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) +
                  ')');
  }
}
