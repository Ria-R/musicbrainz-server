/*
 * @flow
 * Copyright (C) 2018 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';
import uniqBy from 'lodash/uniqBy';

import commaOnlyList from '../static/scripts/common/i18n/commaOnlyList';
import EntityLink from '../static/scripts/common/components/EntityLink';

const displayLabel = (label) => (
  <EntityLink entity={label} />
);

type ReleaseLabelsProps = {
  +labels?: $ReadOnlyArray<ReleaseLabelT>,
};

const ReleaseLabelList = ({labels: releaseLabels}: ReleaseLabelsProps) => {
  if (!releaseLabels || !releaseLabels.length) {
    return null;
  }
  const labels = [];
  for (const releaseLabel of releaseLabels) {
    const label = releaseLabel.label;
    if (label) {
      labels.push(label);
    }
  }
  return commaOnlyList(uniqBy(labels, 'gid').map(displayLabel));
};

export default ReleaseLabelList;
