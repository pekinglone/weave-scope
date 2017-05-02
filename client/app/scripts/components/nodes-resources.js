import React from 'react';
import { connect } from 'react-redux';
import { Map as makeMap } from 'immutable';

import Logo from './logo';
import ZoomWrapper from './zoom-wrapper';
import NodesResourcesLayer from './nodes-resources/node-resources-layer';
import { layersTopologyIdsSelector } from '../selectors/resource-view/layout';
import {
  resourcesZoomLimitsSelector,
  resourcesZoomStateSelector,
} from '../selectors/resource-view/zoom';


class NodesResources extends React.Component {
  renderLayout(transform) {
    return (
      <NodesResourcesLayer
        topologyId={this.props.layersTopologyIds.first()}
        nodesIds={this.props.baseNodesIds}
        transform={transform}
        offset={0}
        width={100}
        scale={1}
      />
    );
  }

  render() {
    return (
      <div className="nodes-resources">
        <svg id="canvas" width="100%" height="100%">
          <Logo transform="translate(24,24) scale(0.25)" />
          <ZoomWrapper
            svg="canvas" bounded forwardTransform fixVertical
            zoomLimitsSelector={resourcesZoomLimitsSelector}
            zoomStateSelector={resourcesZoomStateSelector}>
            {transform => this.renderLayout(transform)}
          </ZoomWrapper>
        </svg>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    baseNodesIds: state.get(['nodesByTopologyId', 'hosts'], makeMap()).map(n => n.get('id')),
    layersTopologyIds: layersTopologyIdsSelector(state),
  };
}

export default connect(
  mapStateToProps
)(NodesResources);
