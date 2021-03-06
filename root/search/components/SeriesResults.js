/*
 * @flow
 * Copyright (C) 2018 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import React from 'react';

import {withCatalystContext} from '../../context';
import EntityLink from '../../static/scripts/common/components/EntityLink';
import loopParity from '../../utility/loopParity';
import type {ResultsPropsWithContextT} from '../types';

import PaginatedSearchResults from './PaginatedSearchResults';
import ResultsLayout from './ResultsLayout';

function buildResult(result, index) {
  const series = result.entity;
  const score = result.score;

  return (
    <tr className={loopParity(index)} data-score={score} key={series.id}>
      <td>
        <EntityLink entity={series} />
      </td>
      <td>
        {series.typeName
          ? lp_attributes(series.typeName, 'series_type')
          : null}
      </td>
    </tr>
  );
}

const SeriesResults = ({
  $c,
  form,
  lastUpdated,
  pager,
  query,
  results,
}: ResultsPropsWithContextT<SeriesT>) => (
  <ResultsLayout form={form} lastUpdated={lastUpdated}>
    <PaginatedSearchResults
      buildResult={buildResult}
      columns={
        <>
          <th>{l('Name')}</th>
          <th>{l('Type')}</th>
        </>
      }
      pager={pager}
      query={query}
      results={results}
    />
    {$c.user && !$c.user.is_editing_disabled ? (
      <p>
        {exp.l('Alternatively, you may {uri|add a new series}.', {
          uri: '/series/create?edit-series.name=' + encodeURIComponent(query),
        })}
      </p>
    ) : null}
  </ResultsLayout>
);

export default withCatalystContext(SeriesResults);
