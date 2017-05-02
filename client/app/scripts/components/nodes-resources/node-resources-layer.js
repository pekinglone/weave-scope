import React from 'react';
import { connect } from 'react-redux';
import { fromJS, Map as makeMap } from 'immutable';

import NodeResourcesMetricBox from './node-resources-metric-box';
import {
  nodesActiveMetricByTopologyIdSelector,
} from '../../selectors/resource-view/experimental';


class NodesResourcesLayer extends React.Component {
  nodeImportance(nodeId) {
    const metric = this.props.activeMetricsByNodeId.get(nodeId);
    return -(this.props.topologyId === 'hosts' ?
        metric.get('value') / metric.get('max') :
        metric.get('value'));
  }

  nodeWidth(node) {
    const metric = this.props.activeMetricsByNodeId.get(node.get('id'));
    return this.props.topologyId === 'hosts' ? metric.get('max') : metric.get('value');
  }

  render() {
    const { nodesById, transform, width, scale } = this.props;

    const nodesIds = fromJS(this.props.nodesIds).sortBy(this.nodeImportance);

    let nodeWidthById = nodesById.map(this.nodeWidth);
    const sumOfWidths = nodeWidthById.reduce((r, w) => w, 0);
    const newScale = Math.min(scale, width / sumOfWidths);
    nodeWidthById = nodeWidthById.map(w => w * newScale);

    let nodeOffsetById = makeMap();
    let offset = this.props.offset;
    nodesIds.forEach((nodeId) => {
      nodeOffsetById = nodeOffsetById.set(nodeId, offset);
      offset += nodeWidthById.get(nodeId);
    });

    return (
      <g className="node-resources-layer">
        <g className="node-resources-metric-boxes">
          {nodesIds.toIndexedSeq().map(nodeId => (
            <NodeResourcesMetricBox
              key={nodeId}
              color={nodesById.getIn([nodeId, 'color'])}
              label={nodesById.getIn([nodeId, 'label'])}
              metricSummary={nodesById.getIn([nodeId, 'metricSummary'])}
              width={nodeWidthById.get(nodeId)}
              height={100}
              x={nodeOffsetById.get(nodeId)}
              y={0}
              transform={transform}
            />
          ))}
        </g>
      </g>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    activeMetricsByNodeId: nodesActiveMetricByTopologyIdSelector(state).get(props.topologyId),
    nodesById: state.getIn(['nodesByTopologyId', props.topologyId]),
  };
}

export default connect(
  mapStateToProps
)(NodesResourcesLayer);
