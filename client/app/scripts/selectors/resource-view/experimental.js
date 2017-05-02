import { Map as makeMap } from 'immutable';
import { createSelector, createStructuredSelector } from 'reselect';
import { createMapSelector } from 'reselect-map';

import { selectedMetricTypeSelector } from '../node-metric';


const nodesActiveMetricSelectorCreator = topologyId => (
  createMapSelector(
    [
      state => state.getIn(['nodesByTopology', topologyId], makeMap()),
      selectedMetricTypeSelector,
    ],
    (node, metricType) => node.get('metrics', makeMap()).find(m => m.get('label') === metricType)
  )
);

const nodesChildrenIdsSelectorCreator = (topologyId, childrenTopologyId) => (
  createSelector(
    [
      state => state.getIn(['nodesByTopology', childrenTopologyId], makeMap()),
    ],
    childrenNodes => childrenNodes
      .map(node => node.get('parents', makeMap()).find(p => p.get('topologyId') === topologyId))
      .groupBy(node => node.get('id'))
  )
);

const structured = selectorCreator => (
  createStructuredSelector({
    hosts: selectorCreator('hosts', 'containers'),
    containers: selectorCreator('containers', 'processes'),
    processes: selectorCreator('processes'),
  })
);

export const nodesActiveMetricByTopologyIdSelector = structured(nodesActiveMetricSelectorCreator);
export const nodesChildrenIdsByTopologyIdSelector = structured(nodesChildrenIdsSelectorCreator);
